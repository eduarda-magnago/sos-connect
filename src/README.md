#  SOS Connect

Uma plataforma web moderna para conectar pessoas em situação de
vulnerabilidade com unidades de apoio, doações e missões de resgate.
Desenvolvida com tecnologias atuais para oferecer uma experiência fluida
e responsiva.

------------------------------------------------------------------------

## 📂 Estrutura do Projeto

O projeto está organizado em três camadas principais:

📁 backend\
📁 frontend-web\
📁 frontend-mobile

-   **backend** → API responsável pelas regras de negócio e integração
    com banco de dados.\
-   **frontend-web** → Aplicação web desenvolvida em React +
    TypeScript.\
-   **frontend-mobile** → Aplicação mobile (estrutura preparada para
    evolução futura).

------------------------------------------------------------------------

## 🌐 Deploy

### 🔹 Backend (API)

API publicada no Render:

https://sos-connect-api.onrender.com/api/support-units

Base URL:

https://sos-connect-api.onrender.com

------------------------------------------------------------------------

### 🔹 Frontend Web

Aplicação publicada na Vercel:

https://sos-connect-frontend-beta.vercel.app/

------------------------------------------------------------------------

## 🛠️ Tecnologias Utilizadas

### Backend

-   Node.js\
-   NestJS\
-   TypeScript\
-   Render (Deploy)

### Frontend Web

-   React\
-   TypeScript\
-   Vite\
-   Vercel (Deploy)

------------------------------------------------------------------------

## ⚙️ Instalação do Projeto (Ambiente Local)

### 🔹 1. Clonar o repositório

``` bash
git clone <url-do-repositorio>
cd nome-do-projeto
```

------------------------------------------------------------------------

### 🔹 2. Backend

``` bash
cd backend
npm install
npm run start:dev
```

Servidor local:\
http://localhost:3000

------------------------------------------------------------------------

### 🔹 3. Frontend Web

``` bash
cd frontend-web
npm install
npm run dev
```

Aplicação local:\
http://localhost:5173

------------------------------------------------------------------------

## 📝 Histórico de Versões

### \[0.1.0\] - 10/05/2026

#### ✨ Adicionado

-   Estrutura inicial do projeto (backend, frontend web)\
-   API de unidades de suporte\
-   Integração frontend com API\
-   Deploy do backend no Render\
-   Deploy do frontend na Vercel
