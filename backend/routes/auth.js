import express from 'express';
import { supabase } from '../utils/supabase.js';
import { sucesso, erro, criado } from '../utils/response.js';

const router = express.Router();

// POST /api/auth/login - Fazer login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return erro(res, 'Email e senha são obrigatórios', 400);
    }

    // Autenticar com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error) {
      return erro(res, 'Credenciais inválidas', 401);
    }

    // Verificar/criar usuário na tabela usuarios
    let usuario = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_id', data.user.id)
      .single();

    if (usuario.error) {
      // Criar usuário se não existir
      const novoUsuario = await supabase
        .from('usuarios')
        .insert({
          auth_id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
          church_id: null,
          onboarding_completed: false
        })
        .select()
        .single();

      if (novoUsuario.error) {
        return erro(res, 'Erro ao criar usuário', 500);
      }
      usuario = novoUsuario;
    }

    console.log('✅ Login bem-sucedido, retornando dados do usuário:', usuario.data);
    
    return sucesso(res, {
      token: data.session.access_token,
      usuario: usuario.data,
      expires_at: data.session.expires_at
    }, 'Login realizado com sucesso');

  } catch (error) {
    console.error('Erro no login:', error);
    return erro(res, 'Erro interno do servidor', 500);
  }
});

// POST /api/auth/cadastro - Criar conta
router.post('/cadastro', async (req, res) => {
  try {
    const { email, senha, nome } = req.body;

    if (!email || !senha) {
      return erro(res, 'Email e senha são obrigatórios', 400);
    }

    // Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { name: nome }
      }
    });

    if (error) {
      return erro(res, error.message, 400);
    }

    return criado(res, {
      mensagem: 'Conta criada! Verifique seu email para confirmar.'
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    return erro(res, 'Erro interno do servidor', 500);
  }
});

// POST /api/auth/logout - Fazer logout
router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return erro(res, 'Erro ao fazer logout', 500);
    }

    return sucesso(res, null, 'Logout realizado com sucesso');

  } catch (error) {
    console.error('Erro no logout:', error);
    return erro(res, 'Erro interno do servidor', 500);
  }
});

export default router;