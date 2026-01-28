import React, { useEffect, useMemo } from 'react';
import { StyleSheet, TextInput, View, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  ScrollView,
  Progress,
  Center,
  Button,
  Divider,
  TextArea,
  useToast,
  Modal,
} from 'native-base';
import { Ionicons, Feather } from '@expo/vector-icons';
import api from '../../../src/config/api.config';
import SignatureScreen from 'react-native-signature-canvas';
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';
const screenWidth = Dimensions.get('window').width;

const NotaFiscalItem = ({ item, nf }: { item: any; nf: any }) => {
  const toast = useToast();
  const [isDivergenceOpen, setIsDivergenceOpen] = React.useState(false);
  const [divergenceText, setDivergenceText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  console.log("item ", item);
  const isChecked = item.conferencia

  const handleSaveDivergence = async () => {
    if (!divergenceText.trim()) {
      toast.show({
        description: 'Por favor, descreva a divergência.',
        placement: 'top',
        colorScheme: 'warning'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await api.put(`/romaneios/item-documento/observacao/${item._id}`, {
        observacao: divergenceText
      });
      
      item.observacao = divergenceText;
      setDivergenceText(divergenceText)
      toast.show({
        description: 'Divergência registrada com sucesso!',
        placement: 'top',
        colorScheme: 'success'
      });
      setIsDivergenceOpen(false);
      
    } catch (error: any) {
      console.error('Erro ao registrar divergência:', error);
      toast.show({
        description: error?.response?.data?.message || 'Erro ao registrar divergência',
        placement: 'top',
        colorScheme: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      bg="white" 
      p={4} 
      rounded="xl" 
      shadow={1}
      borderLeftWidth={4}
      borderLeftColor={
        item.observacao ? "red.500" :
        (isChecked ? "green.500" : "gray.300")
      }
    >
      <HStack space={3} alignItems="flex-start">
        {/* Icon Box */}
        <Center 
          w={10} 
          h={10} 
          bg="gray.100" 
          rounded="lg"
        >
          <Icon as={Feather} name="box" size="sm" color="gray.600" />
        </Center>

        <VStack flex={1} space={1}>
          <Text fontWeight="bold" fontSize="sm" color="gray.800" numberOfLines={2}>
            {item.descricao}
          </Text>
          <Text fontSize="xs" color="gray.500">
            Código: {item.produto}
          </Text>
          
          <HStack justifyContent="space-between" alignItems="center" mt={2}>
             <HStack space={2} alignItems="center">
                <Box 
                  w={5} 
                  h={5} 
                  borderWidth={2} 
                  borderColor={isChecked ? "green.500" : "gray.300"}
                  rounded="full"
                  alignItems="center"
                  justifyContent="center"
                  bg={isChecked ? "green.500" : "transparent"}
                >
                  {isChecked && (
                    <Icon as={Ionicons} name="checkmark" size="xs" color="white" />
                  )}
                </Box>
                <Text fontSize="sm" color={isChecked ? "green.600" : "gray.400"}>
                  {isChecked ? "Item conferido" : "Pendente"}
                </Text>
             </HStack>

             <Text fontSize="sm" fontWeight="bold" color="gray.700">
               {item.quantidade || 0} unidades
             </Text>
          </HStack>
        </VStack>
      </HStack>
      
      {/* {isChecked && ( */}
        <VStack mt={3} pt={3} 
          borderTopWidth={ nf?.statusEntrega?._id != '6963137d8ca67663704b235b' ? 1 : 0} 
          borderTopColor="gray.100"
        >
            {!isDivergenceOpen ? (
                <>
                  {item.observacao && (
                    <Text fontSize="xs" color="red.500" mt={2}>
                      {item.observacao}
                    </Text>
                  )}
                  { nf?.statusEntrega?._id != '6963137d8ca67663704b235b' && 
                      <Button 
                        variant="ghost" 
                        p={0}
                        height="auto"
                        justifyContent="flex-start"
                        _text={{ color: 'green.500', fontSize: '12', fontWeight: 'medium' }}
                        onPress={() => {
                          setDivergenceText(item.observacao || '')
                          setIsDivergenceOpen(true)
                        }}
                        startIcon={<Icon as={Feather} name="alert-triangle" size="3" color="green.500" />}
                    >
                        {item.observacao ? "Editar divergência" : "Registrar divergência"}
                    </Button>
                  }
                  
                </>
            ) : (
                <VStack space={2}>
                    <HStack space={2} alignItems="center">
                        <Icon as={Ionicons} name="alert-circle-outline" size="sm" color="red.500" />
                        <Text fontSize="xs" color="gray.700">
                            Observação / Divergência
                        </Text>
                    </HStack>
                    
                    <TextInput
                      value={divergenceText}
                      onChangeText={setDivergenceText}
                      placeholder="Descreva a divergência encontrada..."
                      multiline
                      numberOfLines={3}
                      style={styles.textArea}
                    />
                    
                    <HStack space={1} alignItems="center">
                        <Icon as={Ionicons} name="warning" size="xs" color="orange.500" />
                        <Text fontSize="xs" color="red.500">
                             Preencha a observação para registrar a divergência
                        </Text>
                    </HStack>

                    <View style={{ flexDirection: 'row', width: '100%', gap: 5 }}>
                      <Button 
                          size="sm" 
                          colorScheme="primary" 
                          onPress={handleSaveDivergence}
                          isLoading={isSubmitting}
                          isLoadingText="Salvando..."
                          mt={2}
                          width={"49%"}
                      >
                          Confirmar
                      </Button>
                      <Button 
                          size="sm" 
                          colorScheme="red" 
                          onPress={() => {
                            setDivergenceText('')
                            setIsDivergenceOpen(false)
                          }}
                          mt={2}
                          width={"49%"}
                      >
                          Cancelar
                      </Button>
                    </View>
                </VStack>
            )}
        </VStack>
      {/* )} */}
    </Box>
  );
};

const NotaFiscalDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const toast = useToast();
  
  const [nomeRecebedor, setNomeRecebedor] = React.useState('');
  const [documentoRecebedor, setDocumentoRecebedor] = React.useState('');
  const [assinatura, setAssinatura] = React.useState<string | null>(null);
  const [recusado, setRecusado] = React.useState(false);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const [submittingAceite, setSubmittingAceite] = React.useState(false);
  const [maxWidth, setMaxWidth] = React.useState(1);
  const [assinaturaExistente, setAssinaturaExistente] = React.useState(false);
  const [linkAssinatura, setLinkAssinatura] = React.useState("");
  const [showRejectionModal, setShowRejectionModal] = React.useState(false);
  const [submittingRejection, setSubmittingRejection] = React.useState(false);
  const [justificativaRecusa, setJustificativaRecusa] = React.useState('');
  const signatureRef = React.useRef<any>(null);
  
  const nf = useMemo(() => {
    if (params.nfData && typeof params.nfData === 'string') {
      try {

        if (JSON.parse(params.nfData)?.assinatura) {
          setAssinaturaExistente(true)
          setLinkAssinatura(`${process.env.EXPO_PUBLIC_API_BASE_URL_HOST}/romaneios/assinaturas/${JSON.parse(params.nfData)?.assinatura}`)
        }

        // console.log("JSON.parse(params.nfData) ", JSON.parse(params.nfData))
        setRecusado(JSON.parse(params.nfData)?.statusEntrega?._id === '6963137d8ca67663704b235b')

        return JSON.parse(params.nfData);
      } catch (e) {
        console.error("Error parsing nfData", e);
        return null;
      }
    }
    return null;
  }, [params.nfData]);

  useEffect(() => {
    setTimeout(() => {
      setMaxWidth(2)
    }, 1000)
  }, [])

  if (!nf) {
    return (
      <Center flex={1} bg="gray.50">
        <Text color="gray.500">Dados da Nota Fiscal não encontrados.</Text>
        <Button mt={4} onPress={() => router.back()}>Voltar</Button>
      </Center>
    );
  }

  const items = nf.itensDocumento || [];
  const totalItems = items.length;
  const checkedItems = items.filter((item: any) => item.conferencia).length;
  const progressValue = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  const clientName = nf?.saida?.destinatario?.razao || nf?.saida?.destinatario?.nome || nf?.cliente?.razao_social || 'Cliente Desconhecido';
  // console.log("saida ", nf.saida)
  // const handleSignatureOK = (signature: string) => {
  //   setAssinatura(signature);
  //   setScrollEnabled(true);
  //   toast.show({
  //     description: 'Assinatura capturada!',
  //     placement: 'top',
  //     colorScheme: 'success',
  //   });
  // };
  
  const handleSignatureEmpty = () => {
    setAssinatura(null);
    setScrollEnabled(true);
  };
  
  // const handleClearSignature = () => {
  //   signatureRef.current?.clearSignature();
  //   setAssinatura(null);
  // };
  
  // const handleConfirmSignature = () => {
  //   signatureRef.current?.readSignature();
  // };
  
  const handleAceiteEntrega = async () => {
    const saidaId = typeof nf?.saida === 'object' ? nf.saida?._id : nf?.saida;
    if (!saidaId) {
      toast.show({ description: 'Saída inválida', placement: 'top' });
      return;
    }
    if (!nomeRecebedor.trim()) {
      toast.show({ description: 'Informe o nome do recebedor', placement: 'top' });
      return;
    }
    if (!documentoRecebedor.trim()) {
      toast.show({ description: 'Informe o CPF do recebedor', placement: 'top' });
      return;
    }
    if (!assinatura) {
      toast.show({ description: 'Assinatura obrigatória', placement: 'top' });
      return;
    }
    
    try {
      setSubmittingAceite(true);

      const base64Data = assinatura.replace(/^data:image\/\w+;base64,/, '');
      const filename = `assinatura_${Date.now()}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Arquivo:', fileUri);

      const formData = new FormData();
      formData.append('saidasIds[]', saidaId);
      formData.append('nome_recebimento', nomeRecebedor);
      formData.append('documento_recebimento', documentoRecebedor);

      formData.append('assinatura', {
        uri: fileUri,
        type: 'image/png',
        name: filename,
      } as any);

      console.log('Enviando FormData...', formData);

      await api.post(`/romaneios/${params.romaneioId}/aceitar-entrega`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      
      toast.show({
        description: 'Entrega aceita com sucesso!',
        placement: 'top',
        colorScheme: 'success',
      });
      router.back();
    } catch (error: any) {
      toast.show({
        description: error?.response?.data?.message || 'Erro ao confirmar aceite',
        placement: 'top',
        colorScheme: 'error',
      });
    } finally {
      setSubmittingAceite(false);
    }
  };

  const handleRecusarEntrega = async () => {
    if (!justificativaRecusa.trim() || justificativaRecusa.trim().length < 10) {
      toast.show({
        description: 'Por favor, informe uma justificativa com pelo menos 10 caracteres.',
        placement: 'top',
        colorScheme: 'warning'
      });
      return;
    }

    try {
      const saidaId = typeof nf?.saida === 'object' ? nf.saida?._id : nf?.saida;
      setSubmittingRejection(true);
      
      await api.post(`/romaneios/${params.romaneioId}/recusar-entrega`, {
        saidasIds: [saidaId],
        justificativa: justificativaRecusa.trim()
      });
      
      toast.show({
        description: 'Entrega recusada com sucesso!',
        placement: 'top',
        colorScheme: 'success',
      });
      
      setShowRejectionModal(false);
      setJustificativaRecusa('');
      router.back();
    } catch (error: any) {
      toast.show({
        description: error?.response?.data?.message || 'Erro ao recusar entrega',
        placement: 'top',
        colorScheme: 'error',
      });
    } finally {
      setSubmittingRejection(false);
    }
  };

  const handleSignatureOK = (signature: string) => {
    console.log('Assinatura OK:', signature?.substring(0, 50)); // Log parcial
    setAssinatura(signature);
    setScrollEnabled(true);
    toast.show({
      description: 'Assinatura capturada!',
      placement: 'top',
      colorScheme: 'success',
    });
  };

  const handleClearSignature = () => {
    console.log('Limpando assinatura');
    signatureRef.current?.clearSignature();
    setAssinatura(null);
  };

  const handleConfirmSignature = () => {
    console.log('Confirmando assinatura');
    signatureRef.current?.readSignature();
  };

  return (
    <Box flex={1} bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow={1} px={4} py={3} safeAreaTop>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" space={2} flex={1}>
            <Button 
              variant="ghost" 
              p={1} 
              onPress={() => router.back()} 
              _pressed={{ bg: 'gray.100' }}
            >
              <Icon as={Ionicons} name="arrow-back" size="md" color="gray.700" />
            </Button>
            <VStack flex={1}>
               <Text fontSize="lg" fontWeight="bold" color="gray.800" numberOfLines={1}>
                 NF-{nf?.saida?.numero}
               </Text>
               <Text fontSize="sm" color="gray.500" numberOfLines={1}>
                 {clientName}
               </Text>
            </VStack>
          </HStack>
          
          <Box 
            bg={ nf?.statusEntrega?.color || 'gray.500' } 
            px={3} 
            py={1} 
            rounded="full"
          >
            <Text color={ "#000" } fontSize="xs" fontWeight="bold">
              {nf?.statusEntrega?.nome || ''}
            </Text>
          </Box>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} scrollEnabled={scrollEnabled}>
        <VStack space={4} p={4}>
          
          <Box bg="white" rounded="xl" shadow={1} p={4}>
            <HStack alignItems="center" space={2} mb={2}>
              <Icon as={Ionicons} name="business-outline" size="sm" color="blue.600" />
              <Text fontSize="md" fontWeight="bold" color="gray.700">
                Setor
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {nf?.saida?.local_entrega || 'Não informado'}
            </Text>
          </Box>
          
          {/* Progresso da Conferência */}
          <Box bg="white" rounded="xl" shadow={1} p={4}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <Text fontSize="sm" color="gray.700">
                    Progresso da Conferência
                </Text>
                <Text fontWeight="bold" color="blue.600">
                    {checkedItems} / {totalItems}
                </Text>
            </View>
            <VStack space={2}>
              <Progress 
                value={progressValue} 
                colorScheme="blue" 
                bg="gray.100" 
                size="md"
                rounded="full"
              />
            </VStack>
          </Box>
        
          {/* Mostrar se a nota estiver recusada */}
          { recusado && (
            <Box bg="red.100" rounded="xl" shadow={0} p={4} borderColor="red.300" borderWidth={1}>
              <Text fontSize="md" fontWeight="bold" color="red.900" mb={4}>
                Justificativa da recusa
              </Text>
              <Text fontSize="sm" color="red.900" mb={2}>
                { items[0]?.justificativaRecusa || '' }
              </Text>
            </Box>
          )}

          <VStack space={3}>
            <Text fontSize="md" fontWeight="bold" color="gray.700">
              Itens para conferência
            </Text>

            {items.map((item: any, index: number) => (
              <NotaFiscalItem key={item._id || index} item={item} nf={nf} />
            ))}
            
            {items.length === 0 && (
               <Center p={8} bg="white" rounded="xl">
                 <Text color="gray.400">Nenhum item nesta nota fiscal.</Text>
               </Center>
            )}

          </VStack>

          {/* Mostrar se a nota estiver assinada */}
          {assinaturaExistente && (
            <>
              <View style={{ marginTop: 12 }}>
                <Text fontSize="sm" color="gray.500" mb={2}>
                  Assinatura registrada
                </Text>

                <Image
                  source={{ uri: linkAssinatura }}
                  style={{
                    width: '100%',
                    height: 200,
                    resizeMode: 'contain',
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    backgroundColor: '#fff',
                  }}
                />
              </View>
              <View style={{ marginTop: 12 }}>
                <Text fontSize="md" color="gray.500" fontWeight="bold" mb={2}>
                  Nome do recebedor: <Text fontSize="md" color="gray.500" fontWeight="400">{nf?.nome_recebimento || ''}</Text>
                </Text>
                <Text fontSize="md" color="gray.500" fontWeight="bold" mb={2}>
                  Documento do recebedor: <Text fontSize="md" color="gray.500" fontWeight="400">{nf?.documento_recebimento || ''}</Text>
                </Text>
              </View>
            </>
          )}

          {/* Mostrar se a nota estiver pendente */}
          { !assinaturaExistente && !recusado && items.length > 0 && (
            <Box bg="white" rounded="xl" shadow={1} p={4}>
              <Text fontSize="md" fontWeight="bold" color="gray.700" mb={4}>
                Confirmar aceite
              </Text>
              <VStack space={4}>
                <VStack space={2}>
                  <Text fontSize="sm" color="gray.500">Nome do recebedor</Text>
                  <TextInput
                    placeholder="Digite o nome"
                    value={nomeRecebedor}
                    onChangeText={setNomeRecebedor}
                    style={ styles.inputs }
                  />
                </VStack>
                <VStack space={2}>
                  <Text fontSize="sm" color="gray.500">CPF do Recebedor</Text>
                  <TextInput
                    placeholder="Digite o CPF"
                    value={documentoRecebedor}
                    onChangeText={setDocumentoRecebedor}
                    keyboardType="numeric"
                    style={ styles.inputs }
                  />
                </VStack>
                <VStack space={2}>
                  <Text fontSize="sm" color="gray.500">Assinatura</Text>
                  <View 
                    style={{
                      height: 250,
                      width: "100%", // 64 = padding lateral (16 + 16)
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      borderRadius: 8,
                      backgroundColor: '#fff',
                      // overflow: 'hidden',
                    }}
                  >
                    <SignatureScreen
                      ref={signatureRef}
                      onOK={handleSignatureOK}
                      onEmpty={handleSignatureEmpty}
                      onBegin={() => {
                        console.log('Começou a assinar');
                        setScrollEnabled(false);
                      }}
                      onEnd={() => {
                        console.log('Terminou de assinar');
                        setScrollEnabled(true);
                      }}
                      onClear={() => {
                        console.log('Assinatura limpa');
                        setAssinatura(null);
                      }}
                      descriptionText="Assine aqui"
                      clearText="Limpar"
                      confirmText="Salvar"
                      webStyle={`
                        * {
                          margin: 0;
                          padding: 0;
                          box-sizing: border-box;
                        }
                        body, html {
                          width: 100%;
                          height: 100%;
                          overflow: hidden;
                        }
                        .m-signature-pad {
                          position: absolute;
                          top: 0;
                          left: 0;
                          right: 0;
                          bottom: 0;
                          width: 100%;
                          height: 100%;
                          margin: 0;
                          padding: 0;
                          border: none;
                          box-shadow: none;
                        }
                        .m-signature-pad--body {
                          position: absolute;
                          top: 0;
                          left: 0;
                          right: 0;
                          bottom: 0;
                          border: none;
                          margin: 0;
                          padding: 0;
                        }
                        .m-signature-pad--footer {
                          display: none;
                        }
                        canvas {
                          position: absolute;
                          top: 0;
                          left: 0;
                          width: 100% !important;
                          height: 100% !important;
                          touch-action: none;
                        }
                      `}
                      androidHardwareAccelerationDisabled={false}
                      // minWidth={0.5}
                      // minHeight={0.5}
                      maxWidth={maxWidth}
                      penColor="black"
                      backgroundColor="white"
                      style={{ minHeight: 0.5 }}
                    />
                  </View>
                  <HStack space={3} mt={2}>
                    <Button
                      flex={1}
                      variant="outline"
                      colorScheme="gray"
                      onPress={handleClearSignature}
                      size="sm"
                    >
                      Limpar
                    </Button>
                    <Button
                      flex={1}
                      colorScheme="blue"
                      onPress={handleConfirmSignature}
                      size="sm"
                    >
                      Confirmar Assinatura
                    </Button>
                  </HStack>
                  {assinatura && (
                    <HStack space={2} alignItems="center" justifyContent="center" mt={2}>
                      <Icon as={Ionicons} name="checkmark-circle" size="sm" color="green.500" />
                      <Text fontSize="xs" color="green.600">
                        Assinatura capturada com sucesso!
                      </Text>
                    </HStack>
                  )}
                </VStack>
                <Divider my={2} />
                <HStack space={3}>
                  <Button
                    flex={1}
                    variant="ghost"
                    colorScheme="red"
                    onPress={() => setShowRejectionModal(true)}
                  >
                    Recusar entrega
                  </Button>
                  <Button
                    flex={1}
                    colorScheme="blue"
                    onPress={handleAceiteEntrega}
                    isLoading={submittingAceite}
                    isLoadingText="Enviando..."
                    isDisabled={!nomeRecebedor.trim() || !documentoRecebedor.trim() || !assinatura}
                    opacity={!nomeRecebedor.trim() || !documentoRecebedor.trim() || !assinatura ? 0.5 : 1}
                  >
                    Confirmar Aceite
                  </Button>
                </HStack>
              </VStack>
            </Box>
          )}
 
        </VStack>
      </ScrollView>

      {/* Modal de confirmação de recusa */}
      <Modal isOpen={showRejectionModal} onClose={() => {
        setShowRejectionModal(false);
        setJustificativaRecusa('');
      }}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            <HStack alignItems="center" space={2}>
              <Icon as={Ionicons} name="alert-circle" size="md" color="red.500" />
              <Text fontWeight="bold">Confirmar Recusa</Text>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <Text>
                Deseja realmente recusar a entrega? Esta ação não pode ser desfeita.
              </Text>
              <VStack space={2}>
                <Text fontSize="sm" fontWeight="medium">Justificativa da recusa *</Text>
                <TextInput
                  value={justificativaRecusa}
                  onChangeText={setJustificativaRecusa}
                  placeholder="Descreva o motivo da recusa (mínimo 10 caracteres)"
                  multiline
                  numberOfLines={4}
                  style={styles.inputTextarea}
                />
                <Text fontSize="xs" color="gray.500">
                  {justificativaRecusa.length}/10 caracteres
                </Text>
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="gray"
                onPress={() => {
                  setShowRejectionModal(false);
                  setJustificativaRecusa('');
                }}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onPress={handleRecusarEntrega}
                isLoading={submittingRejection}
                isDisabled={!justificativaRecusa.trim() || justificativaRecusa.trim().length < 10}
              >
                Recusar Entrega
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default NotaFiscalDetailsScreen;

const styles = StyleSheet.create({
  textArea: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputs: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d1d5db',
    fontSize: 14,
    padding: 12,
    paddingVertical: 2,
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
