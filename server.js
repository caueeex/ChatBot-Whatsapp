const express = require("express");
const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configuração do servidor de arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Estado da conexão
let sock = null;
let qrCodeData = null;

// Função para iniciar a conexão com o WhatsApp
async function iniciarConexao() {
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
                    iniciarConexao();
                } else {
                    console.log("Conexão fechada. Por favor, escaneie o QR Code novamente.");
                    io.emit("qrCode", null); // Solicita um novo QR Code
                }
            }
        });

        // Atualiza as credenciais
        sock.ev.on("creds.update", saveCreds);
    } catch (error) {
        console.error("Erro ao iniciar a conexão:", error);
        io.emit("error", "Erro ao conectar. Tente novamente.");
    }
}

// Inicia a conexão quando o cliente clica no botão
io.on("connection", (socket) => {
    console.log("Cliente conectado ao Socket.IO");

    socket.on("iniciarConexao", () => {
        iniciarConexao();
    });
});

// Inicia o servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});