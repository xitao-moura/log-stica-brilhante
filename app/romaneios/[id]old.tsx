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
  Spinner,
  Center
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../src/config/api.config';
import { StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import ExpedicoesModal from '../../src/components/ExpedicoesModal';
import DateTimePicker from '@react-native-community/datetimepicker';

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

const EditRomaneioScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { id } = useLocalSearchParams();

  const [clienteId, setClienteId] = useState('');
  const [transportadoraId, setTransportadoraId] = useState('');
  const [dataColeta, setDataColeta] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [placaVeiculo, setPlacaVeiculo] = useState('');
  const [nomeMotorista, setNomeMotorista] = useState('');
  const [documentoMotorista, setDocumentoMotorista] = useState('');
  
  const [clientesList, setClientesList] = useState<{ _id: string; razao_social: string }[]>([]);
  const [transportadorasList, setTransportadorasList] = useState<{ _id: string; razao_social: string }[]>([]);
  
  const [showExpedicoesModal, setShowExpedicoesModal] = useState(false);
  const [selectedExpedicoes, setSelectedExpedicoes] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await api.get('/clientes');
        const data = res.data;
        setClientesList(data?.clientes || []);
      } catch (err: any) {
        toast.show({
          description: err?.response?.data?.message || err.message || 'Falha ao carregar clientes',
          placement: 'top',
        });
      }
    };
    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchTransportadoras = async () => {
      try {
        const res = await api.get('/transportadoras');
        const data = res.data;
        setTransportadorasList(data?.transportadoras || data || []);
      } catch (err: any) {
        console.log('Falha ao carregar transportadoras', err);
      }
    };
    fetchTransportadoras();
  }, []);

  useEffect(() => {
    const fetchRomaneio = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get(`/romaneios/${id}`);
        const data = response.data;
        
        if (data) {
          if (data.cliente) {
             setClienteId(typeof data.cliente === 'string' ? data.cliente : data.cliente._id);
          }

          if (data.transportadora) {
             setTransportadoraId(typeof data.transportadora === 'string' ? data.transportadora : data.transportadora._id);
          }

          if (data.dataColeta) {
            setDataColeta(new Date(data.dataColeta));
          }

          setPlacaVeiculo(data.placaVeiculo || '');
          setNomeMotorista(data.nomeMotorista || '');
          setDocumentoMotorista(data.documentoMotorista || '');

          if (data.documentosTransportados && Array.isArray(data.documentosTransportados)) {
             const ids = data.documentosTransportados.map((doc: any) => {
                if (typeof doc === 'string') return doc;
                if (doc.saida) {
                   if (typeof doc.saida === 'string') return doc.saida;
                   if (doc.saida._id) return doc.saida._id;
                }
                return null;
             }).filter((id: any) => id !== null) as string[];
             setSelectedExpedicoes(ids);
          }
        }
      } catch (err: any) {
         toast.show({
            description: err?.response?.data?.message || err.message || 'Falha ao carregar romaneio',
            placement: 'top',
            colorScheme: 'error'
         });
      } finally {
        setLoading(false);
      }
    };

    fetchRomaneio();
  }, [id]);

  const handleSubmit = async () => {
    if (!clienteId) {
      toast.show({ description: 'Selecione o cliente', placement: 'top' });
      return;
    }

    try {
      setSubmitting(true);
      
      let formattedDataColeta = null;
      if (dataColeta) {
        formattedDataColeta = dataColeta.toISOString();
      }

      let data = {
        cliente: clienteId,
        transportadora: transportadoraId || undefined,
        dataColeta: formattedDataColeta || undefined,
        placaVeiculo: placaVeiculo || undefined,
        nomeMotorista: nomeMotorista || undefined,
        documentoMotorista: documentoMotorista || undefined,
        documentosTransportados: selectedExpedicoes.map(id => ({ saida: id })),
      }

      await api.put(`/romaneios/${id}`, data);
      
      toast.show({
        description: 'Romaneio atualizado com sucesso',
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

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDataColeta(selectedDate);
    }
  };

  if (loading) {
     return (
        <Box flex={1} bg="gray.50" justifyContent="center" alignItems="center">
           <Spinner size="lg" color="blue.500" />
           <Text mt={4} color="gray.500">Carregando dados...</Text>
        </Box>
     )
  }

  return (
    <Box flex={1} bg="gray.50">
      <Box bg="white" shadow={1} px={4} py={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md" fontWeight="semibold" color="gray.700">Editar Romaneio</Text>
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
              <FormControl.Label>Transportadora</FormControl.Label>
              <CustomSelect
                selectedValue={transportadoraId}
                onValueChange={setTransportadoraId}
                placeholder="Selecione a transportadora"
                title="Selecionar transportadora"
              >
                {transportadorasList.map((t) => (
                  <SelectItem key={t._id} value={t._id} label={t.razao_social || (t as any).nome} />
                ))}
              </CustomSelect>
            </FormControl>

            <FormControl>
              <FormControl.Label>Data de Coleta</FormControl.Label>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <Box
                  style={styles.inputDefault}
                  justifyContent="center"
                >
                  <Text color={dataColeta ? 'gray.900' : 'gray.400'}>
                    {dataColeta ? dataColeta.toLocaleDateString('pt-BR') : 'DD/MM/AAAA'}
                  </Text>
                </Box>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={dataColeta || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </FormControl>

            <FormControl>
              <FormControl.Label>Placa do Veículo</FormControl.Label>
              <TextInput
                value={placaVeiculo}
                onChangeText={setPlacaVeiculo}
                placeholder="Informe a placa"
                style={styles.inputDefault}
                autoCapitalize="characters"
                maxLength={8}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Nome do Motorista</FormControl.Label>
              <TextInput
                value={nomeMotorista}
                onChangeText={setNomeMotorista}
                placeholder="Informe o nome do motorista"
                style={styles.inputDefault}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Documento do Motorista</FormControl.Label>
              <TextInput
                value={documentoMotorista}
                onChangeText={setDocumentoMotorista}
                placeholder="Informe o documento (CPF/RG)"
                style={styles.inputDefault}
                keyboardType="numeric"
                maxLength={17}
              />
            </FormControl>

            <Button
              variant="outline"
              colorScheme="blue"
              leftIcon={<Icon as={Ionicons} name="list-outline" />}
              onPress={() => {
                if (!clienteId) {
                  toast.show({
                    description: 'Selecione um cliente primeiro',
                    placement: 'top',
                  });
                  return;
                }
                setShowExpedicoesModal(true);
              }}
              justifyContent="flex-start"
            >
              {selectedExpedicoes.length > 0
                ? `Vincular Expedições (${selectedExpedicoes.length} selecionadas)`
                : 'Vincular Expedições'}
            </Button>

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
      <ExpedicoesModal
        isOpen={showExpedicoesModal}
        onClose={() => setShowExpedicoesModal(false)}
        clienteId={clienteId}
        initialSelectedIds={selectedExpedicoes}
        onSave={setSelectedExpedicoes}
      />
    </Box>
  );
};

export default EditRomaneioScreen;

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
});
