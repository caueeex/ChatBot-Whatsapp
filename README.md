# ChatBot WhatsApp - SENAI

Este projeto é um bot de atendimento automatizado para WhatsApp, desenvolvido para interagir com usuários e fornecer informações sobre cursos, atendimento a empresas, emissão de boletos, documentação e outras áreas relacionadas ao SENAI. O bot utiliza a biblioteca `@whiskeysockets/baileys` para se conectar ao WhatsApp e uma interface web para exibir o QR Code e o status da conexão.

## 📌 Funcionalidades

- **Conexão ao WhatsApp**: O bot se conecta ao WhatsApp através de um QR Code exibido na interface web.
- **Atendimento Automatizado**: O bot responde a mensagens com base em um fluxo de conversa pré-definido.
- **Interface Web**: Interface simples para conectar/desconectar o bot, além de exibir o QR Code e o status da conexão.
- **Suporte a Múltiplos Usuários**: Várias pessoas podem interagir com o bot simultaneamente.
- **Reconexão Automática**: O bot tenta se reconectar automaticamente em caso de falhas na conexão.

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter os seguintes requisitos instalados:

- Node.js (versão 16 ou superior)
- NPM (geralmente instalado com o Node.js)
- Uma conta no WhatsApp (para escanear o QR Code)

## 🚀 Instalação

1. **Clone este repositório:**
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   ```

2. **Acesse o diretório do projeto:**
   ```bash
   cd nome-do-repositorio
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias (se houver):**
   ```env
   PORT=3000
   ```

## ▶️ Como Usar

1. **Inicie o servidor:**
   ```bash
   node main.js
   ```

2. **Acesse a interface web no navegador:**
   ```
   http://localhost:3000
   ```

3. **Clique em "Conectar" e escaneie o QR Code exibido usando o WhatsApp no seu celular.**

Após a conexão, o bot estará pronto para receber e responder mensagens.

## 📂 Estrutura do Projeto

```
📁 nome-do-repositorio
├── 📄 main.js         # Ponto de entrada do servidor
├── 📁 public/         # Arquivos estáticos (HTML, CSS, JavaScript)
│   ├── index.html    # Interface principal do usuário
│   ├── styles.css    # Estilos da interface
│   ├── script.js     # Lógica JavaScript da interface
├── 📁 auth_info/      # Credenciais de autenticação do WhatsApp (gerado automaticamente)
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para colaborar:

1. Faça um **fork** do projeto.
2. Crie uma **branch** para sua feature:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Faça suas alterações e **commit**:
   ```bash
   git commit -m "Adiciona nova feature"
   ```
4. Faça **push** para a branch:
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um **Pull Request**.

## 📜 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

## 📬 Contato

Caso tenha dúvidas ou sugestões, entre em contato:

- **Nome**: [Seu Nome]
- **Email**: [seu-email@example.com]
- **GitHub**: [seu-usuario](https://github.com/seu-usuario)

## 🔄 Como Subir para o GitHub

1. **Crie um Repositório no GitHub:**
   - Acesse o [GitHub](https://github.com) e crie um novo repositório.
   - Defina um nome e configure as opções desejadas.

2. **Inicialize o Git no projeto:**
   ```bash
   git init
   ```

3. **Adicione os arquivos ao repositório:**
   ```bash
   git add .
   ```

4. **Faça o primeiro commit:**
   ```bash
   git commit -m "Initial commit"
   ```

5. **Conecte ao repositório remoto:**
   ```bash
   git remote add origin https://github.com/seu-usuario/nome-do-repositorio.git
   ```

6. **Envie as alterações para o GitHub:**
   ```bash
   git push -u origin main
   ```

### 🎯 Próximos Passos

- Personalize o `README.md` com mais detalhes sobre seu projeto.
- Adicione um arquivo `LICENSE` para definir a licença do projeto.
- Compartilhe o link do repositório no GitHub com sua equipe e comunidade!

Se precisar de mais ajuda, é só avisar! 😊

