# ChatBot WhatsApp - SENAI

Este projeto é um bot de atendimento automatizado para WhatsApp, desenvolvido para interagir com usuários e fornecer informações sobre cursos, atendimento a empresas, emissão de boletos, documentação e outras áreas relacionadas ao SENAI. O bot utiliza a biblioteca `@whiskeysockets/baileys` para se conectar ao WhatsApp e uma interface web para exibir o QR Code e o status da conexão.

## Funcionalidades

- **Conexão ao WhatsApp**: O bot se conecta ao WhatsApp através de um QR Code exibido na interface web.
- **Atendimento Automatizado**: O bot responde a mensagens com base em um fluxo de conversa pré-definido.
- **Interface Web**: Uma interface simples permite conectar e desconectar o bot, além de exibir o QR Code e o status da conexão.
- **Suporte a Múltiplos Usuários**: Várias pessoas podem interagir com o bot simultaneamente.
- **Reconexão Automática**: O bot tenta reconectar automaticamente em caso de falhas na conexão.

## Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM (geralmente instalado com o Node.js)
- Uma conta no WhatsApp (para escanear o QR Code)

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
Navegue até o diretório do projeto:

bash
Copy
cd nome-do-repositorio
Instale as dependências:

bash
Copy
npm install
Crie um arquivo .env na raiz do projeto e adicione as variáveis de ambiente necessárias (se houver):

env
Copy
# Exemplo de variáveis de ambiente
PORT=3000
Como Usar
Inicie o servidor:

bash
Copy
node main.js
Acesse a interface web no navegador:

Copy
http://localhost:3000
Clique em Conectar e escaneie o QR Code exibido usando o WhatsApp no seu celular.

Após a conexão, o bot estará pronto para receber e responder mensagens.

Estrutura do Projeto
main.js: Ponto de entrada do servidor, responsável por gerenciar a conexão com o WhatsApp e o fluxo de conversa.

public/: Contém os arquivos estáticos (HTML, CSS, JavaScript) da interface web.

index.html: Interface principal do usuário.

styles.css: Estilos CSS para a interface.

script.js: Lógica JavaScript para interação com o servidor.

auth_info/: Pasta gerada automaticamente para armazenar as credenciais de autenticação do WhatsApp.

Contribuição
Contribuições são bem-vindas! Siga os passos abaixo:

Faça um fork do projeto.

Crie uma branch para sua feature (git checkout -b feature/nova-feature).

Commit suas alterações (git commit -m 'Adiciona nova feature').

Faça push para a branch (git push origin feature/nova-feature).

Abra um Pull Request.

Licença
Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais detalhes.

Contato
Se tiver dúvidas ou sugestões, entre em contato:

Nome: [Seu Nome]

Email: [seu-email@example.com]

GitHub: seu-usuario

Copy

---

### **Como Subir para o GitHub:**

1. **Crie um Repositório no GitHub**:
   - Acesse o GitHub e crie um novo repositório.
   - Dê um nome ao repositório e configure as opções desejadas.

2. **Inicialize o Git no Projeto**:
   - No terminal, navegue até a pasta do projeto e execute:

     ```bash
     git init
     ```

3. **Adicione os Arquivos ao Repositório**:
   - Adicione todos os arquivos ao repositório:

     ```bash
     git add .
     ```

4. **Commit as Alterações**:
   - Faça o primeiro commit:

     ```bash
     git commit -m "Initial commit"
     ```

5. **Conecte ao Repositório Remoto**:
   - Adicione o repositório remoto do GitHub:

     ```bash
     git remote add origin https://github.com/seu-usuario/nome-do-repositorio.git
     ```

6. **Envie as Alterações para o GitHub**:
   - Faça o push das alterações:

     ```bash
     git push -u origin main
     ```

---

### **Próximos Passos:**

1. **Atualize o README**:
   - Personalize o `README.md` com as informações do seu projeto.

2. **Adicione uma Licença**:
   - Crie um arquivo `LICENSE` na raiz do projeto com a licença escolhida (por exemplo, MIT).

3. **Compartilhe o Projeto**:
   - Compartilhe o link do repositório no GitHub com outras pessoas.

Se precisar de mais ajuda, é só avisar! 😊
