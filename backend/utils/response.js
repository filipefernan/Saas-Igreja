// Utilitários para padronizar respostas da API

export const sucesso = (res, dados, mensagem = 'Operação realizada com sucesso') => {
  return res.status(200).json({
    sucesso: true,
    mensagem,
    dados,
    timestamp: new Date().toISOString()
  });
};

export const erro = (res, mensagem, status = 400, detalhes = null) => {
  return res.status(status).json({
    sucesso: false,
    erro: mensagem,
    detalhes,
    timestamp: new Date().toISOString()
  });
};

export const criado = (res, dados, mensagem = 'Recurso criado com sucesso') => {
  return res.status(201).json({
    sucesso: true,
    mensagem,
    dados,
    timestamp: new Date().toISOString()
  });
};

export const naoEncontrado = (res, mensagem = 'Recurso não encontrado') => {
  return res.status(404).json({
    sucesso: false,
    erro: mensagem,
    timestamp: new Date().toISOString()
  });
};

export const naoAutorizado = (res, mensagem = 'Não autorizado') => {
  return res.status(401).json({
    sucesso: false,
    erro: mensagem,
    timestamp: new Date().toISOString()
  });
};