// Serviço principal para comunicação com o backend

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Configurar headers padrão
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Método genérico para fazer requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Métodos HTTP
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Atualizar token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }
}

// Instância global da API
export const api = new ApiService();

// ========================================
// SERVIÇOS ESPECÍFICOS
// ========================================

// Autenticação
export const authService = {
  async login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    if (response.sucesso && response.dados.token) {
      api.setToken(response.dados.token);
    }
    return response;
  },

  async cadastro(email, senha, nome) {
    return await api.post('/auth/cadastro', { email, senha, nome });
  },

  async logout() {
    const response = await api.post('/auth/logout');
    api.setToken(null);
    return response;
  }
};

// Usuário
export const usuarioService = {
  async obterPerfil() {
    return await api.get('/usuario/perfil');
  },

  async atualizarPerfil(dados) {
    return await api.put('/usuario/perfil', dados);
  },

  async verificarOnboarding() {
    return await api.get('/usuario/onboarding-status');
  }
};

// Igreja
export const igrejaService = {
  async obterDados() {
    return await api.get('/igreja/dados');
  },

  async criar(dadosIgreja) {
    return await api.post('/igreja/criar', dadosIgreja);
  },

  async atualizar(dadosIgreja) {
    return await api.put('/igreja/atualizar', dadosIgreja);
  }
};

// Onboarding
export const onboardingService = {
  async completar(dadosOnboarding) {
    return await api.post('/onboarding/completar', dadosOnboarding);
  },

  async verificarStatus() {
    return await api.get('/onboarding/status');
  }
};

export default api;