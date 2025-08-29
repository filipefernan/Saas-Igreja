import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configurações do Supabase não encontradas. Verifique as variáveis de ambiente.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para verificar autenticação
export const verificarAuth = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token de autenticação não fornecido');
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new Error('Token inválido');
    }

    return user;
  } catch (error) {
    throw new Error('Falha na autenticação');
  }
};