import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse, AxiosError } from 'axios';
import api, { setAuthToken, clearAuthToken } from '../config/api.config';

interface User {
  _id: string;
  email: string;
  empresas: any[];
  clientes: any[];
  fornecedores: any[];
  roles?: any[];
  tipo?: any;
}

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface AuthResponse {
  token: TokenData;
  usuario: User;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedRefreshToken, storedUserData] =
        await Promise.all([
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('refreshToken'),
          AsyncStorage.getItem('userData'),
        ]);

      if (storedToken && storedUserData) {
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUserData));
        setIsAuthenticated(true);

        // Configurar token no api.config.ts
        setAuthToken(storedToken);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Iniciando login...');
      console.log('Tentando fazer login com:', { username: email });

      const response: AxiosResponse<AuthResponse> = await api.post(
        '/usuarios/auth',
        {
          username: email,
          password: password,
        }
      );

      console.log('Dados recebidos:', response.data);
      console.log('Login realizado com sucesso');

      if (response.data.token && response.data.usuario) {
        // Salvar dados no AsyncStorage
        await Promise.all([
          AsyncStorage.setItem('userToken', response.data.token.access_token),
          AsyncStorage.setItem(
            'refreshToken',
            response.data.token.refresh_token
          ),
          AsyncStorage.setItem(
            'userData',
            JSON.stringify(response.data.usuario)
          ),
        ]);

        // Configurar token no api.config.ts
        setAuthToken(response.data.token.access_token);

        // Atualizar estado
        setToken(response.data.token.access_token);
        setRefreshToken(response.data.token.refresh_token);
        setUser(response.data.usuario);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return { success: false, error: 'Dados de resposta inválidos' };
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        let errorMessage = 'Credenciais inválidas';

        // Verificar se há mensagem de erro específica
        if (axiosError.response?.data) {
          const data = axiosError.response.data as any;
          if (data.error) {
            errorMessage = data.error;
          } else if (data.error_description) {
            errorMessage = data.error_description;
          } else if (data.message) {
            errorMessage = data.message;
          }
        }

        // deixa mensagens melhores para exibicao
        switch (axiosError.response?.status) {
          case 401:
            errorMessage = 'Email ou senha incorretos';
            break;
          case 404:
            errorMessage = 'Usuário não encontrado';
            break;
          case 400:
            errorMessage = 'Dados de login inválidos';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
        }

        return { success: false, error: errorMessage };
      }

      if (error instanceof Error && error.message.includes('Network Error')) {
        return {
          success: false,
          error: 'Erro de conexão. Verifique sua internet e tente novamente.',
        };
      }

      return {
        success: false,
        error: 'Não foi possível conectar ao servidor. Tente novamente.',
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        try {
          await api.post('/usuarios/logout', {
            token: token,
          });
        } catch (error) {
          console.error('Erro ao fazer logout no servidor:', error);
        }
      }

      await Promise.all([
        AsyncStorage.removeItem('userToken'),
        AsyncStorage.removeItem('refreshToken'),
        AsyncStorage.removeItem('userData'),
      ]);

      // Limpar token do api.config.ts
      clearAuthToken();

      // Limpar estado
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);

      // Em caso de erro, ainda assim limpar o estado local
      clearAuthToken();
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshTokenRequest = async (): Promise<boolean> => {
    try {
      if (!refreshToken) {
        console.log('Não há refresh token disponível');
        return false;
      }

      console.log('Tentando renovar token...');

      const response = await api.post('/usuarios/refresh/token', {
        refresh_token: refreshToken,
      });

      if (response.data && response.data.access_token) {
        await Promise.all([
          AsyncStorage.setItem('userToken', response.data.access_token),
          response.data.refresh_token &&
            AsyncStorage.setItem('refreshToken', response.data.refresh_token),
        ]);

        // Configurar novo token no api.config.ts
        setAuthToken(response.data.access_token);

        // Atualizar estado
        setToken(response.data.access_token);
        if (response.data.refresh_token) {
          setRefreshToken(response.data.refresh_token);
        }

        console.log('Token renovado com sucesso');
        return true;
      }

      console.log('Falha ao renovar token');
      return false;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return false;
    }
  };

  // Agora você pode usar diretamente a instância do api configurada
  const makeAuthenticatedRequest = async (
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      data?: any;
      params?: any;
      headers?: any;
    } = {}
  ): Promise<AxiosResponse> => {
    if (!isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    const { method = 'GET', data, params, headers } = options;

    try {
      const response = await api.request({
        url: endpoint,
        method: method.toLowerCase(),
        data,
        params,
        headers: {
          ...headers,
        },
      });

      return response;
    } catch (error) {
      // O interceptor já cuida da renovação do token
      throw error;
    }
  };

  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.post('/usuarios/esqueci-a-senha', {
        email: email,
      });

      return { success: true };
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        let errorMessage = 'Erro ao enviar email de recuperação';

        if (axiosError.response?.data) {
          const data = axiosError.response.data as any;
          if (data.message) {
            errorMessage = data.message;
          }
        }

        if (axiosError.response?.status === 400) {
          errorMessage = 'Email não encontrado';
        }

        return { success: false, error: errorMessage };
      }

      return {
        success: false,
        error: 'Erro de conexão. Tente novamente.',
      };
    }
  };

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const [storedToken, storedUserData] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userData'),
      ]);

      if (storedToken && storedUserData) {
        setToken(storedToken);
        setUser(JSON.parse(storedUserData));
        setIsAuthenticated(true);
        setAuthToken(storedToken);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    makeAuthenticatedRequest,
    forgotPassword,
    checkAuthStatus,
  };
};
