import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack, Link, useRouter } from 'expo-router';
import {
  Center,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  useTheme,
} from 'native-base';

export default function NotFoundScreen() {
  const { colors } = useTheme();
  const primary = '#2f75b6';

  const router = useRouter();

  const goHome = () => {
    router.push('/home');
  };

  return (
    <>
      <Stack.Screen options={{ title: '404 - Ops!' }} />
      <Center flex={1} bg='white' px={4}>
        <VStack space={6} alignItems='center'>
          <Image
            source={require('../assets/images/ilustrations/404.jpg')}
            alt='Pacote perdido'
            size='2xl'
            resizeMode='contain'
          />

          <Heading color={primary} fontSize='2xl' textAlign='center'>
            Ops, extraviado entre pallets!
          </Heading>

          <Text fontSize='md' color='gray.600' textAlign='center' px={4}>
            Parece que você se perdeu entre pallets e corredores do nosso
            galpão. Vamos voltar para a base e reencontrar a rota correta?
          </Text>

          <Button
            bg={primary}
            _pressed={{ bg: primary + 'cc' }}
            borderRadius={12}
            px={8}
            py={3}
            shadow={2}
            alignSelf='center'
            onPress={goHome}
          >
            <Text color='white' fontWeight='bold'>
              Retornar à Home
            </Text>
          </Button>
        </VStack>
      </Center>
    </>
  );
}
