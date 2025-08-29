import express from 'express';
import { supabase, verificarAuth } from '../utils/supabase.js';
import { sucesso, erro, naoAutorizado } from '../utils/response.js';

const router = express.Router();

// GET /api/usuario/perfil - Obter dados do usuário
router.get('/perfil', async (req, res) => {
  try {
    const user = await verificarAuth(req.headers.authorization);

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        churches (
          id,
          name,
          pastor_name,
          profile_picture
        )
      `)
      .eq('auth_id', user.id)
      .single();

    if (error) {
      return erro(res, 'Usuário não encontrado', 404);
    }

    return sucesso(res, usuario, 'Perfil obtido com sucesso');

  } catch (error) {
    if (error.message.includes('autenticação')) {
      return naoAutorizado(res, error.message);
    }
    return erro(res, 'Erro interno do servidor', 500);
  }
});

// PUT /api/usuario/perfil - Atualizar dados do usuário
router.put('/perfil', async (req, res) => {
  try {
    const user = await verificarAuth(req.headers.authorization);
    const { name, profile_picture } = req.body;

    const { data, error } = await supabase
      .from('usuarios')
      .update({ 
        name,
        profile_picture,
        updated_at: new Date().toISOString()
      })
      .eq('auth_id', user.id)
      .select()
      .single();

    if (error) {
      return erro(res, 'Erro ao atualizar perfil', 400);
    }

    return sucesso(res, data, 'Perfil atualizado com sucesso');

  } catch (error) {
    if (error.message.includes('autenticação')) {
      return naoAutorizado(res, error.message);
    }
    return erro(res, 'Erro interno do servidor', 500);
  }
});

// GET /api/usuario/onboarding-status - Verificar status do onboarding
router.get('/onboarding-status', async (req, res) => {
  try {
    const user = await verificarAuth(req.headers.authorization);

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('onboarding_completed')
      .eq('auth_id', user.id)
      .single();

    if (error) {
      return erro(res, 'Usuário não encontrado', 404);
    }

    return sucesso(res, {
      onboarding_completed: usuario.onboarding_completed || false
    });

  } catch (error) {
    if (error.message.includes('autenticação')) {
      return naoAutorizado(res, error.message);
    }
    return erro(res, 'Erro interno do servidor', 500);
  }
});

export default router;