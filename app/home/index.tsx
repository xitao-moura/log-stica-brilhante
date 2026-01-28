import React from 'react';
import { Box, VStack, Text, Center, Image } from 'native-base';

export default function Home() {
  return (
    <Center flex={1} px={4}>
      <VStack space={6} alignItems='center'>
        <Box
          w={120}
          h={120}
          borderRadius='full'
          bg='#f0f7ff'
          alignItems='center'
          justifyContent='center'
          borderWidth={3}
          borderColor='#2f75b6'
          overflow='hidden'
        >
          <Image
            source={require('../../assets/images/logos/icon.png')}
            alt='BRC Log Logo'
            w={90}
            h={90}
            resizeMode='contain'
          />
        </Box>
        <VStack space={3} alignItems='center' px={8}>
          <Text
            fontSize='3xl'
            fontWeight='bold'
            color='#2f75b6'
            textAlign='center'
          >
            Bem-vindo ao BRC Log
          </Text>
          <Text fontSize='lg' color='gray.600' textAlign='center'>
            Gerencie sua logística com eficiência e controle total das suas
            operações
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
}
