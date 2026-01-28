import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/src/contexts/AuthContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const router = useRouter();
  const { login, forgotPassword } = useAuthContext();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 3) {
      newErrors.password = 'A senha deve ter pelo menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log('Iniciando login...');
      const result = await login(email, password);

      if (result.success) {
        // Login bem-sucedido
        console.log('Login realizado com sucesso');
        setErrors({});
        router.replace('/home');
      } else {
        // Erro de login
        console.log('Erro de login:', result.error);
        Alert.alert('Erro de Login', result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert(
        'Email necessário',
        'Por favor, digite seu email no campo acima para recuperar a senha.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Email inválido', 'Por favor, digite um email válido.', [
        { text: 'OK' },
      ]);
      return;
    }

    Alert.alert(
      'Recuperar Senha',
      `Enviar instruções de recuperação para ${email}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Enviar',
          onPress: async () => {
            setIsForgotPasswordLoading(true);

            try {
              const result = await forgotPassword(email);

              if (result.success) {
                Alert.alert(
                  'Email Enviado',
                  'As instruções para redefinir sua senha foram enviadas para seu email. Verifique sua caixa de entrada e spam.',
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'Erro',
                  result.error ||
                    'Não foi possível enviar o email de recuperação. Tente novamente.',
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              console.error('Erro ao recuperar senha:', error);
              Alert.alert(
                'Erro',
                'Ocorreu um erro inesperado. Tente novamente.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsForgotPasswordLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.content}>
          <View style={styles.formContainer}>
            {/* Logo/Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('@/assets/images/logos/icon.png')}
                  style={styles.logo}
                  resizeMode='contain'
                />
              </View>

              <Text style={styles.title}>BRC LOG</Text>
              <Text style={styles.subtitle}>Faça login para continuar</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={[
                    styles.inputContainer,
                    errors.email && styles.inputError,
                  ]}
                >
                  <MaterialIcons
                    name='email'
                    size={20}
                    color={Colors.gray[400]}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder='Digite seu email'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoComplete='email'
                    placeholderTextColor={Colors.gray[400]}
                    editable={!isLoading && !isForgotPasswordLoading}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <View
                  style={[
                    styles.inputContainer,
                    errors.password && styles.inputError,
                  ]}
                >
                  <MaterialIcons
                    name='lock'
                    size={20}
                    color={Colors.gray[400]}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder='Digite sua senha'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize='none'
                    placeholderTextColor={Colors.gray[400]}
                    editable={!isLoading && !isForgotPasswordLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    disabled={isLoading || isForgotPasswordLoading}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color={Colors.gray[400]}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordContainer}
                disabled={isLoading || isForgotPasswordLoading}
              >
                <Text
                  style={[
                    styles.forgotPasswordText,
                    (isLoading || isForgotPasswordLoading) &&
                      styles.disabledText,
                  ]}
                >
                  {isForgotPasswordLoading
                    ? 'Enviando...'
                    : 'Esqueceu a senha?'}
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (isLoading || isForgotPasswordLoading) &&
                    styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading || isForgotPasswordLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#2f75b6', // Verde Brasil
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    // Gradiente sutil para dar profundidade
    shadowColor: '#2f75b6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2f75b6', // Verde escuro
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray[600],
    fontWeight: '500',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    height: 52,
    // Sombra sutil
    shadowColor: Colors.gray[200],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.gray[800],
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 6,
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2f75b6',
  },
  disabledText: {
    color: Colors.gray[400],
  },
  loginButton: {
    backgroundColor: '#2f75b6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    // Sombra para dar profundidade
    shadowColor: '#2f75b6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#2f75b6',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default LoginScreen;
