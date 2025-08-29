# Configuração do Supabase - SaaS Igreja

## 🚀 **Passo a Passo**

### 1. **Criar Projeto no Supabase**
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Escolha sua Organization
4. Configure:
   - **Name**: `saas-igreja`
   - **Database Password**: Anote essa senha!
   - **Region**: South America (São Paulo)
5. Clique em "Create new project"

### 2. **Executar Schema SQL**
1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"
5. Aguarde a execução (pode demorar alguns segundos)

### 3. **Obter Credenciais**
1. Vá para **Settings** > **API**
2. Copie:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIs...`

### 4. **Configurar Variáveis de Ambiente**

#### **Localmente (.env.local)**
```bash
GEMINI_API_KEY=AIzaSyBwTdCM9vkEvActxg0F42ApKgxmYySvq70

# Supabase Configuration
VITE_SUPABASE_URL=https://sua-url-aqui.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

#### **No Railway**
1. Acesse seu projeto no Railway
2. Vá para **Variables**
3. Adicione:
   - `VITE_SUPABASE_URL`: `https://sua-url-aqui.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sua-anon-key-aqui`
4. Deploy automaticamente

### 5. **Configurar Autenticação**
1. No Supabase, vá para **Authentication** > **Settings**
2. Configure:
   - **Site URL**: `http://localhost:5173` (desenvolvimento)
   - **Additional Redirect URLs**: Sua URL do Railway (produção)

## 🔧 **Estrutura do Banco**

### **Tabelas Principais**
- `churches` - Dados das igrejas
- `users` - Usuários (pastores/administradores)  
- `agent_settings` - Configurações do agente IA
- `schedules` - Programação fixa
- `events` - Eventos especiais
- `faqs` - Perguntas frequentes
- `pastoral_availability` - Disponibilidade do pastor
- `pastoral_appointments` - Agendamentos
- `prayer_requests` - Pedidos de oração
- `ministries` - Ministérios
- `ministry_leaders` - Líderes dos ministérios
- `ministry_events` - Programação dos ministérios
- `uploaded_files` - Arquivos enviados
- `financial_info` - Dados financeiros
- `chat_messages` - Histórico de conversas

### **Segurança (RLS)**
- ✅ Row Level Security ativado
- ✅ Políticas de acesso por igreja
- ✅ Isolamento completo entre igrejas
- ✅ Usuários só veem dados da própria igreja

## 🔐 **Recursos de Segurança**

### **Row Level Security (RLS)**
- Cada igreja só vê seus próprios dados
- Função `get_current_church_id()` para controle de acesso
- Políticas automáticas em todas as tabelas

### **Autenticação**
- Email/senha nativo do Supabase
- JWT automático
- Session management incluso

## 📊 **Dados de Exemplo**
O schema já inclui:
- Igreja exemplo ("Igreja Exemplo")
- Configuração inicial do agente
- Estruturas básicas para testar

## 🚨 **Importantes**

### **Antes de Usar**
1. ✅ Execute o schema SQL completo
2. ✅ Configure as variáveis de ambiente
3. ✅ Teste a conexão localmente
4. ✅ Configure no Railway

### **Produção**
1. Ative **Enable RLS** em todas as tabelas
2. Configure **Redirect URLs** corretas
3. Use **Database Password** forte
4. Monitore uso através do dashboard Supabase

## 🔄 **Próximos Passos**
Após configurar o Supabase:
1. Migrar contexto do localStorage para Supabase
2. Implementar autenticação real
3. Conectar formulários ao banco
4. Implementar real-time subscriptions

## 🆘 **Troubleshooting**

### **Erro "Invalid API Key"**
- Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão corretos
- Certifique-se de usar as variáveis com prefixo `VITE_`

### **Erro "Row Level Security"**
- Execute `SELECT * FROM auth.users()` para verificar autenticação
- Verifique se as policies estão ativas

### **Erro de CORS**
- Configure Site URL nas configurações do Supabase Auth
- Adicione URLs de desenvolvimento e produção

---

*Configuração criada em 28/08/2025*