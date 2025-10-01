import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post('/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/user');
    return response.data;
  },

  async register(name, email, password, passwordConfirmation) {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  },
};
