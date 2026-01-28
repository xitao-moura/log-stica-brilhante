import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Pressable,
  Icon,
  Spinner,
  Center,
  Modal,
  Button,
} from 'native-base';
import { FlatList, RefreshControl } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../src/config/api.config';

interface Inventario {
  _id?: string;
  nome: string;
  status?: {
    nome?: string;
  };
  createdAt?: string;
}

const InventariosScreen: React.FC = () => {
  const router = useRouter();

  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const fetchInventarios = async () => {
    try {
      setError(null);
      const response = await api.get('/inventarios');
      const data = response.data;
      const lista: Inventario[] = Array.isArray(data)
        ? data
        : data?.inventarios || [];

      setInventarios(lista);
    } catch (err: any) {
      let msg = 'Erro ao carregar inventários';
      if (err.response) {
        msg = `Erro ${err.response.status}: ${
          err.response.data?.message || err.response.statusText
        }`;
      } else if (err.request) {
        msg = 'Erro de conexão. Verifique sua internet.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
      setShowError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchInventarios();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchInventarios();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInventarios();
  };

  const goToAdd = () => router.push('/inventarios/add');

  const goToEdit = (id?: string) => {
    if (id) {
      router.push({ pathname: '/inventarios/[id]', params: { id } });
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR');
    } catch {
      return iso;
    }
  };

  const renderInventarioCard = ({ item }: { item: Inventario }) => (
    <Pressable onPress={() => goToEdit(item._id)}>
      <Box
        bg="white"
        rounded="xl"
        p={4}
        mx={3}
        my={2}
        shadow={1}
      >
        <HStack justifyContent="space-between" alignItems="flex-start">
          <VStack space={2} flex={1}>
            <Text fontSize="md" fontWeight="bold" color="gray.800">
              {item.nome}
            </Text>

            <HStack space={2} alignItems="center">
              <Box
                px={2}
                py={0.5}
                rounded="full"
                bg="blue.100"
              >
                <Text fontSize="xs" color="blue.700">
                  {item.status?.nome || 'Sem status'}
                </Text>
              </Box>

              <Text fontSize="xs" color="gray.400">
                {formatDate(item.createdAt)}
              </Text>
            </HStack>
          </VStack>

          <Icon
            as={Ionicons}
            name="chevron-forward"
            size="sm"
            color="gray.400"
          />
        </HStack>
      </Box>
    </Pressable>
  );

  if (loading) {
    return (
      <Box flex={1} bg="gray.50">
        <Center flex={1}>
          <Spinner size="lg" color="blue.500" />
          <Text mt={4} color="gray.500">
            Carregando inventários...
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50">
      {/* HEADER */}
      <Box px={4} pt={6} pb={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Inventários
          </Text>

          <Pressable onPress={goToAdd}>
            <Icon
              as={Ionicons}
              name="add-circle"
              size="xl"
              color="blue.500"
            />
          </Pressable>
        </HStack>

        <Text fontSize="sm" color="gray.500" mt={1}>
          Gerencie seus inventários cadastrados
        </Text>
      </Box>

      {/* LISTA */}
      <FlatList
        data={inventarios}
        renderItem={renderInventarioCard}
        keyExtractor={(item) => item._id || item.nome}
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
          <Center py={20}>
            <Icon
              as={MaterialIcons}
              name="inventory-2"
              size="2xl"
              color="gray.300"
              mb={4}
            />
            <Text fontSize="md" fontWeight="semibold" color="gray.600">
              Nenhum inventário ainda
            </Text>
            <Text fontSize="sm" color="gray.400" mt={1}>
              Toque no + para adicionar
            </Text>
          </Center>
        }
      />

      {/* MODAL DE ERRO */}
      <Modal isOpen={showError} onClose={() => setShowError(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>
            <HStack alignItems="center" space={2}>
              <Icon
                as={Ionicons}
                name="alert-circle"
                size="md"
                color="red.500"
              />
              <Text fontWeight="bold">Erro</Text>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <Text>{error}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => setShowError(false)}
              >
                Fechar
              </Button>
              <Button onPress={fetchInventarios}>
                Tentar novamente
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default InventariosScreen;
