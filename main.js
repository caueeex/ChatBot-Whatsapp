const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configuração do servidor de arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Objeto para armazenar o estado da conversa de cada usuário
const usuarios = {};

// Estado da conexão
let sock = null;
let qrCodeData = null;

// Função para apagar a pasta auth_info
function apagarAuthInfo() {
    const authInfoPath = path.join(__dirname, "auth_info");
    if (fs.existsSync(authInfoPath)) {
        fs.rmSync(authInfoPath, { recursive: true, force: true });
        console.log("Pasta auth_info apagada com sucesso.");
    }
}

// Função para desconectar o bot
function desconectarBot() {
    if (sock) {
        sock.end(); // Encerra a conexão
        sock = null;
    }
    apagarAuthInfo(); // Apaga a pasta auth_info
    io.emit("disconnected"); // Notifica o frontend que o bot foi desconectado
}

// Função para iniciar a conexão com o WhatsApp
async function iniciarBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState("auth_info");

        sock = makeWASocket({
            auth: state,
            printQRInTerminal: false, // Não exibe o QR Code no terminal
        });

        // Gera o QR Code e envia para o frontend
        sock.ev.on("connection.update", async (update) => {
            const { qr, connection, lastDisconnect } = update;

            if (qr) {
                qrCodeData = await qrcode.toDataURL(qr); // Converte o QR Code para uma URL de imagem
                io.emit("qrCode", qrCodeData); // Envia o QR Code para o frontend
            }

            if (connection === "open") {
                io.emit("connected", true); // Notifica o frontend que a conexão foi estabelecida
            }

            // Reconecta automaticamente em caso de falha
            if (connection === "close") {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
                if (shouldReconnect) {
                    console.log("Reconectando...");
                    setTimeout(iniciarBot, 5000); // Reconecta após 5 segundos
                } else {
                    console.log("Conexão fechada. Por favor, escaneie o QR Code novamente.");
                    io.emit("qrCode", null); // Solicita um novo QR Code
                }
            }
        });

        // Atualiza as credenciais
        sock.ev.on("creds.update", saveCreds);

        // Evento de recebimento de mensagens
        sock.ev.on("messages.upsert", async ({ messages }) => {
            for (const mensagem of messages) {
                // Verifica se a mensagem é de texto e não foi enviada pelo próprio bot
                if (!mensagem.key.fromMe && mensagem.message?.conversation) {
                    const texto = mensagem.message.conversation.toLowerCase();
                    const remetente = mensagem.key.remoteJid;

                    console.log(`📩 Mensagem recebida de ${remetente}: ${texto}`);

                    // Inicia ou continua o fluxo de conversa
                    await gerenciarFluxoConversa(sock, remetente, texto);
                }
            }
        });
    } catch (error) {
        console.error("Erro ao iniciar o bot:", error);
        io.emit("error", "Erro ao conectar. Tente novamente.");
        setTimeout(iniciarBot, 5000); // Tenta reconectar após 5 segundos
    }
}

// Função para gerenciar o fluxo de conversa
async function gerenciarFluxoConversa(sock, remetente, texto) {
    // Inicializa o estado do usuário se não existir
    if (!usuarios[remetente]) {
        usuarios[remetente] = { passo: 1 };
    }

    const usuario = usuarios[remetente];

    switch (usuario.passo) {
        case 1:
            // Saudação inicial
            await sock.sendMessage(remetente, {
                text: "Olá! Bem-vindo ao atendimento do SENAI. Como posso ajudar?",
            });
            await sock.sendMessage(remetente, {
                text: "Por favor nos informe para qual dos itens abaixo você deseja atendimento:\n\n1- Sesi\n2- Senai",
            });
            usuario.passo = 2;
            break;

        case 2:
            // Armazena a escolha (Sesi ou Senai)
            if (texto === "1" || texto === "2") {
                usuario.escolha = texto === "1" ? "Sesi" : "Senai";
                await sock.sendMessage(remetente, {
                    text: "Você concorda com os nossos Termos de Uso e Política de Privacidade?\n\n1- Sim\n2- Não",
                });
                usuario.passo = 3;
            } else {
                await sock.sendMessage(remetente, {
                    text: "Opção inválida. Por favor, digite 1 para Sesi ou 2 para Senai.",
                });
            }
            break;

        case 3:
            // Armazena a resposta sobre os Termos de Uso
            if (texto === "1" || texto === "2") {
                usuario.aceitouTermos = texto === "1";
                if (usuario.aceitouTermos) {
                    await sock.sendMessage(remetente, {
                        text: "Para iniciar seu atendimento, preciso do seu email. Por favor, digite seu email.",
                    });
                    usuario.passo = 4;
                } else {
                    await sock.sendMessage(remetente, {
                        text: "Infelizmente, não podemos continuar sem sua aceitação dos Termos de Uso e Política de Privacidade.",
                    });
                    delete usuarios[remetente]; // Reseta o fluxo
                }
            } else {
                await sock.sendMessage(remetente, {
                    text: "Opção inválida. Por favor, digite 1 para Sim ou 2 para Não.",
                });
            }
            break;

        case 4:
            // Armazena o email
            if (texto.includes("@")) {
                usuario.email = texto;
                await sock.sendMessage(remetente, {
                    text: "Sobre qual assunto você deseja atendimento?\n\n1- Curso Presencial e EAD\n2- Atendimento a Empresas\n3- Emissão de Boleto - SENAI\n4- Documentação/Certificado\n5- RH / Licitações / Arrecadação / Outras áreas",
                });
                usuario.passo = 5;
            } else {
                await sock.sendMessage(remetente, {
                    text: "Email inválido. Por favor, digite um email válido.",
                });
            }
            break;

        case 5:
            // Armazena a opção de atendimento
            if (["1", "2", "3", "4", "5"].includes(texto)) {
                usuario.opcaoAtendimento = texto;
                switch (usuario.opcaoAtendimento) {
                    case "1":
                        await sock.sendMessage(remetente, {
                            text: "Você perguntou sobre Cursos. Como posso te ajudar?\n\n1- Cursos de Curta Duração (Presencial)\n2- Cursos de Curta Duração a Distância (EAD)\n3- Cursos de Curta Duração (Bolsa de Estudos)\n4- Curso Regular (Aprendizagem Industrial)\n5- Curso Regular (Técnico)\n6- Curso Regular (Faculdade)\n7- Curso Regular (Pós Graduação)",
                        });
                        usuario.passo = 6;
                        break;
                    case "2":
                        await sock.sendMessage(remetente, {
                            text: "Você perguntou sobre Atendimento às Empresas. Como posso te ajudar?\n\n1- Serviços Laboratoriais\n2- Assessoria\n3- Inovação\n4- Contratação de Alunos",
                        });
                        usuario.passo = 7;
                        break;
                    case "3":
                        await sock.sendMessage(remetente, {
                            text: "Para emissão de boleto, entre em contato conosco pelo site: https://www.senai.br/ou pelo telefone (XX) XXXX-XXXX.",
                        });
                        usuario.passo = 8; // Finaliza o fluxo
                        break;
                    case "4":
                        await sock.sendMessage(remetente, {
                            text: "Para documentação/certificado, entre em contato conosco pelo site: https://www.senai.br/ou pelo telefone (XX) XXXX-XXXX.",
                        });
                        usuario.passo = 8; // Finaliza o fluxo
                        break;
                    case "5":
                        await sock.sendMessage(remetente, {
                            text: "Para RH / Licitações / Arrecadação / Outras áreas, entre em contato conosco pelo site: https://www.senai.br/ou pelo telefone (XX) XXXX-XXXX.",
                        });
                        usuario.passo = 8; // Finaliza o fluxo
                        break;
                    default:
                        await sock.sendMessage(remetente, {
                            text: "Opção inválida. Por favor, digite o número da opção desejada.",
                        });
                        break;
                }
            } else {
                await sock.sendMessage(remetente, {
                    text: "Opção inválida. Por favor, digite o número da opção desejada.",
                });
            }
            break;

        case 6:
            // Opções de Cursos
            if (["1", "2", "3", "4", "5", "6", "7"].includes(texto)) {
                await sock.sendMessage(remetente, {
                    text: "Antes de concluirmos, suas dúvidas foram esclarecidas?\n\n1- Sim\n2- Não",
                });
                usuario.passo = 8;
            } else {
                await sock.sendMessage(remetente, {
                    text: "Opção inválida. Por favor, digite o número da opção desejada.",
                });
            }
            break;

        case 7:
            // Opções de Atendimento a Empresas
            if (["1", "2", "3", "4"].includes(texto)) {
                await sock.sendMessage(remetente, {
                    text: "Antes de concluirmos, suas dúvidas foram esclarecidas?\n\n1- Sim\n2- Não",
                });
                usuario.passo = 8;
            } else {
                await sock.sendMessage(remetente, {
                    text: "Opção inválida. Por favor, digite o número da opção desejada.",
                });
            }
            break;

        case 8:
            // Finalização do atendimento
            if (texto === "1" || texto === "2") {
                if (texto === "1") {
                    await sock.sendMessage(remetente, {
                        text: "Que bom que suas dúvidas foram esclarecidas! Obrigado por entrar em contato.",
                    });
                } else {
                    await sock.sendMessage(remetente, {
                        text: "Podemos recomeçar o atendimento por aqui ou você pode enviar seu questionamento por escrito para ser respondido por um atendente. O que você prefere?\n\n1- Responder formulário\n2- Retornar ao menu\n3- Falar com Atendente",
                    });
                    usuario.passo = 9;
                }
            } else {
                await sock.sendMessage(remetente, {
                    text: "Opção inválida. Por favor, digite 1 para Sim ou 2 para Não.",
                });
            }
            break;

        case 9:
            // Opções de finalização
            if (["1", "2", "3"].includes(texto)) {
                switch (texto) {
                    case "1":
                        await sock.sendMessage(remetente, {
                            text: "Por favor, acesse o formulário em: https://www.senai.br/formulario",
                        });
                        break;
                    case "2":
                        await sock.sendMessage(remetente, {
                            text: "Retornando ao menu principal...",
                        });
                        usuario.passo = 1; // Reinicia o fluxo
                        break;
                    case "3":
                        await sock.sendMessage(remetente, {
                            text: "Por favor, entre em contato conosco pelo telefone (XX) XXXX-XXXX.",
                        });
                        break;
                }
                delete usuarios[remetente]; // Finaliza o fluxo
            } else {
                await sock.sendMessage(remetente, {
                    text: "Opção inválida. Por favor, digite o número da opção desejada.",
                });
            }
            break;

        default:
            await sock.sendMessage(remetente, {
                text: "Ocorreu um erro no fluxo de atendimento. Por favor, tente novamente.",
            });
            delete usuarios[remetente]; // Reseta o fluxo
            break;
    }
}

// Inicia a conexão quando o cliente clica no botão
io.on("connection", (socket) => {
    console.log("Cliente conectado ao Socket.IO");

    socket.on("iniciarConexao", () => {
        iniciarBot();
    });

    socket.on("desconectarBot", () => {
        desconectarBot();
    });
});

// Inicia o servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});