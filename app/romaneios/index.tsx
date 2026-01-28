import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  FormControl,
  Collapse,
  Badge,
} from 'native-base';
import { FlatList, RefreshControl, TextInput, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../src/config/api.config';

// Interfaces para o CustomSelect
interface CustomSelectProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  label: string;
  children?: React.ReactNode;
}

// Componente CustomSelect personalizado
const CustomSelect: React.FC<CustomSelectProps> = ({
  selectedValue,
  onValueChange,
  placeholder,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (selectedValue && children) {
      const selectedItem = React.Children.toArray(children).find(
        (child: any) => child.props.value === selectedValue
      );
      if (selectedItem) {
        setDisplayValue((selectedItem as any).props.label);
      }
    } else {
      setDisplayValue('');
    }
  }, [selectedValue, children]);

  const handleSelect = (value: string, label: string) => {
    onValueChange(value);
    setDisplayValue(label);
    setIsOpen(false);
  };

  return (
    <Box>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={styles.selectButton}
        _pressed={{ opacity: 0.7 }}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <Text color={displayValue ? 'gray.700' : 'gray.400'} fontSize="sm">
            {displayValue || placeholder}
          </Text>
          <Icon as={Ionicons} name="chevron-down" size="sm" color="gray.400" />
        </HStack>
      </Pressable>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            <Text fontSize="lg" fontWeight="bold">
              Selecionar
            </Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={2}>
              <Pressable
                onPress={() => handleSelect('', '')}
                style={styles.optionButton}
                _pressed={{ opacity: 0.7 }}
              >
                <Text color="gray.500" fontSize="sm">
                  {placeholder}
                </Text>
              </Pressable>

              {React.Children.map(children, (child: any, index) => (
                <Pressable
                  key={index}
                  onPress={() =>
                    handleSelect(child.props.value, child.props.label)
                  }
                  style={[
                    styles.optionButton,
                    selectedValue === child.props.value &&
                      styles.selectedOption,
                  ]}
                  _pressed={{ opacity: 0.7 }}
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text
                      color={
                        selectedValue === child.props.value
                          ? 'blue.500'
                          : 'gray.700'
                      }
                      fontSize="sm"
                      fontWeight={
                        selectedValue === child.props.value ? 'bold' : 'normal'
                      }
                    >
                      {child.props.label}
                    </Text>
                    {selectedValue === child.props.value && (
                      <Icon
                        as={Ionicons}
                        name="checkmark"
                        size="sm"
                        color="blue.500"
                      />
                    )}
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({ value, label, children }) =>
  null;

// Interfaces para os filtros
interface FiltrosRomaneios {
  codigo: string;
  cliente: string;
  status: string;
}

interface ClienteDisponivel {
  razao_social: string;
  _id: string;
}

interface RomaneioDisponivel {
  cliente: ClienteDisponivel;
  _id: string;
}

interface StatusDisponivel {
  nome: string;
  _id: string;
}

interface Romaneio {
  _id: string;
  codigo: number;
  cliente: {
    _id?: string;
    nome?: string;
    razao_social?: string;
    nome_fantasia?: string;
  };
  transportadora?: {
    nome?: string;
    razao_social?: string;
  } | any;
  dataColeta?: string | Date;
  placaVeiculo?: string;
  nomeMotorista?: string;
  documentoMotorista?: string;
  documentosTransportados?: any[];
  status?: string | { nome?: string, color?: string };
  createdAt: string;
  updatedAt: string;
}

const RomaneiosScreen: React.FC = () => {
  const router = useRouter();

  const [romaneios, setRomaneios] = useState<Romaneio[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Estados do filtro
  const [filtroVisivel, setFiltroVisivel] = useState<boolean>(true);
  const [filtros, setFiltros] = useState<FiltrosRomaneios>({
    codigo: '',
    cliente: '',
    status: '',
  });

  // Estados para os dados dos selects
  const [clientesDisponiveis, setClientesDisponiveis] = useState<ClienteDisponivel[]>([]);
  const [romaneiosDisponiveis, setRomaneiosDisponiveis] = useState<RomaneioDisponivel[]>([]);
  const [statusDisponiveis, setStatusDisponiveis] = useState<StatusDisponivel[]>([]);

  const fetchRomaneios = async (filtrosAtivos?: any) => {
    try {
      setError(null);
      
      console.log("filtrosAtivos ", filtrosAtivos)

      const response = await api.get(`/romaneios?`+
                                      `codigo=${filtrosAtivos?.codigo || ""}&`+
                                      `cliente=${filtrosAtivos?.cliente || ""}&`+
                                      `status=${filtrosAtivos?.status || ""}`
      );
      const data = response.data;
      const lista: Romaneio[] = Array.isArray(data)
        ? data
        : data?.romaneios || [];

      setRomaneios(lista);
    } catch (err: any) {
      let msg = 'Erro ao carregar romaneios';
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
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchRomaneios(),
        fetchClientes(),
        fetchStatus(),
      ]);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRomaneios();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRomaneios(filtros);
  };

  const aplicarFiltros = async () => {
    setLoading(true);
    await fetchRomaneios(filtros);
    setLoading(false);
  };

  const limparFiltros = async () => {
    const filtrosLimpos: FiltrosRomaneios = {
      codigo: '',
      cliente: '',
      status: '',
    };
    setFiltros(filtrosLimpos);

    setLoading(true);
    await fetchRomaneios(filtrosLimpos);
    setLoading(false);
  };

  const toggleFiltro = () => {
    setFiltroVisivel(!filtroVisivel);
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      let clientes = response.data.clientes || []
      setClientesDisponiveis(clientes);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await api.get('/status');
      let status = response.data.status || []
      setStatusDisponiveis(status);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    }
  };

  const goToAdd = () => router.push('/romaneios/add');

  const goToEdit = (id?: string) => {
    if (id) {
      router.push({ pathname: '/romaneios/[id]', params: { id } });
    }
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('pt-BR');
    } catch {
      return String(date);
    }
  };

  const renderRomaneioCard = ({ item }: { item: Romaneio }) => {
    const clienteNome = item.cliente?.nome_fantasia || item.cliente?.razao_social || item.cliente?.nome || 'Cliente não identificado';
    
    let transportadoraNome = item.transportadora?.nome || 'Transportadora indisponível';

    let codigoRomaneio = item.codigo || 'Código indisponível';

    const statusNome = typeof item.status === 'string' ? item.status : item.status?.nome || 'Sem status';
    const possuiRecusa =
      Array.isArray(item.documentosTransportados) &&
      item.documentosTransportados.some(
        (doc: any) => doc?.statusEntrega?._id === '6963137d8ca67663704b235b'
      );

    return (
      <Pressable onPress={() => goToEdit(item._id)}>
        <Box
          bg="white"
          rounded="xl"
          p={4}
          mx={3}
          my={2}
          shadow={1}
        >
          <VStack space={3}>
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack flex={1} mr={2}>
                <Text fontSize="md" fontWeight="bold" color="gray.800" numberOfLines={1}>
                  {clienteNome}
                </Text>
                {item.placaVeiculo ? (
                   <Text fontSize="xs" color="gray.500">
                     Placa: {item.placaVeiculo}
                   </Text>
                ) : null}
              </VStack>

              <HStack alignItems="center" space={2}>
                {possuiRecusa ? (
                  <Icon as={Ionicons} name="alert-circle" size="sm" color="yellow.500" />
                ) : null}
                <Box
                  px={2}
                  py={0.5}
                  rounded="full"
                  bg={typeof item?.status === 'object' && item?.status?.color ? item.status.color : 'gray.200'}
                >
                  <Text fontSize="xs" fontWeight="bold" color={ '#000' }>
                    { statusNome }
                  </Text>
                </Box>
              </HStack>
            </HStack>

            <VStack space={1}>
               <HStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="pricetag-outline" size="sm" color="gray.400" />
                  <Text fontSize="sm" color="gray.600" numberOfLines={1} flex={1}>
                    Código: { codigoRomaneio }
                  </Text>
               </HStack>
               
               <HStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="business-outline" size="sm" color="gray.400" />
                  <Text fontSize="sm" color="gray.600" numberOfLines={1} flex={1}>
                    {transportadoraNome}
                  </Text>
               </HStack>
               
               <HStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="calendar-outline" size="sm" color="gray.400" />
                  <Text fontSize="sm" color="gray.600">
                    Coleta: {formatDate(item.dataColeta)}
                  </Text>
               </HStack>
            </VStack>
          </VStack>
        </Box>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <Box flex={1} bg="gray.50">
        <Center flex={1}>
          <Spinner size="lg" color="blue.500" />
          <Text mt={4} color="gray.500">
            Carregando romaneios...
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50">
      {/* Header com filtros */}
      <Box bg="white" shadow={1} px={4} py={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" space={2}>
            <Pressable onPress={toggleFiltro} _pressed={{ opacity: 0.7 }}>
              <Icon
                as={Ionicons}
                name={filtroVisivel ? 'filter' : 'filter-outline'}
                size="md"
                color={filtroVisivel ? 'blue.500' : 'gray.500'}
              />
            </Pressable>
            <Text fontSize="md" fontWeight="semibold" color="gray.700">
              Filtros
            </Text>
          </HStack>

          <Badge
            colorScheme="blue"
            variant="solid"
            rounded="full"
            px={3}
            py={1}
          >
            <Text fontSize="xs" color="white">
              {romaneios.length} romaneio
              {romaneios.length !== 1 ? 's' : ''}
            </Text>
          </Badge>
        </HStack>
      </Box>

      {/* Área de filtros */}
      <Collapse isOpen={filtroVisivel}>
        <Box bg="white" shadow={1} p={4} mb={2}>
          <VStack space={1}>
            <HStack space={3}>
              <FormControl flex={1}>
                <FormControl.Label>Código</FormControl.Label>
                <Box position="relative">
                  <Icon
                    as={Ionicons}
                    name="document-text-outline"
                    size="sm"
                    color="gray.400"
                    position="absolute"
                    left={3}
                    top={2}
                    zIndex={1}
                  />
                  <TextInput
                    placeholder="Ex: 123"
                    value={filtros.codigo}
                    onChangeText={(text: string) =>
                      setFiltros((prev) => ({ ...prev, codigo: text }))
                    }
                    keyboardType="number-pad"
                    returnKeyType="done"
                    style={{
                      borderWidth: 1,
                      borderColor: '#E2E8F0',
                      borderRadius: 4,
                      paddingVertical: 8,
                      paddingLeft: 40,
                      paddingRight: 10,
                      fontSize: 14,
                      backgroundColor: '#FFFFFF',
                      height: 40,
                      color: '#1F2937',
                    }}
                    placeholderTextColor="#9CA3AF"
                  />
                </Box>
              </FormControl>

              <FormControl flex={1}>
                <FormControl.Label>Cliente</FormControl.Label>
                <CustomSelect
                  selectedValue={filtros.cliente}
                  placeholder="Selecione o cliente"
                  onValueChange={(value: string) =>
                    setFiltros((prev) => ({ ...prev, cliente: value }))
                  }
                >
                  {clientesDisponiveis.map((cliente, index) => (
                    <SelectItem
                      key={index}
                      label={cliente.razao_social}
                      value={cliente._id}
                    />
                  ))}
                </CustomSelect>
              </FormControl>
            </HStack>

            <HStack space={3}>

              <FormControl flex={0.48}>
                <FormControl.Label>Status</FormControl.Label>
                <CustomSelect
                  selectedValue={filtros.status}
                  placeholder="Selecione o status"
                  onValueChange={(value: string) =>
                    setFiltros((prev) => ({ ...prev, status: value }))
                  }
                >
                  {statusDisponiveis.map((status, index) => (
                    <SelectItem
                      key={index}
                      label={status.nome}
                      value={status._id}
                    />
                  ))}
                </CustomSelect>
              </FormControl>
            </HStack>

            <HStack justifyContent="flex-end" space={2} mt={2}>
              <Button
                size="sm"
                variant="outline"
                colorScheme="gray"
                onPress={limparFiltros}
                leftIcon={<Icon as={Ionicons} name="refresh" size="sm" />}
              >
                Limpar
              </Button>
              <Button
                size="sm"
                colorScheme="blue"
                onPress={aplicarFiltros}
                leftIcon={<Icon as={Ionicons} name="search" size="sm" />}
              >
                Aplicar
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Collapse>

      <Pressable onPress={goToAdd}>
        <Icon
          as={Ionicons}
          name="add-circle"
          size="xl"
          color="blue.500"
        />
      </Pressable>

      {/* LISTA */}
      <FlatList
        data={romaneios}
        renderItem={renderRomaneioCard}
        keyExtractor={(item) => item._id}
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
              Nenhum romaneio ainda
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
              <Button onPress={() => fetchRomaneios(filtros)}>
                Tentar novamente
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

// Estilos
const styles = StyleSheet.create({
  selectButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    height: 40,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  selectedOption: {
    backgroundColor: '#EBF8FF',
  },
});

export default RomaneiosScreen;
