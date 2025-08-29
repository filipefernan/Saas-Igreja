import express from 'express';
import { supabase, verificarAuth } from '../utils/supabase.js';
import { sucesso, erro, criado, naoAutorizado } from '../utils/response.js';

const router = express.Router();

// GET /api/igreja/dados - Obter dados da igreja do usuário
router.get('/dados', async (req, res) => {
  try {
    const user = await verificarAuth(req.headers.authorization);

    // Buscar igreja do usuário
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('church_id')
      .eq('auth_id', user.id)
      .single();

    if (userError || !usuario.church_id) {
      return erro(res, 'Igreja não encontrada', 404);
    }

    const { data: igreja, error } = await supabase
      .from('churches')
      .select('*')
      .eq('id', usuario.church_id)
      .single();

    if (error) {
      return erro(res, 'Erro ao buscar dados da igreja', 500);
    }

    return sucesso(res, igreja, 'Dados da igreja obtidos com sucesso');

  } catch (error) {
    if (error.message.includes('autenticação')) {
      return naoAutorizado(res, error.message);
    }
    return erro(res, 'Erro interno do servidor', 500);
  }
});

// POST /api/igreja/criar - Criar nova igreja
router.post('/criar', async (req, res) => {
  try {
    const user = await verificarAuth(req.headers.authorization);
    const { 
      name, 
      address, 
      pastor_name, 
      pastor_bio, 
      profile_picture,
      website_url,
      instagram_url 
    } = req.body;

    if (!name || !pastor_name) {
      return erro(res, 'Nome da igreja e pastor são obrigatórios', 400);
    }

    // Criar igreja
    const { data: igreja, error: churchError } = await supabase
      .from('churches')
      .insert({
        name,
        address,
        pastor_name,
        pastor_bio,
        profile_picture: profile_picture || '',
        website_url: website_url || '',
        instagram_url: instagram_url || ''
      })
      .select()
      .single();

    if (churchError) {
      return erro(res, 'Erro ao criar igreja', 500);
    }

    // Buscar usuário atual
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (userError) {
      return erro(res, 'Usuário não encontrado', 404);
    }

    // Associar usuário à igreja
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ church_id: igreja.id })
      .eq('id', usuario.id);

    if (updateError) {
      return erro(res, 'Erro ao associar usuário à igreja', 500);
    }

    // Criar configurações do agente
    await supabase
      .from('agent_settings')
      .insert({
        church_id: igreja.id,
        name: 'Assistente Virtual',
        personality: 'Amigável e prestativo'
      });

    return criado(res, igreja, 'Igreja criada com sucesso');

  } catch (error) {
    if (error.message.includes('autenticação')) {
      return naoAutorizado(res, error.message);
    }
    console.error('Erro ao criar igreja:', error);
    return erro(res, 'Erro interno do servidor', 500);
  }
});

// PUT /api/igreja/atualizar - Atualizar dados da igreja
router.put('/atualizar', async (req, res) => {
  try {
    const user = await verificarAuth(req.headers.authorization);
    const updates = req.body;

    // Buscar igreja do usuário
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('church_id')
      .eq('auth_id', user.id)
      .single();

    if (userError || !usuario.church_id) {
      return erro(res, 'Igreja não encontrada', 404);
    }

    // Atualizar igreja
    const { data, error } = await supabase
      .from('churches')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', usuario.church_id)
      .select()
      .single();

    if (error) {
      return erro(res, 'Erro ao atualizar igreja', 500);
    }

    return sucesso(res, data, 'Igreja atualizada com sucesso');

  } catch (error) {
    if (error.message.includes('autenticação')) {
      return naoAutorizado(res, error.message);
    }
    return erro(res, 'Erro interno do servidor', 500);
  }
});

export default router;