import React, { useMemo, useRef, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Spinner,
  useToast,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
// import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TextInput, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import api from '../../src/config/api.config';

type ItemLido = {
  produto: any;
  quantidade: number;
};

const AddPalletScreen: React.FC = () => {
  const toast = useToast();
  const router = useRouter();
  const params = useLocalSearchParams<{ pallet?: string }>();

  const pallet = useMemo(() => {
    try {
      return params?.pallet ? JSON.parse(params.pallet as string) : null;
    } catch {
      return null;
    }
  }, []);

  // const [permission, requestPermission] = useCameraPermissions();

  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [codigoBarra, setCodigoBarra] = useState('');
  const [itens, setItens] = useState<Record<string, ItemLido>>({});
  const [loadingProduto, setLoadingProduto] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const scanLockRef = useRef(false);
  const lastScanRef = useRef<{ code: string; time: number } | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const beepSuccess = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/beep-success.mp3')
    );
    await sound.playAsync();
  };

  const beepError = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/beep-error.mp3')
    );
    await sound.playAsync();
  };

  const vibrateSuccess = () => Vibration.vibrate(80);
  const vibrateError = () => Vibration.vibrate([0, 150, 80, 150]);

  const lockScanner = (ms = 300) => {
    scanLockRef.current = true;
    setTimeout(() => (scanLockRef.current = false), ms);
  };

  const processCodigo = async (data: string) => {
    if (!scannerAtivo || scanLockRef.current || submitting) {
      console.log('[Processar] ignorado', { data, scannerAtivo, lock: scanLockRef.current, submitting });
      return;
    }

    const now = Date.now();

    if (
      lastScanRef.current &&
      lastScanRef.current.code === data &&
      now - lastScanRef.current.time < 1200
    ) {
      console.log('[Processar] ignorado: duplicado recente', { data, deltaMs: now - lastScanRef.current.time });
      return;
    }

    lastScanRef.current = { code: data, time: now };
    lockScanner(300);
    setCodigoBarra(data);

    try {
      setLoadingProduto(true);

      console.log('[API] GET produto por EAN', { ean: data });
      const { data: produto } = await api.get(
        `/produtos/ean/${data}/6708126609a4df5d6c5a8df2`
      );
      console.log('[API] retorno API produto: ', JSON.stringify(produto));

      await beepSuccess();
      vibrateSuccess();

      setItens((prev) => {
        const existente = prev[produto._id];
        console.log('[Itens] atualizar quantidade', { id: produto._id, quantidadeNova: existente ? existente.quantidade + 1 : 1 });
        return {
          ...prev,
          [produto._id]: {
            produto,
            quantidade: existente ? existente.quantidade + 1 : 1,
          },
        };
      });
    } catch (error) {
      console.error('[API] erro produto', { ean: data, error });
      await beepError();
      vibrateError();

      toast.show({
        title: 'Produto não encontrado',
        description: 'Este código não está cadastrado',
        placement: 'top',
        bgColor: 'red.600',
      });
    } finally {
      setLoadingProduto(false);
      setCodigoBarra('');
      setTimeout(() => inputRef.current?.focus(), 100);
      console.log('[Processar] concluído', { ean: data });
    }
  };
 
  const handleSubmitCodigo = async (text?: string) => {
    const value = (text ?? codigoBarra).trim();
    console.log('[Leitura] código recebido', { value });
    if (!value) return;
    await processCodigo(value);
  };

  const handleSubmit = async () => {
    const itensArray = Object.values(itens);
    console.log('[Envio] iniciando', { quantidadeItens: itensArray.length });
    if (!itensArray.length) {
      toast.show({ description: 'Nenhum produto lido', placement: 'top' });
      return;
    }

    setSubmitting(true);

    try {
      for (const item of itensArray) {
        for (let i = 0; i < item.quantidade; i++) {
          console.log('[API] POST item', { pallet: pallet?._id, produto: item.produto._id, ean: item.produto.ean13, indice: i + 1 });
          await api.post(`/pallets/${pallet._id}/itens`, {
            codigo_barra: item.produto.ean13,
            produto: item.produto._id,
          });
          console.log('[API] OK POST item', { produto: item.produto._id, indice: i + 1 });
        }
      }

      toast.show({
        description: 'Leitura finalizada com sucesso',
        placement: 'top',
      });
      console.log('[Envio] finalizado com sucesso');

      router.back();
    } finally {
      setSubmitting(false);
      console.log('[Envio] submitting finalizado');
    }
  };

  return (
    <Box flex={1} bg="gray.50">
      <Box bg="white" shadow={1} px={4} py={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md" fontWeight="semibold" color="gray.700">Leitura de itens</Text>
          <Button variant="outline" colorScheme="gray" size="sm" onPress={() => router.back()} leftIcon={<Icon as={Ionicons} name="arrow-back" size="sm" />}>Voltar</Button>
        </HStack>
      </Box>
      <VStack space={4} p={4}>
        {/* Botão iniciar */}
        {!scannerAtivo && (
          <Button
            colorScheme="blue"
            onPress={async () => {
              setScannerAtivo(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            leftIcon={<Icon as={Ionicons} name="barcode-outline" />}
          >
            Iniciar leitura
          </Button>
        )}

        {/* Campo código */}
        {scannerAtivo && (
          <TextInput
            ref={inputRef}
            value={codigoBarra}
            editable
            placeholder="Acione o scanner"
            style={styles.barcodeInput}
            onChangeText={(t) => setCodigoBarra(t)}
            onSubmitEditing={({ nativeEvent }) =>
              handleSubmitCodigo(nativeEvent.text)
            }
          />
        )}

        {/*
        {scannerAtivo && (
          <Box height={260} borderRadius={8} overflow="hidden">
            <CameraView
              style={{ flex: 1 }}
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
          </Box>
        )} */}

        {loadingProduto && (
          <HStack space={2} alignItems="center">
            <Spinner size="sm" />
            <Text>Processando leitura...</Text>
          </HStack>
        )}

        {/* Lista */}
        {Object.values(itens).map(({ produto, quantidade }) => (
          <Box key={produto._id} bg="white" p={3} borderRadius={6} shadow={1}>
            <Text fontWeight="bold">{produto.descricao}</Text>
            <Text>EAN: {produto.ean13}</Text>
            <Text color="blue.600">Quantidade: {quantidade}</Text>
          </Box>
        ))}

        {scannerAtivo && (
          <Button
            colorScheme="green"
            onPress={handleSubmit}
            isLoading={submitting}
            leftIcon={<Icon as={Ionicons} name="checkmark-circle" />}
          >
            Finalizar leitura
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default AddPalletScreen;

const styles = StyleSheet.create({
  barcodeInput: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
});
