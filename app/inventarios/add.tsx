import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  FormControl,
  Modal,
  useToast,
  Pressable,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../src/config/api.config';
import { StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

interface StatusRegistro {
  _id: string;
  nome: string;
}

interface SelectItemProps {
  value: string;
  label: string;
}

const SelectItem: React.FC<SelectItemProps> = () => null;

interface CustomSelectProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  children: React.ReactNode;
  title?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  selectedValue,
  onValueChange,
  placeholder,
  children,
  title,
}) => {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (selectedValue && children) {
      const selectedItem = React.Children.toArray(children).find(
        (child: any) => child.props.value === selectedValue
      );
      setLabel(selectedItem ? (selectedItem as any).props.label : '');
    } else {
      setLabel('');
    }
  }, [selectedValue, children]);

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <Box style={styles.selectButton}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text color={label ? 'gray.700' : 'gray.400'} fontSize="sm">
              {label || placeholder}
            </Text>
            <Icon as={Ionicons} name="chevron-down" size="sm" color="gray.400" />
          </HStack>
        </Box>
      </Pressable>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{title || 'Selecionar item'}</Modal.Header>
          <Modal.Body>
            <VStack space={2}>
              <Pressable
                onPress={() => {
                  onValueChange('');
                  setOpen(false);
                }}
                style={styles.optionButton}
              >
                <Text color="gray.500" fontSize="sm">
                  {placeholder}
                </Text>
              </Pressable>
              {React.Children.map(children, (child: any) => (
                <Pressable
                  key={child.props.value}
                  onPress={() => {
                    onValueChange(child.props.value);
                    setOpen(false);
                  }}
                  style={styles.optionButton}
                >
                  <Box p={3} rounded="md">
                    <Text fontSize="sm" color="gray.700">{child.props.label}</Text>
                  </Box>
                </Pressable>
              ))}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

const AddInventarioScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [statusId, setStatusId] = useState('');
  const [statusList, setStatusList] = useState<StatusRegistro[]>([]);
  const [clienteId, setClienteId] = useState('');
  const [clientesList, setClientesList] = useState<{ _id: string; razao_social: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await api.get('/status?grupo=69414391df3a06981474036a');
      setStatusList(Array.isArray(res.data) ? res.data : res.data?.status || []);
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await api.get('/clientes');
        const data = res.data;
        setClientesList(data?.clientes);
      } catch (err: any) {
        toast.show({
          description: err?.response?.data?.message || err.message || 'Falha ao carregar clientes',
          placement: 'top',
        });
      }
    };
    fetchClientes();
  }, []);

  const handleSubmit = async () => {
    if (!nome) {
      toast.show({ description: 'Informe o nome do inventário', placement: 'top' });
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/inventarios', {
        nome,
        descricao,
        status: statusId || undefined,
        cliente: clienteId || undefined,
      });
      toast.show({
        description: 'Inventário cadastrado com sucesso',
        placement: 'top',
      });
      router.back();
    } catch (err: any) {
      toast.show({
        description: err?.response?.data?.message || err.message,
        placement: 'top',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box flex={1} bg="gray.50">
      <Box bg="white" shadow={1} px={4} py={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md" fontWeight="semibold" color="gray.700">Novo Inventário</Text>
          <Button variant="outline" colorScheme="gray" size="sm" onPress={() => router.back()} leftIcon={<Icon as={Ionicons} name="arrow-back" size="sm" />}>Voltar</Button>
        </HStack>
      </Box>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <VStack space={4} p={4}>
            <FormControl isRequired>
              <FormControl.Label>Nome</FormControl.Label>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Informe o nome"
                style={styles.inputDefault}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Cliente</FormControl.Label>
              <CustomSelect
                selectedValue={clienteId}
                onValueChange={setClienteId}
                placeholder="Selecione o cliente"
                title="Selecionar cliente"
              >
                {clientesList.map((c) => (
                  <SelectItem key={c._id} value={c._id} label={c.razao_social} />
                ))}
              </CustomSelect>
            </FormControl>

            <FormControl>
              <FormControl.Label>Status</FormControl.Label>
              <CustomSelect
                selectedValue={statusId}
                onValueChange={setStatusId}
                placeholder="Selecione o status"
                title="Selecionar status"
              >
                {statusList.map((s) => (
                  <SelectItem key={s._id} value={s._id} label={s.nome} />
                ))}
              </CustomSelect>
            </FormControl>

            <FormControl>
              <FormControl.Label>Descrição</FormControl.Label>
              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Informe a descrição"
                multiline
                numberOfLines={4}
                style={styles.inputTextarea}
              />
            </FormControl>

            <Button
              mt={5}
              colorScheme="blue"
              onPress={handleSubmit}
              isLoading={submitting}
              leftIcon={<Icon as={Ionicons} name="save-outline" />}
            >
              Salvar
            </Button>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
};

export default AddInventarioScreen;

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
