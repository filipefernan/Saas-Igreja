import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL e Anon Key são obrigatórios. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente.');
}

// Cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ========================================
// TIPOS PARA O BANCO
// ========================================
export interface Database {
    public: {
        Tables: {
            churches: {
                Row: {
                    id: number;
                    name: string;
                    address: string | null;
                    pastor_name: string | null;
                    pastor_bio: string | null;
                    profile_picture: string | null;
                    website_url: string | null;
                    instagram_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    name: string;
                    address?: string | null;
                    pastor_name?: string | null;
                    pastor_bio?: string | null;
                    profile_picture?: string | null;
                    website_url?: string | null;
                    instagram_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    name?: string;
                    address?: string | null;
                    pastor_name?: string | null;
                    pastor_bio?: string | null;
                    profile_picture?: string | null;
                    website_url?: string | null;
                    instagram_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            users: {
                Row: {
                    id: number;
                    church_id: number;
                    auth_id: string;
                    name: string;
                    email: string;
                    profile_picture: string | null;
                    role: string;
                    credits: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    auth_id: string;
                    name: string;
                    email: string;
                    profile_picture?: string | null;
                    role?: string;
                    credits?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    auth_id?: string;
                    name?: string;
                    email?: string;
                    profile_picture?: string | null;
                    role?: string;
                    credits?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            agent_settings: {
                Row: {
                    id: number;
                    church_id: number;
                    name: string;
                    personality: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    name?: string;
                    personality?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    name?: string;
                    personality?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            schedules: {
                Row: {
                    id: number;
                    church_id: number;
                    day: string;
                    time: string;
                    description: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    day: string;
                    time: string;
                    description: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    day?: string;
                    time?: string;
                    description?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            events: {
                Row: {
                    id: number;
                    church_id: number;
                    name: string;
                    description: string | null;
                    start_date: string;
                    end_date: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    name: string;
                    description?: string | null;
                    start_date: string;
                    end_date?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    name?: string;
                    description?: string | null;
                    start_date?: string;
                    end_date?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            faqs: {
                Row: {
                    id: number;
                    church_id: number;
                    question: string;
                    answer: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    question: string;
                    answer: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    question?: string;
                    answer?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            pastoral_availability: {
                Row: {
                    id: number;
                    church_id: number;
                    day: string;
                    start_time: string;
                    end_time: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    day: string;
                    start_time: string;
                    end_time: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    day?: string;
                    start_time?: string;
                    end_time?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            pastoral_appointments: {
                Row: {
                    id: number;
                    church_id: number;
                    person_name: string;
                    subject: string;
                    appointment_date: string;
                    appointment_time: string;
                    type: string;
                    status: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    person_name: string;
                    subject: string;
                    appointment_date: string;
                    appointment_time: string;
                    type?: string;
                    status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    person_name?: string;
                    subject?: string;
                    appointment_date?: string;
                    appointment_time?: string;
                    type?: string;
                    status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            prayer_requests: {
                Row: {
                    id: number;
                    church_id: number;
                    nome: string;
                    contato: string | null;
                    motivo: string;
                    status: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    nome: string;
                    contato?: string | null;
                    motivo: string;
                    status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    nome?: string;
                    contato?: string | null;
                    motivo?: string;
                    status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            ministries: {
                Row: {
                    id: number;
                    church_id: number;
                    name: string;
                    purpose: string;
                    how_to_join: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    name: string;
                    purpose: string;
                    how_to_join?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    name?: string;
                    purpose?: string;
                    how_to_join?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            ministry_leaders: {
                Row: {
                    id: number;
                    ministry_id: number;
                    name: string;
                    contact: string;
                    created_at: string;
                };
                Insert: {
                    id?: never;
                    ministry_id: number;
                    name: string;
                    contact: string;
                    created_at?: string;
                };
                Update: {
                    id?: never;
                    ministry_id?: number;
                    name?: string;
                    contact?: string;
                    created_at?: string;
                };
            };
            ministry_events: {
                Row: {
                    id: number;
                    ministry_id: number;
                    name: string;
                    day: string;
                    time: string;
                    location: string;
                    created_at: string;
                };
                Insert: {
                    id?: never;
                    ministry_id: number;
                    name: string;
                    day: string;
                    time: string;
                    location: string;
                    created_at?: string;
                };
                Update: {
                    id?: never;
                    ministry_id?: number;
                    name?: string;
                    day?: string;
                    time?: string;
                    location?: string;
                    created_at?: string;
                };
            };
            uploaded_files: {
                Row: {
                    id: number;
                    church_id: number;
                    name: string;
                    file_path: string;
                    file_size: number | null;
                    mime_type: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    name: string;
                    file_path: string;
                    file_size?: number | null;
                    mime_type?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    name?: string;
                    file_path?: string;
                    file_size?: number | null;
                    mime_type?: string | null;
                    created_at?: string;
                };
            };
            financial_info: {
                Row: {
                    id: number;
                    church_id: number;
                    banco: string | null;
                    agencia: string | null;
                    conta: string | null;
                    chave_pix: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: never;
                    church_id: number;
                    banco?: string | null;
                    agencia?: string | null;
                    conta?: string | null;
                    chave_pix?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: never;
                    church_id?: number;
                    banco?: string | null;
                    agencia?: string | null;
                    conta?: string | null;
                    chave_pix?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}

// ========================================
// FUNÇÕES HELPER PARA AUTENTICAÇÃO
// ========================================

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

export const getCurrentChurchUser = async () => {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('users')
        .select('*, churches(*)')
        .eq('auth_id', user.id)
        .single();

    if (error) {
        console.error('Erro ao buscar usuário da igreja:', error);
        return null;
    }

    return data;
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
};

export const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};