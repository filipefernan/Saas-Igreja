-- SaaS Igreja - Schema Supabase
-- Execute este script no SQL Editor do Supabase

-- Enable RLS (Row Level Security) por padrão
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABELA: churches (Igrejas)
-- ========================================
CREATE TABLE churches (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    pastor_name VARCHAR(255),
    pastor_bio TEXT,
    profile_picture TEXT, -- URL da foto
    website_url TEXT,
    instagram_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: users (Usuários/Pastores)
-- ========================================
CREATE TABLE users (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link com Supabase Auth
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_picture TEXT,
    role VARCHAR(50) DEFAULT 'admin', -- admin, pastor, secretary
    credits INT4 DEFAULT 23000,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: agent_settings (Configurações do Agente IA)
-- ========================================
CREATE TABLE agent_settings (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    name VARCHAR(255) DEFAULT 'Assistente Virtual',
    personality TEXT DEFAULT 'Amigável e prestativo',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: schedules (Programação Fixa)
-- ========================================
CREATE TABLE schedules (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    day VARCHAR(50) NOT NULL, -- 'Segunda-feira', 'Terça-feira', etc.
    time VARCHAR(10) NOT NULL, -- 'HH:MM'
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: events (Eventos Especiais)
-- ========================================
CREATE TABLE events (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE, -- Opcional para eventos de múltiplos dias
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: faqs (Perguntas Frequentes)
-- ========================================
CREATE TABLE faqs (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: pastoral_availability (Disponibilidade do Pastor)
-- ========================================
CREATE TABLE pastoral_availability (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    day VARCHAR(50) NOT NULL, -- 'Segunda-feira', 'Terça-feira', etc.
    start_time VARCHAR(10) NOT NULL, -- 'HH:MM'
    end_time VARCHAR(10) NOT NULL, -- 'HH:MM'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: pastoral_appointments (Agendamentos Pastorais)
-- ========================================
CREATE TABLE pastoral_appointments (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    person_name VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(10) NOT NULL, -- 'HH:MM'
    type VARCHAR(50) DEFAULT 'Aconselhamento', -- 'Aconselhamento', 'Oração'
    status VARCHAR(50) DEFAULT 'agendado', -- 'agendado', 'concluido', 'cancelado'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: prayer_requests (Pedidos de Oração)
-- ========================================
CREATE TABLE prayer_requests (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    contato VARCHAR(255), -- Email ou telefone (opcional)
    motivo TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ativo', -- 'ativo', 'atendido'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: ministries (Ministérios)
-- ========================================
CREATE TABLE ministries (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL,
    how_to_join TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: ministry_leaders (Líderes de Ministérios)
-- ========================================
CREATE TABLE ministry_leaders (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ministry_id INT4 REFERENCES ministries(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL, -- Telefone, email, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: ministry_events (Programação dos Ministérios)
-- ========================================
CREATE TABLE ministry_events (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ministry_id INT4 REFERENCES ministries(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    day VARCHAR(50) NOT NULL, -- 'Segunda-feira', etc.
    time VARCHAR(10) NOT NULL, -- 'HH:MM'
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: uploaded_files (Arquivos Enviados)
-- ========================================
CREATE TABLE uploaded_files (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL, -- Caminho no Supabase Storage
    file_size BIGINT,
    mime_type VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: financial_info (Informações Financeiras)
-- ========================================
CREATE TABLE financial_info (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    banco VARCHAR(255),
    agencia VARCHAR(50),
    conta VARCHAR(50),
    chave_pix VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TABELA: chat_messages (Histórico de Chat - opcional)
-- ========================================
CREATE TABLE chat_messages (
    id INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    church_id INT4 REFERENCES churches(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL, -- 'user', 'ai', 'human'
    sender_name VARCHAR(255),
    message_text TEXT NOT NULL,
    metadata JSONB, -- Para armazenar fontes, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TRIGGERS para updated_at automático
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers nas tabelas principais
CREATE TRIGGER update_churches_updated_at BEFORE UPDATE ON churches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_settings_updated_at BEFORE UPDATE ON agent_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pastoral_availability_updated_at BEFORE UPDATE ON pastoral_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pastoral_appointments_updated_at BEFORE UPDATE ON pastoral_appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ministries_updated_at BEFORE UPDATE ON ministries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_info_updated_at BEFORE UPDATE ON financial_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastoral_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastoral_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministry_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS RLS (Row Level Security)
-- ========================================

-- Função para obter church_id do usuário atual
CREATE OR REPLACE FUNCTION get_current_church_id()
RETURNS INT4 AS $$
DECLARE
    user_church_id INT4;
BEGIN
    SELECT church_id INTO user_church_id
    FROM users 
    WHERE auth_id = auth.uid()
    LIMIT 1;
    
    RETURN COALESCE(user_church_id, -1); -- Retorna -1 se não encontrar
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para todas as tabelas relacionadas à igreja
-- Políticas para tabela churches
CREATE POLICY "Users can create their church" ON churches
    FOR INSERT WITH CHECK (true); -- Qualquer usuário autenticado pode criar uma igreja

CREATE POLICY "Users can see and update their own church" ON churches
    FOR ALL USING (id = get_current_church_id());

-- Política para tabela users - permite criar usuário inicial e ver apenas seus dados
CREATE POLICY "Users can insert their own record" ON users
    FOR INSERT WITH CHECK (auth_id = auth.uid());

CREATE POLICY "Users can see and update their own record" ON users
    FOR ALL USING (auth_id = auth.uid());

-- Políticas para tabela agent_settings
CREATE POLICY "Users can create agent settings for their church" ON agent_settings
    FOR INSERT WITH CHECK (true); -- Permitir criação durante onboarding

CREATE POLICY "Users can see and update their own church agent settings" ON agent_settings
    FOR ALL USING (church_id = get_current_church_id());

CREATE POLICY "Users can only see their own church data" ON schedules
    FOR ALL USING (church_id = get_current_church_id());

CREATE POLICY "Users can only see their own church data" ON events
    FOR ALL USING (church_id = get_current_church_id());

CREATE POLICY "Users can only see their own church data" ON faqs
    FOR ALL USING (church_id = get_current_church_id());

CREATE POLICY "Users can only see their own church data" ON pastoral_availability
    FOR ALL USING (church_id = get_current_church_id());

CREATE POLICY "Users can only see their own church data" ON pastoral_appointments
    FOR ALL USING (church_id = get_current_church_id());

CREATE POLICY "Users can only see their own church data" ON prayer_requests
    FOR ALL USING (church_id = get_current_church_id());

CREATE POLICY "Users can only see their own church data" ON ministries
    FOR ALL USING (church_id = get_current_church_id());

CREATE POLICY "Users can only see their own church data" ON ministry_leaders
    FOR ALL USING (ministry_id IN (SELECT id FROM ministries WHERE church_id = get_current_church_id()));

CREATE POLICY "Users can only see their own church data" ON ministry_events
    FOR ALL USING (ministry_id IN (SELECT id FROM ministries WHERE church_id = get_current_church_id()));

CREATE POLICY "Users can only see their own church data" ON uploaded_files
    FOR ALL USING (church_id = get_current_church_id());

CREATE POLICY "Users can only see their own church data" ON financial_info
    FOR ALL USING (church_id = get_current_church_id());

CREATE POLICY "Users can only see their own church data" ON chat_messages
    FOR ALL USING (church_id = get_current_church_id());

-- ========================================
-- DADOS DE EXEMPLO (opcional)
-- ========================================

-- Igreja de exemplo
INSERT INTO churches (name, address, pastor_name, pastor_bio, profile_picture) 
VALUES (
    'Igreja Exemplo', 
    'Rua da Paz, 123', 
    'Pastor João Silva',
    'Pastor há 15 anos, dedicado ao ministério e ao cuidado das ovelhas.',
    'https://api.dicebear.com/7.x/bottts/svg?seed=pastor'
);

-- Configuração inicial do agente
INSERT INTO agent_settings (church_id, name, personality)
VALUES (1, 'Assistente Virtual', 'Amigável e prestativo');

-- Informação financeira inicial
INSERT INTO financial_info (church_id, banco, agencia, conta, chave_pix)
VALUES (1, '', '', '', '');

-- ÍNDICES para performance
CREATE INDEX idx_users_church_id ON users(church_id);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_schedules_church_id ON schedules(church_id);
CREATE INDEX idx_events_church_id ON events(church_id);
CREATE INDEX idx_faqs_church_id ON faqs(church_id);
CREATE INDEX idx_pastoral_appointments_church_id ON pastoral_appointments(church_id);
CREATE INDEX idx_prayer_requests_church_id ON prayer_requests(church_id);
CREATE INDEX idx_ministries_church_id ON ministries(church_id);
CREATE INDEX idx_chat_messages_church_id ON chat_messages(church_id);