import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    console.log(
      'Index - isLoading:',
      isLoading,
      'isAuthenticated:',
      isAuthenticated
    );

    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          console.log('Redirecionando para home...');
          router.replace('/home');
        } else {
          console.log('Redirecionando para login...');
          router.replace('/(auth)/login');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router]);

  // Sempre renderiza o loading, sem condicionais
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <ActivityIndicator size='large' color='#2f75b6' />
      <Text style={{ marginTop: 16, color: '#666' }}>Carregando...</Text>
    </View>
  );
}
