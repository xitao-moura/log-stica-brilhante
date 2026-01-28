import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  Button,
  Pressable,
  Icon,
  Divider,
  Collapse,
  Spinner,
  Center,
  Modal,
  FormControl,
} from 'native-base';
import {
  FlatList,
  TextInput,
  RefreshControl,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../src/config/api.config';

// Interfaces para tipagem
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

// Componente Select personalizado que funciona em Android e iOS
const CustomSelect: React.FC<CustomSelectProps> = ({
  selectedValue,
  onValueChange,
  placeholder,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  // Encontrar o label do valor selecionado
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
        <HStack justifyContent='space-between' alignItems='center'>
          <Text color={displayValue ? 'gray.700' : 'gray.400'} fontSize='sm'>
            {displayValue || placeholder}
          </Text>
          <Icon as={Ionicons} name='chevron-down' size='sm' color='gray.400' />
        </HStack>
      </Pressable>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Content maxWidth='400px'>
          <Modal.CloseButton />
          <Modal.Header>
            <Text fontSize='lg' fontWeight='bold'>
              Selecionar Cliente
            </Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={2}>
              {/* Opção para limpar seleção */}
              <Pressable
                onPress={() => handleSelect('', '')}
                style={styles.optionButton}
                _pressed={{ opacity: 0.7 }}
              >
                <Text color='gray.500' fontSize='sm'>
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
                  <HStack justifyContent='space-between' alignItems='center'>
                    <Text
                      color={
                        selectedValue === child.props.value
                          ? 'blue.500'
                          : 'gray.700'
                      }
                      fontSize='sm'
                      fontWeight={
                        selectedValue === child.props.value ? 'bold' : 'normal'
                      }
                    >
                      {child.props.label}
                    </Text>
                    {selectedValue === child.props.value && (
                      <Icon
                        as={Ionicons}
                        name='checkmark'
                        size='sm'
                        color='blue.500'
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

interface Cidade {
  Nome: string;
  CodigoIbge: string;
  SiglaEstado: string;
}

interface Destinatario {
  Razao: string;
  Fantasia: string;
  Cnpj: string;
  InscricaoEstadual: string;
  Endereco: string;
  Numero: string;
  Complemento: string;
  Bairro: string;
  Cep: string;
  Telefone: string;
  Celular: string;
  Contato: string;
  Email: string;
  Observacao: string | null;
  Cidade: Cidade;
}

interface Cliente {
  _id: string;
  inscricao_estadual: string;
  endereco: string;
  numero: string;
  cep: string;
  bairro: string;
  cidade: string;
  estado: string;
  celular: string | null;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  telefone: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  wmsHost?: string;
  wmsToken?: string;
}

interface Produto {
  Partnumber: string;
  Descricao: string;
  Unidade: string;
  Ncm: string;
  ClassificacaoFiscal: string;
  Ean13: string;
  Grupo: string;
  Linha: string;
  Tipo: string;
}

interface Item {
  _id: string;
  Numero: number;
  Produto: Produto;
  Lote: string;
  Serial: string;
  Modelo: string;
  DataFabricacao: string;
  DataValidade: string;
  Quantidade: number;
  ValorUnitario: number;
  QuantidadeOriginal: number;
  QuantidadeConferida: number;
}

interface Conferencia {
  _id: string;
  cliente: Cliente;
  Destinatario: Destinatario;
  Numero: string;
  DataEmissao: string;
  ValorTotal: number;
  CnpjCliente: string | null;
  CnpjTransportadora: string;
  Observacao: string | null;
  Serie: number;
  PesoTotal: number;
  Volume: number;
  divisao_nfs: string | null;
  Itens: Item[];
  xmlNFS: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  conferencias: Conferencia[];
  count: number;
}

interface FiltrosPedidos {
  numeroPedido: string;
  cliente: string;
}

interface ClienteDisponivel {
  nome: string;
  valor: string;
}

const PedidosScreen: React.FC = () => {
  const router = useRouter();

  const [conferencias, setConferencias] = useState<Conferencia[]>([]);
  // Alteração: Estado para armazenar clientes vindos da API
  const [clientesDisponiveis, setClientesDisponiveis] = useState<ClienteDisponivel[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const cancelRef = useRef(null);

  const [filtroVisivel, setFiltroVisivel] = useState<boolean>(true);
  const [filtros, setFiltros] = useState<FiltrosPedidos>({
    numeroPedido: '',
    cliente: '',
  });

  // Função para buscar os clientes na API
  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      // Verificando se retorna um array direto ou um objeto com a chave clientes
      // Ajuste conforme o retorno real do seu backend
      const dados = response.data.clientes || response.data;
      
      if (Array.isArray(dados)) {
        const clientesFormatados = dados.map((c: any) => ({
          nome: c.razao_social || c.nome_fantasia || 'Sem nome',
          valor: c._id
        }));
        
        // Opcional: Ordenar alfabeticamente
        clientesFormatados.sort((a: ClienteDisponivel, b: ClienteDisponivel) => 
          a.nome.localeCompare(b.nome)
        );

        setClientesDisponiveis(clientesFormatados);
      }
    } catch (err) {
      console.error('Erro ao buscar lista de clientes para filtro:', err);
      // Não bloqueamos a UI se falhar o carregamento do filtro, apenas logamos
    }
  };

  const fetchConferencias = async (filtrosAtivos?: FiltrosPedidos) => {
    try {
      setError(null);

      const params: Record<string, string> = {};

      if (filtrosAtivos?.numeroPedido) {
        params.numero = filtrosAtivos.numeroPedido;
      }

      if (filtrosAtivos?.cliente) {
        params.cliente = filtrosAtivos.cliente;
      }

      const response = await api.get<ApiResponse>('/conferencias', {
        params,
      });

      setConferencias(response.data.conferencias || []);
    } catch (err: any) {
      console.error('Erro ao buscar conferências:', err);

      let errorMessage = 'Erro desconhecido ao carregar pedidos';

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
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      // Carrega conferências e clientes em paralelo
      await Promise.all([
        fetchConferencias(),
        fetchClientes()
      ]);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const aplicarFiltros = async () => {
    setLoading(true);
    await fetchConferencias(filtros);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Atualiza tanto a lista de pedidos quanto a lista de clientes
    await Promise.all([
      fetchConferencias(filtros),
      fetchClientes()
    ]);
    setRefreshing(false);
  };

  const toggleFiltro = () => {
    setFiltroVisivel(!filtroVisivel);
  };

  // REMOVIDO: O useMemo antigo que filtrava de "conferencias" foi removido
  // e substituído pelo estado "clientesDisponiveis" populado pelo fetchClientes.

  const limparFiltros = async () => {
    const filtrosLimpos: FiltrosPedidos = {
      numeroPedido: '',
      cliente: '',
    };
    setFiltros(filtrosLimpos);

    setLoading(true);
    await fetchConferencias(filtrosLimpos);
    setLoading(false);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatCNPJ = (cnpj: string): string => {
    if (!cnpj || typeof cnpj !== 'string') {
      return 'CNPJ não informado';
    }
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  };

  const calculateProgress = (itens: Item[]): number => {
    if (!itens || !Array.isArray(itens)) {
      return 0;
    }

    const totalItens = itens.reduce(
      (acc, item) => acc + (item.Quantidade || 0),
      0
    );
    const itensConferidos = itens.reduce(
      (acc, item) => acc + (item.QuantidadeConferida || 0),
      0
    );
    return totalItens > 0
      ? Math.round((itensConferidos / totalItens) * 100)
      : 0;
  };

  const handlePedidoPress = (pedidoId: string) => {
    router.push(`/pedidos/${pedidoId}`);
  };

  const handleConferencePress = (pedidoId: string) => {
    router.push(`/pedidos/${pedidoId}`);
  };

  const renderPedidoCard = ({ item }: { item: Conferencia }) => {
    const progress = calculateProgress(item.Itens || []);
    const totalItens = (item.Itens || []).reduce(
      (acc, itm) => acc + (itm.Quantidade || 0),
      0
    );
    const numeroExibicao = item.Numero;
    const nomeStatus =
      (item.status as { nome: string; color: string } | null)?.nome ||
      'Sem status';
    const corStatus =
      (item.status as { nome: string; color: string } | null)?.color ||
      'gray.400';

    return (
      <Pressable
        onPress={() => handlePedidoPress(item._id)}
        _pressed={{ opacity: 0.8 }}
        mb={4}
      >
        <Box
          bg='white'
          rounded='lg'
          shadow={2}
          p={4}
          mx={4}
          borderWidth={1}
          borderColor='gray.200'
        >
          <HStack justifyContent='space-between' alignItems='center' mb={3}>
            <HStack alignItems='center' space={2} marginRight={3}>
              <Icon
                as={Ionicons}
                name='document-text'
                size='sm'
                color='blue.500'
              />
              <Text fontSize='lg' fontWeight='bold' color='gray.700'>
                NF Nº {numeroExibicao}
              </Text>
            </HStack>
            <Badge bgColor={corStatus} rounded='full'>
              <HStack alignItems='center' space={1}>
                <Icon as={Ionicons} name='time' size='xs' color='white' />
                <Text fontSize='xs' color='white'>
                  {nomeStatus}
                </Text>
              </HStack>
            </Badge>
          </HStack>

          <HStack alignItems='center' space={2} mb={3}>
            <Icon as={Ionicons} name='calendar' size='sm' color='gray.500' />
            <Text fontSize='sm' color='gray.600'>
              Emissão: {item.DataEmissao || 'Não informado'}
            </Text>
          </HStack>

          {/* Informações do Cliente */}
          {item.cliente && (
            <VStack space={2} mb={3}>
              <HStack alignItems='center' space={2}>
                <Icon as={Ionicons} name='person' size='sm' color='green.500' />
                <Text fontSize='sm' fontWeight='semibold' color='gray.700'>
                  Cliente
                </Text>
              </HStack>
              <Text fontSize='sm' color='gray.700' ml={6}>
                {item.cliente.razao_social || 'Não informado'}
              </Text>
              <Text fontSize='xs' color='gray.500' ml={6}>
                {item.cliente.nome_fantasia || 'Não informado'}
              </Text>
            </VStack>
          )}

          <Divider mb={3} />

          <VStack space={2} mb={4}>
            <HStack alignItems='center' space={2}>
              <Icon as={Ionicons} name='business' size='sm' color='blue.500' />
              <Text fontSize='sm' fontWeight='semibold' color='gray.700'>
                Destinatário
              </Text>
            </HStack>
            <Text fontSize='sm' color='gray.700' ml={6}>
              {item.Destinatario?.Razao || 'Não informado'}
            </Text>
            <Text fontSize='xs' color='gray.500' ml={6}>
              CNPJ: {formatCNPJ(item.Destinatario?.Cnpj)}
            </Text>
          </VStack>

          <VStack space={2} mb={4}>
            <HStack justifyContent='space-between' alignItems='center'>
              <HStack alignItems='center' space={2}>
                <Icon as={Ionicons} name='cube' size='sm' color='green.500' />
                <Text fontSize='sm' fontWeight='semibold' color='gray.700'>
                  Progresso dos Itens
                </Text>
              </HStack>
              <Text fontSize='xs' color='gray.500'>
                {progress}% (
                {(item.Itens || []).reduce(
                  (acc, itm) => acc + (itm.QuantidadeConferida || 0),
                  0
                )}
                /{totalItens})
              </Text>
            </HStack>
            <Progress
              value={progress}
              colorScheme={
                progress === 100
                  ? 'success'
                  : progress > 50
                  ? 'warning'
                  : 'info'
              }
              size='sm'
              rounded='full'
            />
          </VStack>

          <Divider mb={4} />

          <HStack justifyContent='space-between' alignItems='center'>
            <VStack>
              <HStack alignItems='center' space={2}>
                <Icon as={Ionicons} name='cash' size='sm' color='green.600' />
                <Text fontSize='sm' color='gray.600'>
                  Valor Total
                </Text>
              </HStack>
              <Text fontSize='lg' fontWeight='bold' color='green.600' ml={6}>
                {formatCurrency(item.ValorTotal || 0)}
              </Text>
            </VStack>

            <Button
              leftIcon={<Icon as={Ionicons} name='eye-outline' size='sm' />}
              size='sm'
              colorScheme='blue'
              variant='outline'
              onPress={() => handleConferencePress(item._id)}
            >
              Conferência
            </Button>
          </HStack>
        </Box>
      </Pressable>
    );
  };

  // Componente de loading
  if (loading) {
    return (
      <Box flex={1} bg='gray.50'>
        <Center flex={1}>
          <Spinner size='lg' color='blue.500' />
          <Text mt={4} color='gray.500'>
            Carregando pedidos...
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg='gray.50'>
      {/* Header com filtros */}
      <Box bg='white' shadow={1} px={4} py={3}>
        <HStack justifyContent='space-between' alignItems='center'>
          <HStack alignItems='center' space={2}>
            <Pressable onPress={toggleFiltro} _pressed={{ opacity: 0.7 }}>
              <Icon
                as={Ionicons}
                name={filtroVisivel ? 'filter' : 'filter-outline'}
                size='md'
                color={filtroVisivel ? 'blue.500' : 'gray.500'}
              />
            </Pressable>
            <Text fontSize='md' fontWeight='semibold' color='gray.700'>
              Filtros
            </Text>
          </HStack>

          <Badge
            colorScheme='blue'
            variant='solid'
            rounded='full'
            px={3}
            py={1}
          >
            <Text fontSize='xs' color='white'>
              {conferencias.length} pedido
              {conferencias.length !== 1 ? 's' : ''}
            </Text>
          </Badge>
        </HStack>
      </Box>

      {/* Área de filtros */}
      <Collapse isOpen={filtroVisivel}>
        <Box bg='white' shadow={1} p={4} mb={2}>
          <VStack space={4}>
            <HStack space={3}>
              <FormControl flex={1}>
                <FormControl.Label>Número do Pedido</FormControl.Label>
                <Box position='relative'>
                  <Icon
                    as={Ionicons}
                    name='document-text-outline'
                    size='sm'
                    color='gray.400'
                    position='absolute'
                    left={3}
                    top={2}
                    zIndex={1}
                  />
                  <TextInput
                    placeholder='Ex: 2061'
                    value={filtros.numeroPedido}
                    onChangeText={(text: string) =>
                      setFiltros((prev) => ({ ...prev, numeroPedido: text }))
                    }
                    keyboardType='number-pad'
                    returnKeyType='done'
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
                    placeholderTextColor='#9CA3AF'
                  />
                </Box>
              </FormControl>

              <FormControl flex={1}>
                <FormControl.Label>Cliente</FormControl.Label>
                <CustomSelect
                  selectedValue={filtros.cliente}
                  placeholder='Selecione o cliente'
                  onValueChange={(value: string) =>
                    setFiltros((prev) => ({ ...prev, cliente: value }))
                  }
                >
                  {clientesDisponiveis.map((cliente, index) => (
                    <SelectItem
                      key={index}
                      label={cliente.nome}
                      value={cliente.valor}
                    />
                  ))}
                </CustomSelect>
              </FormControl>
            </HStack>

            <HStack justifyContent='flex-end' space={2}>
              <Button
                size='sm'
                variant='outline'
                colorScheme='gray'
                onPress={limparFiltros}
                leftIcon={<Icon as={Ionicons} name='refresh' size='sm' />}
              >
                Limpar
              </Button>
              <Button
                size='sm'
                colorScheme='blue'
                onPress={aplicarFiltros}
                leftIcon={<Icon as={Ionicons} name='search' size='sm' />}
              >
                Aplicar
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Collapse>

      {/* Lista de pedidos */}
      <FlatList
        data={conferencias}
        renderItem={renderPedidoCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor='#3B82F6'
          />
        }
        ListEmptyComponent={
          <Box flex={1} justifyContent='center' alignItems='center' py={10}>
            <Icon
              as={Ionicons}
              name='document-text-outline'
              size='xl'
              color='gray.400'
              mb={4}
            />
            <Text fontSize='lg' color='gray.500' textAlign='center'>
              Nenhum pedido encontrado
            </Text>
            <Text fontSize='sm' color='gray.400' textAlign='center' mt={2}>
              Tente ajustar os filtros ou puxe para atualizar
            </Text>
          </Box>
        }
      />

      {/* Modal de erro */}
      <Modal isOpen={showError} onClose={() => setShowError(false)} size='lg'>
        <Modal.Content maxWidth='400px'>
          <Modal.CloseButton />
          <Modal.Header>
            <HStack alignItems='center' space={2}>
              <Icon
                as={Ionicons}
                name='alert-circle'
                size='md'
                color='red.500'
              />
              <Text fontSize='lg' fontWeight='bold'>
                Erro ao carregar pedidos
              </Text>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <Text>{error}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant='ghost'
                colorScheme='blueGray'
                onPress={() => setShowError(false)}
              >
                Fechar
              </Button>
              <Button
                colorScheme='blue'
                onPress={async () => {
                  setShowError(false);
                  setLoading(true);
                  await fetchConferencias(filtros);
                  setLoading(false);
                }}
              >
                Tentar novamente
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default PedidosScreen;

const styles = StyleSheet.create({
  selectButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 40,
    justifyContent: 'center',
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