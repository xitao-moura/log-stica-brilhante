import React, { useEffect, useMemo, useState } from 'react';
import { Box, VStack, HStack, Text, Button, Icon, FormControl, Modal, Center, Spinner, useToast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../src/config/api.config';
import { StyleSheet, TextInput } from 'react-native';

const EditPalletScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ id?: string; pallet?: string }>();
  const id = typeof params?.id === 'string' ? params.id : undefined;
  const palletParam = typeof params?.pallet === 'string' ? params.pallet : undefined;
  const pallet = useMemo(() => {
    try {
      return palletParam ? JSON.parse(palletParam) : null;
    } catch {
      return null;
    }
  }, [palletParam]);

  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState<boolean>(false);

  const [codigo_barra, setCodigoBarra] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setCodigoBarra(data || '');
    setShowScanner(false);
  };

  const openScanner = async () => {
    if (!permission || !permission.granted) {
      await requestPermission();
    }
    setShowScanner(true);
  };

  const loadItem = () => {
    try {
      if (!pallet || !pallet?._id) {
        throw new Error('Pallet inválido');
      }
      const idx = Number(id);
      const itens = Array.isArray(pallet?.itens) ? pallet!.itens! : [];
      const item = itens[idx];
      setCodigoBarra(item?.codigo_barra || '');
    } catch (err: any) {
      const msg = err?.message || 'Falha ao carregar produto';
      toast.show({ description: msg, placement: 'top' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadItem();
  }, [id, palletParam]);

  const handleSubmit = async () => {
    try {
      if (!pallet?._id) {
        toast.show({ description: 'Pallet inválido', placement: 'top' });
        return;
      }
      if (!codigo_barra) {
        toast.show({ description: 'Informe o código de barras!', placement: 'top' });
        return;
      }
      
      setSubmitting(true);
      
      await api.put(`/pallets/${pallet._id}/itens/:${codigo_barra}`, { codigo_barra } );
      toast.show({ description: 'Produto atualizado com sucesso!', placement: 'top' });
      router.back();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Falha ao atualizar produto';
      toast.show({ description: msg, placement: 'top' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box flex={1} bg='gray.50'>
        <Center flex={1}>
          <Spinner size='lg' color='blue.500' />
          <Text mt={4} color='gray.500'>Carregando pallet...</Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg='gray.50'>
      <Box bg='white' shadow={1} px={4} py={3}>
        <HStack justifyContent='space-between' alignItems='center'>
          <HStack alignItems='center' space={2}>
            <Icon as={Ionicons} name='create' size='md' color='blue.500' />
            <Text fontSize='md' fontWeight='semibold' color='gray.700'>Editar Produto</Text>
          </HStack>
          <Button variant='outline' colorScheme='gray' size='sm' onPress={() => router.back()} leftIcon={<Icon as={Ionicons} name='arrow-back' size='sm' />}>Voltar</Button>
        </HStack>
      </Box>

      <VStack space={4} p={4}>
        <FormControl>
          <FormControl.Label>Código (via código de barras)</FormControl.Label>
          <HStack space={2} alignItems='center'>
            <TextInput
              value={codigo_barra}
              onChangeText={setCodigoBarra}
              placeholder='Toque em Ler Código ou digite'
              style={styles.inputDefault}
            />
          </HStack>
        </FormControl>

        <Button
          colorScheme='blue'
          onPress={openScanner}
          leftIcon={<Icon as={Ionicons} name='qr-code' size='sm' />}
          style={{ marginBottom: 20 }}
        >Ler Código</Button>

        <Button
          colorScheme='blue'
          onPress={handleSubmit}
          isLoading={submitting}
          leftIcon={<Icon as={Ionicons} name='save-outline' size='sm' />}
        >
          Salvar
        </Button>
      </VStack>

      <Modal isOpen={showScanner} onClose={() => setShowScanner(false)} size='full'>
        <Modal.Content maxWidth='100%' maxHeight='100%'>
          <Modal.Header>
            <Text>Scanner de Código de Barras</Text>
          </Modal.Header>
          <Modal.Body p={0}>
            {!permission ? (
              <Center p={4}>
                <Spinner size='lg' color='blue.500' />
                <Text mt={2}>Carregando permissões...</Text>
              </Center>
            ) : !permission.granted ? (
              <VStack space={4} p={4}>
                <Text>Sem acesso à câmera</Text>
                <Button onPress={requestPermission}>Solicitar Permissão</Button>
              </VStack>
            ) : (
              <CameraView
                style={{ height: 420 }}
                facing='back'
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', "code128", "itf14", "codabar"],
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
  }
});

