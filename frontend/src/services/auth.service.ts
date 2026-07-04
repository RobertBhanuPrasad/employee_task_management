import api from './api';

export const authService = {
  login: async (payload: any) => {
    const response = await api.post('/v1/auth/login', payload);
    return response.data.data;
  },
  register: async (payload: any) => {
    const response = await api.post('/v1/auth/register', payload);
    return response.data.data;
  },
  logout: async () => {
    const response = await api.post('/v1/auth/logout');
    return response.data;
  }
};
