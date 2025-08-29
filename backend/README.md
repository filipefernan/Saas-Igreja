# SaaS Igreja - Backend API

API REST em Node.js para o sistema SaaS Igreja.

## 🚀 **Instalação**

### 1. Instalar dependências:
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente:
```bash
# Copie o arquivo .env e configure suas credenciais
cp .env.example .env
```

### 3. Configurar Supabase:
- Edite o arquivo `.env`
- Adicione sua `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### 4. Executar:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📍 **Rotas da API**

### 🔐 **Autenticação** (`/api/auth`)
- `POST /login` - Fazer login
- `POST /cadastro` - Criar conta
- `POST /logout` - Fazer logout

### 👤 **Usuário** (`/api/usuario`)
- `GET /perfil` - Obter dados do usuário
- `PUT /perfil` - Atualizar perfil
- `GET /onboarding-status` - Verificar onboarding

### ⛪ **Igreja** (`/api/igreja`)
- `GET /dados` - Obter dados da igreja
- `POST /criar` - Criar nova igreja
- `PUT /atualizar` - Atualizar dados

### 📋 **Onboarding** (`/api/onboarding`)
- `POST /completar` - Completar onboarding
- `GET /status` - Verificar status

### 💊 **Health Check**
- `GET /api/saude` - Status do servidor

## 📁 **Estrutura**

```
backend/
├── server.js              # Servidor principal
├── routes/                 # Rotas modulares
│   ├── auth.js            # Autenticação
│   ├── usuario.js         # Usuário
│   ├── igreja.js          # Igreja
│   └── onboarding.js      # Onboarding
├── utils/                  # Utilitários
│   ├── supabase.js        # Cliente Supabase
│   └── response.js        # Padronização de respostas
├── .env                   # Variáveis de ambiente
└── package.json          # Dependências

```

## 🔧 **Configuração**

O backend usa:
- **Express.js** para API REST
- **Supabase** como banco de dados
- **CORS** habilitado para o frontend
- **Rate limiting** para segurança
- **Helmet** para headers de segurança

## 🌐 **URL do Servidor**

- **Desenvolvimento**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/saude