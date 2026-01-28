import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Erro ao buscar token:', error);
    return null;
  }
};

api.interceptors.request.use(
  async (config) => {
    // Primeiro tenta pegar o token do header Authorization já definido
    // (usado quando o token é definido via api.defaults.headers.common['Authorization'])
    if (config.headers.Authorization) {
      return config;
    }

    // Se não há token no header, busca no AsyncStorage
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userData']);
      } catch (storageError) {
        console.error('Erro ao limpar dados de autenticação:', storageError);
      }
      delete api.defaults.headers.common['Authorization'];
      try {
        const { router } = await import('expo-router');
        router.replace('/login');
      } catch (routeError) {
        console.error('Erro ao redirecionar para login:', routeError);
      }
    }

    if (error.response) {
      console.error('Erro da API:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Erro de rede:', error.request);
    } else {
      console.error('Erro:', error.message);
    }

    return Promise.reject(error);
  }
);

// Função para definir o token manualmente (para usar após o login)
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export default api;
