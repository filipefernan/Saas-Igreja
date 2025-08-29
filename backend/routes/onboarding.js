import express from 'express';
import { supabase, verificarAuth } from '../utils/supabase.js';
import { sucesso, erro, naoAutorizado } from '../utils/response.js';

const router = express.Router();

// POST /api/onboarding/completar - Marcar onboarding como completo
router.post('/completar', async (req, res) => {
  try {
    console.log('🚀 Iniciando completar onboarding...');
    const user = await verificarAuth(req.headers.authorization);
    console.log('👤 Usuário autenticado:', user.email);
    
    const { 
      dadosIgreja,
      configuracaoAgente,
      programacao 
    } = req.body;
    
    console.log('📋 Dados recebidos:', { dadosIgreja, configuracaoAgente, programacao });

    // Buscar usuário
    console.log('🔍 Buscando usuário com auth_id:', user.id);
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('id, church_id')
      .eq('auth_id', user.id)
      .single();

    if (userError) {
      console.error('❌ Erro ao buscar usuário:', userError);
      return erro(res, 'Usuário não encontrado', 404);
    }
    
    console.log('👤 Usuário encontrado:', usuario);

    let churchId = usuario.church_id;

    // Se não tem igreja, criar uma
    if (!churchId && dadosIgreja) {
      const { data: igreja, error: churchError } = await supabase
        .from('churches')
        .insert({
          name: dadosIgreja.name,
          address: dadosIgreja.address,
          pastor_name: dadosIgreja.pastorName,
          pastor_bio: dadosIgreja.pastorBio,
          profile_picture: dadosIgreja.profilePicture || '',
          website_url: dadosIgreja.websiteUrl || '',
          instagram_url: dadosIgreja.instagramUrl || ''
        })
        .select()
        .single();

      if (churchError) {
        return erro(res, 'Erro ao criar igreja', 500);
      }

      churchId = igreja.id;

      // Associar usuário à igreja
      await supabase
        .from('usuarios')
        .update({ church_id: churchId })
        .eq('id', usuario.id);
    }

    // Salvar/atualizar configuração do agente
    if (configuracaoAgente && churchId) {
      const { error: agentError } = await supabase
        .from('agent_settings')
        .upsert({
          church_id: churchId,
          name: configuracaoAgente.name,
          personality: configuracaoAgente.personality
        });

      if (agentError) {
        console.error('Erro ao salvar configuração do agente:', agentError);
      }
    }

    // Salvar programação se fornecida
    if (programacao && programacao.length > 0 && churchId) {
      const schedulesToInsert = programacao
        .filter(item => item.day && item.time && item.description)
        .map(item => ({
          church_id: churchId,
          day: item.day,
          time: item.time,
          description: item.description
        }));

      if (schedulesToInsert.length > 0) {
        await supabase
          .from('schedules')
          .insert(schedulesToInsert);
      }
    }

    // Marcar onboarding como completo
    console.log('✅ Marcando onboarding como completo para usuário:', user.id);
    const { data: updatedUser, error: updateError } = await supabase
      .from('usuarios')
      .update({ 
        onboarding_completed: true,
        church_id: churchId
      })
      .eq('auth_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erro ao marcar onboarding como completo:', updateError);
      return erro(res, 'Erro ao completar onboarding', 500);
    }
    
    console.log('🎉 Usuário atualizado com onboarding completo:', updatedUser);

    return sucesso(res, {
      usuario: updatedUser,
      churchId
    }, 'Onboarding completado com sucesso');

  } catch (error) {
    if (error.message.includes('autenticação')) {
      return naoAutorizado(res, error.message);
    }
    console.error('Erro no onboarding:', error);
    return erro(res, 'Erro interno do servidor', 500);
  }
});

// GET /api/onboarding/status - Verificar status do onboarding
router.get('/status', async (req, res) => {
  try {
    const user = await verificarAuth(req.headers.authorization);

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('onboarding_completed, church_id')
      .eq('auth_id', user.id)
      .single();

    if (error) {
      return erro(res, 'Usuário não encontrado', 404);
    }

    return sucesso(res, {
      completed: usuario.onboarding_completed || false,
      hasChurch: !!usuario.church_id
    });

  } catch (error) {
    if (error.message.includes('autenticação')) {
      return naoAutorizado(res, error.message);
    }
    return erro(res, 'Erro interno do servidor', 500);
  }
});

export default router;