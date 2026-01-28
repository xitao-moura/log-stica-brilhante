import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Button, Icon, Spinner, Center, Modal, FormControl, useToast, Pressable } from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../src/config/api.config';
import { StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

interface InventarioStatus {
  _id?: string;
  nome?: string;
}

interface Inventario {
  _id?: string;
  nome: string;
  status?: InventarioStatus | string;
  createdAt?: string;
  descricao?: string;
  cliente?: string | { _id?: string; nome?: string };
}

interface StatusRegistro {
  _id: string;
  nome: string;
  grupo?: string;
  color?: string;
}

interface ClienteRegistro {
  _id: string;
  razao_social: string;
}

interface CustomSelectProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
  title?: string;
}

interface SelectItemProps {
  value: string;
  label: string;
  children?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  selectedValue,
  onValueChange,
  placeholder,
  children,
  title,
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
              {title || 'Selecionar item'}
            </Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={2}>
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
                  style={styles.optionButton}
                  _pressed={{ opacity: 0.7 }}
                >
                  <Text fontSize='sm' color='gray.700'>
                    {child.props.label}
                  </Text>
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

const EditInventarioScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params?.id === 'string' ? params.id : undefined;

  const [inventario, setInventario] = useState<Inventario | null>(null);
  const [nome, setNome] = useState<string>('');
  const [statusId, setStatusId] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [clienteId, setClienteId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [statusList, setStatusList] = useState<StatusRegistro[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [clientesList, setClientesList] = useState<ClienteRegistro[]>([]);

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    } catch {
      return iso || '';
    }
  };

  const fetchInventario = async () => {
    if (!id) return;
    try {
      setError(null);
      const response = await api.get(`/inventarios/${id}`);
      const data: Inventario = response.data?.inventario || response.data;
      setInventario(data);
      setNome(data?.nome || '');
      const st = data?.status;
      if (typeof st === 'string') {
        setStatusId(st);
      } else {
        setStatusId(st?._id || '');
      }
      setCreatedAt(formatDate(data?.createdAt));
      setDescricao(data?.descricao || '');
      const cl = data?.cliente;
      if (typeof cl === 'string') {
        setClienteId(cl);
      } else {
        setClienteId(cl?._id || '');
      }
    } catch (err: any) {
      let errorMessage = 'Erro ao carregar inventário';
      if (err.response) {
        errorMessage = `Erro ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchInventario();
  }, [id]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoadingStatus(true);
        const response = await api.get('/status?grupo=69414391df3a06981474036a');
        const data = response.data;
        const lista: StatusRegistro[] = Array.isArray(data)
          ? data
          : data?.status || [];
        setStatusList(lista);
      } catch (err: any) {
        toast.show({
          description:
            err?.response?.data?.message ||
            err?.message ||
            'Falha ao carregar status',
          placement: 'top',
        });
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        const data = response.data;
        const lista: ClienteRegistro[] = Array.isArray(data) ? data : data?.clientes || [];
        setClientesList(lista);
      } catch (err: any) {
        toast.show({
          description:
            err?.response?.data?.message || err?.message || 'Falha ao carregar clientes',
          placement: 'top',
        });
      }
    };
    fetchClientes();
  }, []);

  const handleSave = async () => {
    if (!id) return;
    try {
      if (!nome) {
        toast.show({ description: 'Informe o nome do inventário!', placement: 'top' });
        return;
      }
      setSaving(true);
      const payload: any = { nome, descricao, status: statusId || undefined, cliente: clienteId || undefined };
      await api.patch(`/inventarios/${id}`, payload);
      toast.show({ description: 'Inventário atualizado com sucesso!', placement: 'top' });
      router.back();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Falha ao atualizar inventário';
      toast.show({ description: msg, placement: 'top' });
    } finally {
      setSaving(false);
    }
  };

  const goToVisualizarPallets = () => {
    if (id) {
      console.log("id ", id)
      router.push({ pathname: '/pallets', params: { inventarioId: id } });
    }
  };

  if (loading) {
    return (
      <Box flex={1} bg='gray.50'>
        <Center flex={1}>
          <Spinner size='lg' color='blue.500' />
          <Text mt={4} color='gray.500'>Carregando inventário...</Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg='gray.50'>
      <Box bg='white' shadow={1} px={4} py={3}>
        <HStack justifyContent='space-between' alignItems='center'>
          <HStack alignItems='center' space={2}>
            <Icon as={MaterialIcons} name='inventory' size='md' color='blue.500' />
            <Text fontSize='md' fontWeight='semibold' color='gray.700'>Editar Inventário</Text>
          </HStack>
          <Button variant='outline' colorScheme='gray' size='sm' onPress={() => router.back()} leftIcon={<Icon as={Ionicons} name='arrow-back' size='sm' />}>Voltar</Button>
        </HStack>
      </Box>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <VStack space={4} p={4}>
            <FormControl>
              <FormControl.Label>ID</FormControl.Label>
              <TextInput value={inventario?._id || ''} editable={false} style={styles.inputDisabled} />
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label>Nome</FormControl.Label>
              <TextInput value={nome} onChangeText={setNome} placeholder='Informe o nome' style={styles.inputDefault} />
            </FormControl>

            <FormControl>
              <FormControl.Label>Status</FormControl.Label>
              <CustomSelect
                selectedValue={statusId}
                onValueChange={setStatusId}
                placeholder='Selecione o status'
                title='Selecionar status'
              >
                {statusList.map((s) => (
                  <SelectItem key={s._id} value={s._id} label={s.nome} />
                ))}
              </CustomSelect>
            </FormControl>

            <FormControl>
              <FormControl.Label>Cliente</FormControl.Label>
              <CustomSelect
                selectedValue={clienteId}
                onValueChange={setClienteId}
                placeholder='Selecione o cliente'
                title='Selecionar cliente'
              >
                {clientesList.map((c) => (
                  <SelectItem key={c._id} value={c._id} label={c.razao_social} />
                ))}
              </CustomSelect>
            </FormControl>

            <FormControl>
              <FormControl.Label>Descrição</FormControl.Label>
              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                placeholder='Informe a descrição'
                multiline
                numberOfLines={4}
                style={styles.inputTextarea}
              />
            </FormControl>

            <HStack space={2} mt={5}>
              <Button
                flex={1}
                colorScheme='blue'
                onPress={handleSave}
                isLoading={saving}
                leftIcon={<Icon as={Ionicons} name='save-outline' size='sm' />}
              >
                Salvar
              </Button>
              <Button
                flex={1}
                variant='outline'
                colorScheme='blue'
                onPress={goToVisualizarPallets}
                leftIcon={<Icon as={MaterialIcons} name='visibility' size='sm' />}
              >
                Visualizar posições
              </Button>
            </HStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal isOpen={showError} onClose={() => setShowError(false)} size='lg'>
        <Modal.Content maxWidth='400px'>
          <Modal.CloseButton />
          <Modal.Header>
            <HStack alignItems='center' space={2}>
              <Icon as={Ionicons} name='alert-circle' size='md' color='red.500' />
              <Text fontSize='lg' fontWeight='bold'>Erro</Text>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <Text>{error}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant='ghost' colorScheme='blueGray' onPress={() => setShowError(false)}>Fechar</Button>
              <Button colorScheme='blue' onPress={fetchInventario}>Tentar novamente</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default EditInventarioScreen;

const styles = StyleSheet.create({
  inputDefault: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    minHeight: 40,
    justifyContent: 'center',
  },
  inputDisabled: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    color: '#94A3B8',
    minHeight: 40,
    justifyContent: 'center',
  },
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
  inputTextarea: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#1F2937',
  },
});
