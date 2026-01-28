import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Button, Icon, FormControl, Input, Modal, Center, Spinner, useToast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../src/config/api.config';
import { StyleSheet, TextInput } from 'react-native';

const AddPalletScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ inventarioId?: string }>();
  const inventarioId = typeof params?.inventarioId === 'string' ? params.inventarioId : undefined;

  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState<boolean>(false);

  const [codigo_barra, setCodigoBarra] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    console.log("inventarioId ", inventarioId)
  }, [])

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

  const handleSubmit = async () => {
    try {
      if (!codigo_barra) {
        toast.show({ description: 'Informe o código de barras!', placement: 'top' });
        return;
      }
      setSubmitting(true);
      const payload: any = { 
        codigo_barra: codigo_barra ,
        inventario: inventarioId || ""
      };
      
      await api.post('/pallets', payload);
      toast.show({ description: 'Posição cadastrada com sucesso!', placement: 'top' });
      router.back();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Falha ao cadastrar posição';
      toast.show({ description: msg, placement: 'top' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box flex={1} bg='gray.50'>
      <Box bg='white' shadow={1} px={4} py={3}>
        <HStack justifyContent='space-between' alignItems='center'>
          <HStack alignItems='center' space={2}>
            <Icon as={Ionicons} name='add-circle' size='md' color='blue.500' />
            <Text fontSize='md' fontWeight='semibold' color='gray.700'>Nova Posição</Text>
          </HStack>
          <Button variant='outline' colorScheme='gray' size='sm' onPress={() => router.back()} leftIcon={<Icon as={Ionicons} name='arrow-back' size='sm' />}>Voltar</Button>
        </HStack>
      </Box>

      <VStack space={4} p={4}>
        <FormControl>
          <FormControl.Label>Código (via código de barras)</FormControl.Label>
          <HStack space={2} alignItems='center'>
            <TextInput
              // flex={1} 
              value={codigo_barra} 
              onChangeText={setCodigoBarra} 
              placeholder='Toque em Ler Código ou digite' 
              style={ styles.inputDefault }
            />
          </HStack>
        </FormControl>

        {/* <Button 
          colorScheme='blue' 
          onPress={openScanner} 
          leftIcon={<Icon as={Ionicons} name='qr-code' size='sm' />}
          style={{ marginBottom: 20 }}
        >Ler Código</Button> */}

        <Button
          colorScheme='blue'
          onPress={handleSubmit}
          isLoading={submitting}
          leftIcon={<Icon as={Ionicons} name='save-outline' size='sm' />}
        >
          Enviar
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

export default AddPalletScreen;

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
