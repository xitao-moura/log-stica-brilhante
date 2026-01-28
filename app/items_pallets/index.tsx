import React, { useEffect, useMemo, useState } from 'react';
import { Box, VStack, HStack, Text, Button, Pressable, Icon, useToast } from 'native-base';
import { FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../src/config/api.config';

interface Item {
  codigo_barra: string;
  quantidade: number;
  itens?: [
    {
      produto?: {
        descricao?: string;
      };
    }
  ];
}

interface Pallet {
  _id: string;
  codigo_barra?: string;
  itens?: Item[];
}

const ProdutosScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();

  const params = useLocalSearchParams<{
    pallet?: string;
    id?: string;
    pallet_id?: string;
  }>();

  const palletParam =
    typeof params?.pallet === 'string' ? params.pallet : undefined;

  const routeId = typeof params?.id === 'string' ? params.id : undefined;
  const routePalletId =
    typeof params?.pallet_id === 'string' ? params.pallet_id : undefined;

  const pallet: Pallet | null = useMemo(() => {
    try {
      return palletParam ? JSON.parse(palletParam) : null;
    } catch {
      return null;
    }
  }, [palletParam]);

  const palletId = pallet?._id || routeId || routePalletId;

  const [items, setItems] = useState<Item[]>([]);
  const [palletData, setPalletData] = useState<Pallet | null>(pallet || null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPallet = async () => {
    try {
      if (!palletId) throw new Error('Pallet inválido');

      const response = await api.get(`/pallets/${palletId}`);
      const data = response?.data || {};
      const obj = Array.isArray(data) ? data[0] : data?.data || data;

      setPalletData(obj || null);
      setItems(Array.isArray(obj?.itens) ? obj.itens : []);
    } catch (err: any) {
      toast.show({
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Erro ao carregar produtos',
        placement: 'top',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPallet();
  }, [palletId]);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchPallet();
    }, [palletId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPallet();
  };

  const goToAdd = () => {
    if (!palletData?._id) return;
    router.push({
      pathname: '/items_pallets/add',
      params: { pallet: JSON.stringify(palletData) },
    });
  };

  const deleteItem = async (index: number) => {
    try {
      if (!palletData?._id) return;
      const item = items[index];
      if (!item?.codigo_barra) return;

      setSubmitting(true);
      await api.delete(
        `/pallets/${palletData._id}/itens/${item.codigo_barra}`
      );
      await fetchPallet();
    } finally {
      setSubmitting(false);
    }
  };

  const addQuantidade = async (index: number) => {
    if (!palletData?._id) return;
    const item = items[index];
    if (!item?.codigo_barra) return;

    setSubmitting(true);
    await api.put(
      `/pallets/${palletData._id}/itens/${item.codigo_barra}/quantidade-adicionar`
    );
    await fetchPallet();
    setSubmitting(false);
  };

  const removeQuantidade = async (index: number) => {
    if (!palletData?._id) return;
    const item = items[index];
    if (!item?.codigo_barra) return;

    setSubmitting(true);
    await api.put(
      `/pallets/${palletData._id}/itens/${item.codigo_barra}/quantidade-remover`
    );
    await fetchPallet();
    setSubmitting(false);
  };

  const renderItemCard = ({ item, index }: { item: Item; index: number }) => (
    <Box bg="white" rounded="xl" p={4} mx={3} my={2} shadow={1}>
      <HStack justifyContent="space-between" alignItems="flex-start" mb={2}>
        <VStack flex={1} space={1}>
          <HStack alignItems="center" space={2}>
            <Icon
              as={Ionicons}
              name="barcode-outline"
              size="sm"
              color="blue.500"
            />
            <Text fontSize="md" fontWeight="bold" color="gray.800">
              {item.codigo_barra}
            </Text>
          </HStack>

          {item?.itens?.[0]?.produto?.descricao && (
            <Text fontSize="sm" color="gray.500" numberOfLines={2}>
              {item.itens[0].produto.descricao}
            </Text>
          )}
        </VStack>

        <HStack space={3}>
          <Pressable onPress={() => removeQuantidade(index)}>
            <Icon
              as={Ionicons}
              name="remove-circle-outline"
              size="sm"
              color="orange.500"
            />
          </Pressable>
          <Pressable onPress={() => addQuantidade(index)}>
            <Icon
              as={Ionicons}
              name="add-circle-outline"
              size="sm"
              color="green.500"
            />
          </Pressable>
          <Pressable onPress={() => deleteItem(index)}>
            <Icon
              as={Ionicons}
              name="trash-outline"
              size="sm"
              color="red.500"
            />
          </Pressable>
        </HStack>
      </HStack>

      <HStack justifyContent="space-between">
        <Text fontSize="sm" color="gray.600">
          Quantidade
        </Text>
        <Text fontSize="md" fontWeight="bold">
          {item.quantidade}
        </Text>
      </HStack>
    </Box>
  );

  return (
    <Box flex={1} bg="gray.50">
      <Box px={4} pt={6} pb={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.800">Produtos</Text>
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
          Gerencie os produtos deste pallet
        </Text>
      </Box>

      <FlatList
        data={items}
        renderItem={renderItemCard}
        keyExtractor={(_, index) => String(index)}
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
              as={Ionicons}
              name="cube-outline"
              size="xl"
              color="gray.400"
              mb={4}
            />
            <Text fontSize="lg" color="gray.500">
              Nenhum produto encontrado
            </Text>
            <Text fontSize="sm" color="gray.400" mt={2}>
              Toque em Adicionar para cadastrar
            </Text>
          </Box>
        }
      />
    </Box>
  );
};

export default ProdutosScreen;
