import React, { useEffect, useState } from 'react';
import {
  Box,
  HStack,
  Text,
  Button,
  Pressable,
  Icon,
  Spinner,
  Center,
  Modal,
} from 'native-base';
import { FlatList, RefreshControl } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../src/config/api.config';

interface Pallet {
  _id?: string;
  codigo_barra: string;
  nome?: string;
}

const PalletsScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ inventarioId?: string }>();
  const inventarioId =
    typeof params?.inventarioId === 'string'
      ? params.inventarioId
      : undefined;

  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const fetchPallets = async () => {
    try {
      setError(null);
      const url = inventarioId
        ? `/pallets?inventario=${inventarioId}`
        : '/pallets';

      const response = await api.get(url);
      const data = response?.data || [];
      const lista: Pallet[] = Array.isArray(data)
        ? data
        : data?.data || [];

      setPallets(lista);
    } catch (err: any) {
      let errorMessage = 'Erro ao carregar pallets';
      if (err.response) {
        errorMessage = `Erro ${err.response.status}: ${
          err.response.data?.message || err.response.statusText
        }`;
      } else if (err.request) {
        errorMessage =
          'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setShowError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPallets();
  }, [inventarioId]);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchPallets();
    }, [inventarioId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPallets();
  };

  const goToAdd = () => {
    router.push({
      pathname: '/pallets/add',
      params: { inventarioId },
    });
  };

  const goToEdit = (id?: string) => {
    if (id) {
      router.push({ pathname: '/pallets/[id]', params: { id } });
    }
  };

  const renderPalletCard = ({ item }: { item: Pallet }) => (
    <Pressable
      onPress={() => goToEdit(item._id)}
      _pressed={{ opacity: 0.7 }}
      style={{ flex: 1 }}
    >
      <Box bg="white" rounded="xl" p={4} mx={3} my={2} shadow={1}>
        <HStack justifyContent="space-between" alignItems="flex-start" mb={2}>
          <HStack alignItems="center" space={2} flex={1}>
            <Icon
              as={MaterialIcons}
              name="pallet"
              size="sm"
              color="blue.500"
            />
            <Text
              fontSize="md"
              fontWeight="bold"
              color="gray.800"
              numberOfLines={1}
            >
              {item.codigo_barra}
            </Text>
          </HStack>

          <Icon
            as={Ionicons}
            name="chevron-forward"
            size="sm"
            color="gray.400"
          />
        </HStack>

        {item.nome && (
          <Text fontSize="sm" color="gray.500" numberOfLines={2}>
            {item.nome}
          </Text>
        )}
      </Box>
    </Pressable>
  );

  if (loading) {
    return (
      <Box flex={1} bg="gray.50">
        <Center flex={1}>
          <Spinner size="lg" color="blue.500" />
          <Text mt={4} color="gray.500">
            Carregando posições...
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50">
      <Box px={4} pt={6} pb={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.800">Posições</Text>
          <HStack space={2} alignItems="center">
            <Pressable onPress={goToAdd}>
              <Icon as={Ionicons} name="add-circle" size="xl" color="blue.500" />
            </Pressable>
            <Button
              variant="outline"
              colorScheme="gray"
              size="sm"
              onPress={() => router.back()}
              leftIcon={<Icon as={Ionicons} name="arrow-back" size="sm" />}
            >
              Voltar
            </Button>
          </HStack>
        </HStack>
        <Text fontSize="sm" color="gray.500" mt={1}>
          Visualize as posições do inventário
        </Text>
      </Box>

      <FlatList
        data={pallets}
        renderItem={renderPalletCard}
        keyExtractor={(item, index) =>
          item._id || item.codigo_barra || String(index)
        }
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={
          <Box flex={1} alignItems="center" py={10}>
            <Icon
              as={MaterialIcons}
              name="pallet"
              size="xl"
              color="gray.400"
              mb={4}
            />
            <Text fontSize="lg" color="gray.500">
              Nenhum pallet encontrado
            </Text>
            <Text fontSize="sm" color="gray.400" mt={2}>
              Toque em Adicionar para cadastrar
            </Text>
          </Box>
        }
      />

      <Modal isOpen={showError} onClose={() => setShowError(false)} size="lg">
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            <HStack alignItems="center" space={2}>
              <Icon
                as={Ionicons}
                name="alert-circle"
                size="md"
                color="red.500"
              />
              <Text fontSize="lg" fontWeight="bold">
                Erro ao carregar posições
              </Text>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <Text>{error}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => setShowError(false)}
              >
                Fechar
              </Button>
              <Button colorScheme="blue" onPress={fetchPallets}>
                Tentar novamente
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default PalletsScreen;
