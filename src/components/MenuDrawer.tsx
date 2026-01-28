import React, { createContext, useContext, ReactNode } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  IconButton,
  StatusBar,
  Drawer,
  Pressable,
  useDisclose,
  ScrollView,
  Divider,
} from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAuthContext } from '../contexts/AuthContext';
import { Alert } from 'react-native';

interface DrawerContextType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

interface DrawerProviderProps {
  children: ReactNode;
}

export default function DrawerProvider({ children }: DrawerProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclose(false);
  const { logout } = useAuthContext();

  const getScreenTitle = () => {
    switch (pathname) {
      case '/':
      case '/home':
        return 'Home';
      case '/pedidos':
        return 'Pedidos';
      case '/agendamentos':
        return 'Agendamentos';
      case '/entradas':
        return 'Entradas';
      case '/saidas':
        return 'Saídas';
      case '/produtos':
        return 'Produtos';
      case '/inventarios':
        return 'Inventários';
      case '/pallets':
        return 'Pallets';
      case '/items_pallets':
        return 'Produtos';
      case '/romaneios':
        return 'Romaneios';
      default:
        if (pathname.includes('auth')) {
          return 'Login';
        }
        return 'BRC Log';
    }
  };

  const menuItems = [
    { label: 'Home', route: '/home', icon: 'home' },
    { label: 'Agendamentos', route: '/agendamentos', icon: 'event' },
    { label: 'Entradas', route: '/entradas', icon: 'input' },
    { label: 'Saídas', route: '/saidas', icon: 'logout' },
    { label: 'Produtos', route: '/produtos', icon: 'inventory' },
    // { label: 'Pallets', route: '/pallets', icon: 'pallet' },
    { label: 'Inventários', route: '/inventarios', icon: 'pallet' },
    { label: 'Pedidos', route: '/pedidos', icon: 'list-alt' },
    { label: 'Romaneios', route: '/romaneios', icon: 'truck', communityIcon: 'material-community-icons' },
  ];

  const handleNavigate = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const handleLogout = () => {
    Alert.alert('Confirmar Logout', 'Tem certeza que deseja sair?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          onClose();
          try {
            console.log('Iniciando logout...');
            await logout();
            console.log('Logout realizado, redirecionando...');
            router.replace('/(auth)/login');
          } catch (error) {
            console.error('Erro ao fazer logout:', error);
            // Mesmo com erro, redireciona para login
            router.replace('/(auth)/login');
          }
        },
      },
    ]);
  };

  const DrawerContent = () => (
    <VStack flex={1} bg='white' safeAreaTop>
      <Box
        px={4}
        py={6}
        bg='#f8fafc'
        borderBottomWidth={1}
        borderBottomColor='gray.200'
        mt={2}
      >
        <HStack alignItems='center' space={3}>
          <Box
            w={12}
            h={12}
            borderRadius='full'
            bg='#f0f7ff'
            alignItems='center'
            justifyContent='center'
            borderWidth={2}
            borderColor='#2f75b6'
          >
            <MaterialIcons name='business' size={20} color='#2f75b6' />
          </Box>
          <VStack>
            <Text fontSize='lg' fontWeight='bold' color='#2f75b6'>
              BRC Log
            </Text>
            <Text fontSize='sm' color='gray.500'>
              Sistema de Logística
            </Text>
          </VStack>
        </HStack>
      </Box>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <VStack space={1} py={4}>
          {menuItems.map(({ label, route, icon, communityIcon }) => {
            const isActive = pathname === route;
            return (
              <Pressable
                key={route}
                onPress={() => handleNavigate(route)}
                _pressed={{ bg: 'gray.100' }}
                bg={isActive ? '#f0f7ff' : 'transparent'}
              >
                <HStack alignItems='center' space={4} px={6} py={4}>
                  { communityIcon ? (
                    <MaterialCommunityIcons name={icon as any} size={22} color='#2f75b6' />
                  ) : (
                    <MaterialIcons name={icon as any} size={22} color='#2f75b6' />
                  )}
                  <Text
                    fontSize='md'
                    color='#2f75b6'
                    fontWeight={isActive ? 'bold' : 'medium'}
                  >
                    {label}
                  </Text>
                  {isActive && (
                    <Box ml='auto'>
                      <MaterialIcons
                        name='chevron-right'
                        size={20}
                        color='#2f75b6'
                      />
                    </Box>
                  )}
                </HStack>
              </Pressable>
            );
          })}
        </VStack>
      </ScrollView>

      <Divider />

      <Box p={4}>
        <Pressable
          onPress={handleLogout}
          _pressed={{ bg: 'red.50' }}
          borderRadius='md'
        >
          <HStack alignItems='center' space={4} px={4} py={4}>
            <MaterialIcons name='logout' size={22} color='red.500' />
            <Text fontSize='md' color='red.500' fontWeight='medium'>
              Sair
            </Text>
          </HStack>
        </Pressable>
      </Box>
    </VStack>
  );

  // Páginas que não devem mostrar o drawer
  const shouldShowDrawer =
    !pathname.includes('auth') && !pathname.includes('login');

  return (
    <DrawerContext.Provider value={{ isOpen, onOpen, onClose }}>
      <Box flex={1} bg='white' safeAreaTop>
        <StatusBar barStyle='dark-content' backgroundColor='white' />

        {/* Header com título dinâmico */}
        {shouldShowDrawer && (
          <HStack
            w='full'
            h='60px'
            alignItems='center'
            justifyContent='space-between'
            px={4}
            borderBottomWidth={1}
            borderBottomColor='gray.200'
            bg='white'
          >
            <HStack alignItems='center' space={3} flex={1}>
              <IconButton
                onPress={() => {
                  onOpen();
                }}
                icon={<MaterialIcons name='menu' size={24} color='#2f75b6' />}
                borderRadius='full'
                _pressed={{ bg: 'gray.100' }}
                variant='ghost'
              />
              <Text
                fontSize='lg'
                fontWeight='bold'
                color='#2f75b6'
                numberOfLines={1}
                flex={1}
              >
                {getScreenTitle()}
              </Text>
            </HStack>
          </HStack>
        )}

        {/* Conteúdo das páginas */}
        <Box flex={1}>{children}</Box>
      </Box>

      {/* Drawer - sempre renderiza se shouldShowDrawer for true */}
      {shouldShowDrawer && (
        <Drawer isOpen={isOpen} onClose={onClose} placement='left'>
          <DrawerContent />
        </Drawer>
      )}
    </DrawerContext.Provider>
  );
}
