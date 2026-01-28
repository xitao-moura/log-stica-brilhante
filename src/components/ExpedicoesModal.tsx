import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal,
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Icon,
  Checkbox,
  Spinner,
  useToast,
  Pressable
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api.config';
import { FlatList } from 'react-native';
import { format } from "date-fns";
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface Expedicao {
  _id: string;
  numero: number;
  status?: {
    nome: string;
    color: string;
  };
}

interface ExpedicoesModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  onSave: (selectedIds: string[]) => void;
  initialSelectedIds?: string[];
}

const ExpedicoesModal: React.FC<ExpedicoesModalProps> = ({
  isOpen,
  onClose,
  clienteId,
  onSave,
  initialSelectedIds = [],
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [expedicoes, setExpedicoes] = useState<Expedicao[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [numeroFilter, setNumeroFilter] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(initialSelectedIds);
      if (clienteId) {
        fetchExpedicoes();
      } else {
        setExpedicoes([]);
      }
    }
  }, [isOpen, clienteId]);

  useFocusEffect(
      useCallback(() => {
        fetchExpedicoes();
      }, [])
  );

  const fetchExpedicoes = async () => {
    if (!clienteId) return;

    try {
      setLoading(true);

      let dataAtual = new Date();

      let url = `/expedicoes?cliente=${clienteId}&data=2025-12-30,2025-12-30`;
      // let url = `/expedicoes?cliente=${clienteId}&data=${dataAtual},${dataAtual}`;
      if (numeroFilter) {
        url += `&numero=${numeroFilter}`;
      }

      const response = await api.get(url);
      const data = response.data;
      
      setExpedicoes(data.grupos || []);
    } catch (error: any) {
      console.error('Erro ao buscar expedições:', error);
      toast.show({
        description: 'Erro ao buscar expedições',
        placement: 'top',
        colorScheme: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSave = () => {
    onSave(selectedIds);
    onClose();
  };

  const renderItem = ({ item }: { item: Expedicao }) => {
    const isSelected = selectedIds.includes(item._id);
    return (
      <Pressable onPress={() => toggleSelection(item._id)} flex={1} m={1}>
        <Box
          bg={isSelected ? 'blue.50' : 'white'}
          borderColor={isSelected ? 'blue.500' : 'gray.200'}
          borderWidth={1}
          rounded="md"
          p={3}
          alignItems="center"
          justifyContent="space-between"
          shadow={1}
        >
          <HStack flex={1} alignItems="center" style={ styles.stackGrid }>
            <VStack style={ styles.VsStackItemGrid }>
              <Checkbox
                value={item._id}
                isChecked={isSelected}
                onChange={() => toggleSelection(item._id)}
                accessibilityLabel={`Selecionar expedição ${item.numero}`}
                aria-label={`Selecionar expedição ${item.numero}`}
                colorScheme="blue"
              />
              <Text fontWeight="bold" fontSize="md" color="gray.700">
                #{item.numero}
              </Text>
              {item.status && (
                <Box
                  bg={item.status.color || 'gray.200'}
                  px={2}
                  py={0.5}
                  rounded="full"
                  mt={1}
                  alignSelf="flex-start"
                >
                  <Text fontSize="xs" fontWeight="bold" color="white">
                    {item.status.nome}
                  </Text>
                </Box>
              )}
            </VStack>
          </HStack>
        </Box>
      </Pressable>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" >
      <Modal.Content maxHeight="100%" height="80%" width="100%">
        <Modal.CloseButton />
        <Modal.Header>Vincular Expedições</Modal.Header>

        {/* "Body" manual, sem Modal.Body */}
        <Box px={4} py={2} flex={1}>
          <VStack space={4} flex={1}>
            {/* Filtro */}
            <HStack space={2} alignItems="center">
              <Input
                placeholder="Filtrar por número"
                flex={1}
                value={numeroFilter}
                onChangeText={setNumeroFilter}
                keyboardType="numeric"
                InputRightElement={
                  <Icon
                    as={Ionicons}
                    name="search"
                    size={5}
                    mr={2}
                    color="gray.400"
                    onPress={fetchExpedicoes}
                    accessibilityLabel="Buscar expedições"
                    aria-label="Buscar expedições"
                  />
                }
                onSubmitEditing={fetchExpedicoes}
              />
              <Button onPress={fetchExpedicoes} variant="solid" colorScheme="blue">
                Buscar
              </Button>
            </HStack>

            {/* Conteúdo principal */}
            {!clienteId ? (
              <Box p={4} bg="yellow.100" rounded="md" flex={1} justifyContent="center">
                <Text color="yellow.800">
                  Selecione um cliente no formulário anterior para buscar as expedições.
                </Text>
              </Box>
            ) : loading ? (
              <Box flex={1} alignItems="center" justifyContent="center">
                <Spinner color="blue.500" size="lg" />
              </Box>
            ) : expedicoes.length === 0 ? (
              <Box flex={1} alignItems="center" justifyContent="center">
                <Text color="gray.500">Nenhuma expedição encontrada.</Text>
              </Box>
            ) : (
              <Box flex={1}>
                <FlatList<Expedicao>
                  data={expedicoes}
                  renderItem={renderItem}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  nestedScrollEnabled
                />
              </Box>
            )}

            <Text fontSize="sm" color="gray.500">
              {selectedIds.length} expedições selecionadas
            </Text>
          </VStack>
        </Box>

        {/* Footer fixo */}
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
              Cancelar
            </Button>
            <Button onPress={handleSave} colorScheme="blue">
              Confirmar
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ExpedicoesModal;

const styles = StyleSheet.create({
  stackGrid: {
    width: "100%"
  },
  VsStackItemGrid: {
    flexDirection: 'row', 
    justifyContent: "space-between", 
    alignItems: "center", 
    width: '100%'
  }
})