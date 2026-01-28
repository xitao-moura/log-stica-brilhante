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
  Center,
  Spinner,
  useToast,
  Pressable,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import api from '../../src/config/api.config';

const EditPalletScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params?.id === 'string' ? params.id : undefined;

  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);

  const [codigoBarra, setCodigoBarra] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pallet, setPallet] = useState<any>(null);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setCodigoBarra(data || '');
    setShowScanner(false);
  };

  const openScanner = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setShowScanner(true);
  };

  const loadPallet = async () => {
    try {
      if (!id) throw new Error('ID da posição inválido');

      const response = await api.get(`/pallets/${id}`);
      const data = response?.data?.data || response?.data;

      setPallet(data);
      setCodigoBarra(data?.codigo_barra || '');
    } catch (err: any) {
      toast.show({
        description: err?.response?.data?.message || err.message || 'Erro ao carregar posição',
        placement: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadPallet();
  }, [id]);

  const handleSubmit = async () => {
    if (!codigoBarra) {
      toast.show({ description: 'Informe o código de barras', placement: 'top' });
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/pallets/${id}`, { codigo_barra: codigoBarra });
      toast.show({ description: 'Posição atualizada com sucesso', placement: 'top' });
      router.back();
    } catch (err: any) {
      toast.show({
        description: err?.response?.data?.message || err.message || 'Erro ao salvar',
        placement: 'top',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const goToProdutos = () => {
    if (!pallet?._id) return;
    router.push({
      pathname: '/items_pallets',
      params: { pallet: JSON.stringify(pallet) },
    });
  };

  if (loading) {
    return (
      <Box flex={1} bg="gray.50">
        <Center flex={1}>
          <Spinner size="lg" color="blue.500" />
          <Text mt={4} color="gray.500">
            Carregando posição...
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50">
      {/* HEADER */}
      <Box bg="white" shadow={1} px={4} py={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" space={2}>
            <Icon as={Ionicons} name="cube" size="md" color="blue.500" />
            <Text fontSize="md" fontWeight="semibold" color="gray.700">
              Editar Posição
            </Text>
          </HStack>

          <Button
            size="sm"
            variant="outline"
            colorScheme="blueGray"
            leftIcon={<Icon as={Ionicons} name="arrow-back" size="sm" />}
            onPress={() => router.back()}
          >
            Voltar
          </Button>
        </HStack>
      </Box>

      {/* CONTEÚDO */}
      <VStack space={4} p={4}>
        <Box
          bg="white"
          rounded="lg"
          shadow={2}
          p={4}
          borderWidth={1}
          borderColor="gray.200"
        >
          <FormControl mb={4}>
            <FormControl.Label>Código de barras</FormControl.Label>

            <HStack space={2} alignItems="center">
              <TextInput
                value={codigoBarra}
                onChangeText={setCodigoBarra}
                placeholder="Digite ou leia o código"
                style={styles.input}
              />

              {/* <Pressable onPress={openScanner}>
                <Icon as={Ionicons} name="qr-code-outline" size="lg" color="blue.500" />
              </Pressable> */}
            </HStack>
          </FormControl>

          <Button
            colorScheme="blue"
            isLoading={submitting}
            leftIcon={<Icon as={Ionicons} name="save-outline" size="sm" />}
            onPress={handleSubmit}
          >
            Salvar alterações
          </Button>
        </Box>

        <Button
          variant="outline"
          colorScheme="blue"
          leftIcon={<Icon as={Ionicons} name="list-outline" size="sm" />}
          onPress={goToProdutos}
        >
          Visualizar produtos da posição
        </Button>
      </VStack>

      {/* MODAL SCANNER */}
      <Modal isOpen={showScanner} onClose={() => setShowScanner(false)} size="full">
        <Modal.Content maxWidth="100%" maxHeight="100%">
          <Modal.Header>
            <HStack alignItems="center" space={2}>
              <Icon as={Ionicons} name="qr-code" />
              <Text>Leitor de Código de Barras</Text>
            </HStack>
          </Modal.Header>

          <Modal.Body p={0}>
            {!permission ? (
              <Center p={6}>
                <Spinner />
                <Text mt={2}>Verificando permissões...</Text>
              </Center>
            ) : !permission.granted ? (
              <Center p={6}>
                <Text mb={4}>Permissão de câmera necessária</Text>
                <Button onPress={requestPermission}>Permitir acesso</Button>
              </Center>
            ) : (
              <CameraView
                style={{ height: 420 }}
                facing="back"
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: [
                    'ean13',
                    'ean8',
                    'upc_a',
                    'upc_e',
                    'code128',
                    'code39',
                    'itf14',
                    'codabar',
                  ],
                }}
              />
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button onPress={() => setShowScanner(false)}>Fechar</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default EditPalletScreen;

const styles = StyleSheet.create({
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 40,
  },
});
