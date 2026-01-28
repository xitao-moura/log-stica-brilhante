import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Pressable,
  Icon,
  Divider,
  ScrollView,
  Modal,
  useToast,
  Center,
  Spinner,
  Progress,
  Input,
  IconButton,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../src/config/api.config';

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
  conferido?: boolean;
}

interface Pedido {
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

const PedidoDetailScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const toast = useToast();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  const [conferenceMode, setConferenceMode] = useState<'manual' | 'scanner'>(
    'manual'
  );
  const [showScanner, setShowScanner] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const fetchPedido = async (pedidoId: string) => {
    try {
      console.log('🔍 [FETCH_PEDIDO] Iniciando busca do pedido:', pedidoId);
      setError(null);
      setLoading(true);

      const response = await api.get<Pedido>(`/conferencias/${pedidoId}`);
      console.log('📥 [FETCH_PEDIDO] Resposta da API recebida:', {
        pedidoId: response.data._id,
        totalItens: response.data.Itens.length,
        itensComQuantidade: response.data.Itens.map((item) => ({
          id: item._id,
          partnumber: item.Produto.Partnumber,
          quantidade: item.Quantidade,
          quantidadeConferida: item.QuantidadeConferida,
          conferido: item.QuantidadeConferida >= item.Quantidade,
        })),
      });

      // Adicionar propriedade conferido aos itens
      const pedidoWithConferido = {
        ...response.data,
        Itens: response.data.Itens.map((item) => ({
          ...item,
          conferido: item.QuantidadeConferida >= item.Quantidade,
        })),
      };

      console.log('✅ [FETCH_PEDIDO] Pedido processado com sucesso:', {
        itensConferidos: pedidoWithConferido.Itens.filter(
          (item) => item.conferido
        ).length,
        totalItens: pedidoWithConferido.Itens.length,
        statusDetalhado: pedidoWithConferido.Itens.map((item) => ({
          id: item._id,
          partnumber: item.Produto.Partnumber,
          conferido: item.conferido,
          quantidadeConferida: item.QuantidadeConferida,
          quantidade: item.Quantidade,
        })),
      });

      setPedido(pedidoWithConferido);
    } catch (err: any) {
      console.error('❌ [FETCH_PEDIDO] Erro ao buscar pedido:', err);

      let errorMessage = 'Erro desconhecido ao carregar pedido';

      if (err.response) {
        console.error('❌ [FETCH_PEDIDO] Erro da resposta:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });
        errorMessage = `Erro ${err.response.status}: ${
          err.response.data?.message || err.response.statusText
        }`;
      } else if (err.request) {
        console.error('❌ [FETCH_PEDIDO] Erro de conexão:', err.request);
        errorMessage =
          'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (err.message) {
        console.error('❌ [FETCH_PEDIDO] Erro geral:', err.message);
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.show({
        description: errorMessage,
        variant: 'error',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePedidoStatus = async (novoStatus: string) => {
    try {
      console.log('🔄 [UPDATE_STATUS] Iniciando atualização de status:', {
        pedidoId: id,
        statusAtual: pedido?.status,
        novoStatus: novoStatus,
        timestamp: new Date().toISOString(),
      });

      setUpdating(true);

      // Buscar o pedido atual
      const pedidoAtual = await api.get<Pedido>(`/conferencias/${id}`);

      // Criar o payload com o status atualizado
      const updatePayload = {
        ...pedidoAtual.data,
        status: novoStatus,
        // Remover campos que não devem ser atualizados
        _id: undefined,
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        // Remover _id dos itens
        Itens: pedidoAtual.data.Itens.map((item) => ({
          ...item,
          _id: undefined,
        })),
      };

      console.log('📤 [UPDATE_STATUS] Enviando payload para API:', {
        pedidoId: id,
        novoStatus: novoStatus,
        totalItens: updatePayload.Itens.length,
      });

      const response = await api.put(`/conferencias/${id}`, updatePayload);

      console.log('✅ [UPDATE_STATUS] Status atualizado com sucesso:', {
        pedidoId: id,
        novoStatus: novoStatus,
        response: response.data,
        timestamp: new Date().toISOString(),
      });

      // Atualizar o estado local
      if (pedido) {
        setPedido({
          ...pedido,
          status: novoStatus,
        });
      }

      return true;
    } catch (err: any) {
      console.error('❌ [UPDATE_STATUS] Erro ao atualizar status:', {
        error: err,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        pedidoId: id,
        novoStatus: novoStatus,
        timestamp: new Date().toISOString(),
      });

      toast.show({
        description: 'Erro ao atualizar status do pedido',
        variant: 'error',
        duration: 3000,
      });

      return false;
    } finally {
      setUpdating(false);
    }
  };

  const updateQuantidadeConferida = async (
    item: Item,
    novaQuantidade: number
  ) => {
    try {
      console.log('🔄 [UPDATE_QUANTIDADE] Iniciando atualização:', {
        itemId: item._id,
        partnumber: item.Produto.Partnumber,
        quantidadeAtual: item.QuantidadeConferida,
        novaQuantidade: novaQuantidade,
        quantidadeTotal: item.Quantidade,
        timestamp: new Date().toISOString(),
      });

      setUpdating(true);

      const pedidoAtual = await api.get<Pedido>(`/conferencias/${id}`);

      // Encontre o item específico e atualize apenas a QuantidadeConferida
      const itensAtualizados = pedidoAtual.data.Itens.map((itemAtual) => {
        if (itemAtual._id === item._id) {
          return {
            ...itemAtual,
            QuantidadeConferida: novaQuantidade,
            // Remova o _id do item para evitar o erro ImmutableField
            _id: undefined,
          };
        }
        return {
          ...itemAtual,
          _id: undefined, // Remove _id de todos os itens
        };
      });

      const updatePayload = {
        ...pedidoAtual.data,
        Itens: itensAtualizados,
        // Remova campos que não devem ser atualizados
        _id: undefined,
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      console.log('📤 [UPDATE_QUANTIDADE] Enviando payload para API:', {
        pedidoId: id,
        totalItens: updatePayload.Itens.length,
        itemAtualizado: updatePayload.Itens.find(
          (i) => i.Produto.Partnumber === item.Produto.Partnumber
        ),
      });

      // Enviar o payload completo para a API
      const response = await api.put(`/conferencias/${id}`, updatePayload);

      console.log('✅ [UPDATE_QUANTIDADE] Resposta da API:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        timestamp: new Date().toISOString(),
      });

      console.log('🎯 [UPDATE_QUANTIDADE] Atualização concluída com sucesso');
      return true;
    } catch (err: any) {
      console.error('❌ [UPDATE_QUANTIDADE] Erro ao atualizar quantidade:', {
        error: err,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        itemId: item._id,
        partnumber: item.Produto.Partnumber,
        timestamp: new Date().toISOString(),
      });

      toast.show({
        description: 'Erro ao atualizar quantidade conferida',
        variant: 'error',
        duration: 3000,
      });

      return false;
    } finally {
      setUpdating(false);
    }
  };

  const incrementarQuantidadeConferida = async (itemIndex: number) => {
    if (!pedido) {
      console.warn('⚠️ [INCREMENT_QUANTIDADE] Pedido não encontrado');
      return;
    }

    const item = pedido.Itens[itemIndex];

    console.log('🔢 [INCREMENT_QUANTIDADE] Iniciando incremento:', {
      itemIndex,
      itemId: item._id,
      partnumber: item.Produto.Partnumber,
      quantidadeAtual: item.QuantidadeConferida,
      quantidadeTotal: item.Quantidade,
      jaConferido: item.QuantidadeConferida >= item.Quantidade,
    });

    // Verificar se já foi totalmente conferido
    if (item.QuantidadeConferida >= item.Quantidade) {
      console.log('⚠️ [INCREMENT_QUANTIDADE] Item já totalmente conferido');
      toast.show({
        description: 'Este item já foi totalmente conferido!',
        variant: 'warning',
        duration: 2000,
      });
      return;
    }

    const novaQuantidade = item.QuantidadeConferida + 1;
    console.log(
      '➕ [INCREMENT_QUANTIDADE] Nova quantidade calculada:',
      novaQuantidade
    );

    // Atualizar na API - enviando o objeto item completo
    const success = await updateQuantidadeConferida(item, novaQuantidade);

    if (success) {
      console.log('🔄 [INCREMENT_QUANTIDADE] Atualizando estado local:', {
        itemIndex,
        novaQuantidade,
        seraConferido: novaQuantidade >= item.Quantidade,
      });

      // Atualizar estado local
      const updatedPedido = { ...pedido };
      updatedPedido.Itens[itemIndex].QuantidadeConferida = novaQuantidade;
      updatedPedido.Itens[itemIndex].conferido =
        novaQuantidade >= item.Quantidade;

      setPedido(updatedPedido);

      // NOVA LÓGICA DE STATUS:
      // Verificar se é o primeiro item sendo conferido e o pedido está pendente
      if (pedido.status === '686c981152867751a4681b1d' || !pedido.status) {
        // Se tem apenas 1 item e foi conferido completamente, vai para finalizado
        if (
          updatedPedido.Itens.length === 1 &&
          novaQuantidade >= item.Quantidade
        ) {
          await updatePedidoStatus('686c983c52867751a4681b1f'); // finalizado
        } else {
          // Se tem mais de 1 item ou não foi conferido completamente, vai para em andamento
          await updatePedidoStatus('686c982e52867751a4681b1e'); // em andamento
        }
      } else if (pedido.status === '686c982e52867751a4681b1e') {
        // Se já está em andamento, verificar se todos os itens foram conferidos
        const todosConferidos = updatedPedido.Itens.every(
          (item) => item.conferido
        );
        if (todosConferidos) {
          await updatePedidoStatus('686c983c52867751a4681b1f'); // finalizado
        }
      }

      if (novaQuantidade >= item.Quantidade) {
        console.log('🎉 [INCREMENT_QUANTIDADE] Item totalmente conferido!');
        toast.show({
          description: `Item ${item.Produto.Partnumber} totalmente conferido!`,
          variant: 'success',
          duration: 2000,
        });
      } else {
        console.log('📈 [INCREMENT_QUANTIDADE] Progresso atualizado');
        toast.show({
          description: `${novaQuantidade}/${item.Quantidade} conferido`,
          variant: 'info',
          duration: 1500,
        });
      }
    } else {
      console.error(
        '❌ [INCREMENT_QUANTIDADE] Falha na atualização - estado local não alterado'
      );
    }
  };

  const alterarQuantidadeManual = async (
    itemIndex: number,
    novaQuantidade: number
  ) => {
    if (!pedido) {
      console.warn('⚠️ [ALTERAR_QUANTIDADE] Pedido não encontrado');
      return;
    }

    const item = pedido.Itens[itemIndex];

    console.log('✏️ [ALTERAR_QUANTIDADE] Iniciando alteração manual:', {
      itemIndex,
      itemId: item._id,
      partnumber: item.Produto.Partnumber,
      quantidadeAtual: item.QuantidadeConferida,
      novaQuantidade: novaQuantidade,
      quantidadeTotal: item.Quantidade,
    });

    // Validar quantidade
    if (novaQuantidade < 0) {
      console.warn(
        '⚠️ [ALTERAR_QUANTIDADE] Quantidade negativa não permitida:',
        novaQuantidade
      );
      toast.show({
        description: 'Quantidade não pode ser negativa',
        variant: 'error',
        duration: 2000,
      });
      return;
    }

    if (novaQuantidade > item.Quantidade) {
      console.warn('⚠️ [ALTERAR_QUANTIDADE] Quantidade maior que o total:', {
        novaQuantidade,
        quantidadeTotal: item.Quantidade,
      });
      toast.show({
        description:
          'Quantidade conferida não pode ser maior que a quantidade do item',
        variant: 'error',
        duration: 2000,
      });
      return;
    }

    const success = await updateQuantidadeConferida(item, novaQuantidade);

    if (success) {
      console.log('🔄 [ALTERAR_QUANTIDADE] Atualizando estado local:', {
        itemIndex,
        novaQuantidade,
        seraConferido: novaQuantidade >= item.Quantidade,
      });

      const updatedPedido = { ...pedido };
      updatedPedido.Itens[itemIndex].QuantidadeConferida = novaQuantidade;
      updatedPedido.Itens[itemIndex].conferido =
        novaQuantidade >= item.Quantidade;

      setPedido(updatedPedido);

      // NOVA LÓGICA DE STATUS:
      const itensComConferencia = updatedPedido.Itens.filter(
        (item) => item.QuantidadeConferida > 0
      );
      const todosConferidos = updatedPedido.Itens.every(
        (item) => item.conferido
      );

      if (itensComConferencia.length === 0) {
        // Nenhum item foi conferido - volta para pendente
        if (pedido.status !== '686c981152867751a4681b1d') {
          await updatePedidoStatus('686c981152867751a4681b1d'); // pendente
        }
      } else if (todosConferidos) {
        // Todos os itens foram conferidos - vai para finalizado
        if (pedido.status !== '686c983c52867751a4681b1f') {
          await updatePedidoStatus('686c983c52867751a4681b1f'); // finalizado
        }
      } else {
        // Alguns itens foram conferidos mas não todos - vai para em andamento
        if (pedido.status !== '686c982e52867751a4681b1e') {
          await updatePedidoStatus('686c982e52867751a4681b1e'); // em andamento
        }
      }

      console.log('✅ [ALTERAR_QUANTIDADE] Alteração concluída com sucesso');
      toast.show({
        description: `Quantidade atualizada: ${novaQuantidade}/${item.Quantidade}`,
        variant: 'success',
        duration: 2000,
      });
    } else {
      console.error(
        '❌ [ALTERAR_QUANTIDADE] Falha na atualização - estado local não alterado'
      );
    }
  };

  useEffect(() => {
    console.log('🔄 [USEEFFECT] Componente montado/atualizado:', {
      id: id,
      tipoId: typeof id,
      timestamp: new Date().toISOString(),
    });

    if (id && typeof id === 'string') {
      fetchPedido(id);
    } else {
      console.warn('⚠️ [USEEFFECT] ID inválido:', id);
    }
  }, [id]);

  // Log quando o pedido é atualizado
  useEffect(() => {
    if (pedido) {
      console.log('📊 [PEDIDO_UPDATED] Estado do pedido atualizado:', {
        pedidoId: pedido._id,
        totalItens: pedido.Itens.length,
        itensConferidos: pedido.Itens.filter((item) => item.conferido).length,
        itensDetalhados: pedido.Itens.map((item) => ({
          id: item._id,
          partnumber: item.Produto.Partnumber,
          quantidadeConferida: item.QuantidadeConferida,
          quantidade: item.Quantidade,
          conferido: item.conferido,
        })),
        timestamp: new Date().toISOString(),
      });
    }
  }, [pedido]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatCNPJ = (cnpj: string): string => {
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  };

  const extrairUltimos4Digitos = (numero: string): string => {
    return numero.replace(/^0+/, '').slice(-4);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!pedido || currentItemIndex === null) return;

    const item = pedido.Itens[currentItemIndex];

    console.log('📱 [BARCODE_SCAN] Código escaneado:', {
      codigoEscaneado: data,
      itemEsperado: item.Produto.Ean13,
      itemPartnumber: item.Produto.Partnumber,
      match: item.Produto.Ean13 === data,
      quantidadeAtual: item.QuantidadeConferida,
      quantidadeTotal: item.Quantidade,
    });

    // Verificar se o código escaneado corresponde ao item atual
    if (item.Produto.Ean13 === data) {
      console.log(
        '✅ [BARCODE_SCAN] Código corresponde - incrementando quantidade'
      );

      // Incrementar quantidade conferida
      incrementarQuantidadeConferida(currentItemIndex);

      // Verificar se ainda precisa de mais escaneamentos
      if (item.QuantidadeConferida + 1 < item.Quantidade) {
        toast.show({
          description: `Escaneado! Ainda faltam ${
            item.Quantidade - (item.QuantidadeConferida + 1)
          } escaneamentos`,
          variant: 'info',
          duration: 2000,
        });
        // Não fechar o scanner ainda, pois precisa de mais escaneamentos
      } else {
        // Item será totalmente conferido, fechar o scanner
        setShowScanner(false);
        setCurrentItemIndex(null);
        toast.show({
          description: `Item ${item.Produto.Partnumber} totalmente conferido!`,
          variant: 'success',
          duration: 3000,
        });
      }
    } else {
      console.warn(
        '⚠️ [BARCODE_SCAN] Código não corresponde ao item selecionado'
      );
      toast.show({
        description: 'Código não corresponde ao item selecionado!',
        variant: 'error',
        duration: 2000,
      });
    }
  };

  const handleScannerPress = async (itemIndex: number) => {
    console.log('📷 [SCANNER_PRESS] Iniciando scanner para item:', {
      itemIndex,
      itemId: pedido?.Itens[itemIndex]._id,
      partnumber: pedido?.Itens[itemIndex].Produto.Partnumber,
    });

    if (!permission) {
      console.warn('⚠️ [SCANNER_PRESS] Permissão não inicializada');
      return;
    }

    if (!permission.granted) {
      console.log('🔐 [SCANNER_PRESS] Solicitando permissão de câmera');
      const newPermission = await requestPermission();
      if (!newPermission.granted) {
        console.error('❌ [SCANNER_PRESS] Permissão de câmera negada');
        toast.show({
          description: 'Permissão de câmera é necessária para usar o scanner',
          variant: 'error',
          duration: 3000,
        });
        return;
      }
    }

    setCurrentItemIndex(itemIndex);
    setShowScanner(true);
  };

  const handleFinalizarConferencia = async () => {
    if (!pedido) return;

    const itensConferidos = pedido.Itens.filter(
      (item) => item.conferido
    ).length;
    const totalItens = pedido.Itens.length;

    console.log('🏁 [FINALIZAR_CONFERENCIA] Tentativa de finalização:', {
      itensConferidos,
      totalItens,
      podeFinalizalizar: itensConferidos === totalItens,
      statusAtual: pedido.status,
    });

    if (itensConferidos === totalItens) {
      // Todos os itens foram conferidos - confirmar finalização
      const statusUpdated = await updatePedidoStatus(
        '686c983c52867751a4681b1f'
      ); // finalizado
      if (!statusUpdated) {
        return; // Se não conseguiu atualizar o status, não finalizar
      }

      console.log(
        '✅ [FINALIZAR_CONFERENCIA] Conferência finalizada com sucesso'
      );
      toast.show({
        description: 'Conferência finalizada com sucesso!',
        variant: 'success',
        duration: 3000,
      });
      router.back();
    } else {
      console.log('⚠️ [FINALIZAR_CONFERENCIA] Ainda há itens pendentes');
      toast.show({
        description: `Ainda faltam ${
          totalItens - itensConferidos
        } itens para conferir!`,
        variant: 'warning',
        duration: 3000,
      });
    }
  };

  const handleRetry = () => {
    console.log('🔄 [RETRY] Tentando novamente carregar pedido');
    if (id && typeof id === 'string') {
      fetchPedido(id);
    }
  };

  // Render functions
  const renderItem = ({ item, index }: { item: Item; index: number }) => (
    <Box bg='white' rounded='lg' shadow={1} p={4} mb={3} mx={4}>
      <HStack justifyContent='space-between' alignItems='flex-start' mb={3}>
        <VStack flex={1} space={1}>
          <HStack alignItems='center' space={2}>
            <Icon
              as={Ionicons}
              name='cube-outline'
              size='sm'
              color='blue.500'
            />
            <Text fontSize='sm' fontWeight='bold' color='gray.700'>
              {item.Produto.Partnumber}
            </Text>
          </HStack>
          <Text fontSize='sm' color='gray.600' ml={6} numberOfLines={2}>
            {item.Produto.Descricao}
          </Text>
        </VStack>

        {item.conferido ? (
          <Badge colorScheme='success' variant='solid' rounded='full'>
            <HStack alignItems='center' space={1}>
              <Icon as={Ionicons} name='checkmark' size='xs' color='white' />
              <Text fontSize='xs' color='white'>
                Conferido
              </Text>
            </HStack>
          </Badge>
        ) : (
          <Badge colorScheme='gray' variant='outline' rounded='full'>
            <Text fontSize='xs' color='gray.500'>
              Pendente
            </Text>
          </Badge>
        )}
      </HStack>

      <Divider mb={3} />

      <VStack space={2} mb={4}>
        <HStack justifyContent='space-between'>
          <HStack alignItems='center' space={2}>
            <Icon
              as={Ionicons}
              name='barcode-outline'
              size='xs'
              color='gray.500'
            />
            <Text fontSize='xs' color='gray.500'>
              Lote:
            </Text>
          </HStack>
          <Text fontSize='xs' color='gray.700'>
            {item.Lote}
          </Text>
        </HStack>

        <HStack justifyContent='space-between'>
          <HStack alignItems='center' space={2}>
            <Icon
              as={Ionicons}
              name='calendar-outline'
              size='xs'
              color='gray.500'
            />
            <Text fontSize='xs' color='gray.500'>
              Validade:
            </Text>
          </HStack>
          <Text fontSize='xs' color='gray.700'>
            {formatDate(item.DataValidade)}
          </Text>
        </HStack>

        <HStack justifyContent='space-between'>
          <HStack alignItems='center' space={2}>
            <Icon
              as={Ionicons}
              name='layers-outline'
              size='xs'
              color='gray.500'
            />
            <Text fontSize='xs' color='gray.500'>
              Quantidade:
            </Text>
          </HStack>
          <Text fontSize='xs' color='gray.700'>
            {item.Quantidade} {item.Produto.Unidade}
          </Text>
        </HStack>

        <HStack justifyContent='space-between'>
          <HStack alignItems='center' space={2}>
            <Icon
              as={Ionicons}
              name='cash-outline'
              size='xs'
              color='gray.500'
            />
            <Text fontSize='xs' color='gray.500'>
              Valor Unit.:
            </Text>
          </HStack>
          <Text fontSize='xs' color='gray.700'>
            {formatCurrency(item.ValorUnitario)}
          </Text>
        </HStack>

        {item.Produto.Ean13 && (
          <HStack justifyContent='space-between'>
            <HStack alignItems='center' space={2}>
              <Icon as={Ionicons} name='barcode' size='xs' color='gray.500' />
              <Text fontSize='xs' color='gray.500'>
                EAN13:
              </Text>
            </HStack>
            <Text fontSize='xs' color='gray.700'>
              {item.Produto.Ean13}
            </Text>
          </HStack>
        )}

        {/* Progresso da Conferência */}
        <Box>
          <HStack justifyContent='space-between' alignItems='center' mb={2}>
            <Text fontSize='xs' color='gray.600'>
              Progresso da Conferência:
            </Text>
            <Text fontSize='xs' color='gray.700' fontWeight='bold'>
              {item.QuantidadeConferida}/{item.Quantidade}
            </Text>
          </HStack>
          <Progress
            value={(item.QuantidadeConferida / item.Quantidade) * 100}
            colorScheme={item.conferido ? 'success' : 'blue'}
            size='sm'
          />
        </Box>
      </VStack>

      <VStack space={3}>
        {/* Controle Manual da Quantidade */}
        <HStack space={2} alignItems='center'>
          <Text fontSize='sm' color='gray.600'>
            Conferir:
          </Text>
          <IconButton
            icon={<Icon as={Ionicons} name='remove' size='sm' />}
            colorScheme='red'
            variant='outline'
            size='sm'
            onPress={() =>
              alterarQuantidadeManual(
                index,
                Math.max(0, item.QuantidadeConferida - 1)
              )
            }
            isDisabled={item.QuantidadeConferida <= 0 || updating}
          />
          <Input
            value={item.QuantidadeConferida.toString()}
            keyboardType='numeric'
            textAlign='center'
            size='sm'
            w='60px'
            onChangeText={(value) => {
              const num = parseInt(value) || 0;
              if (num >= 0 && num <= item.Quantidade) {
                alterarQuantidadeManual(index, num);
              }
            }}
            isDisabled={updating}
          />
          <IconButton
            icon={<Icon as={Ionicons} name='add' size='sm' />}
            colorScheme='green'
            variant='outline'
            size='sm'
            onPress={() => incrementarQuantidadeConferida(index)}
            isDisabled={item.QuantidadeConferida >= item.Quantidade || updating}
          />
        </HStack>

        {!item.conferido && (
          <VStack space={2}>
            <Button
              size='sm'
              colorScheme='blue'
              leftIcon={<Icon as={Ionicons} name='camera' size='sm' />}
              onPress={() => handleScannerPress(index)}
              isDisabled={updating}
            >
              Scanear Código de Barras
            </Button>
            <Text fontSize='xs' color='gray.500' textAlign='center'>
              Escaneie {item.Quantidade - item.QuantidadeConferida} vez(es) para
              completar
            </Text>
          </VStack>
        )}
      </VStack>

      {/* Indicador de Carregamento */}
      {updating && (
        <Center mt={2}>
          <Spinner size='sm' color='blue.500' />
        </Center>
      )}
    </Box>
  );

  // Loading state
  if (loading) {
    return (
      <Box flex={1} bg='gray.50'>
        <Center flex={1}>
          <Spinner size='lg' color='blue.500' />
          <Text mt={4} color='gray.500'>
            Carregando pedido...
          </Text>
        </Center>
      </Box>
    );
  }

  // Error state
  if (error && !pedido) {
    return (
      <Box flex={1} bg='gray.50'>
        <Center flex={1} px={4}>
          <Icon
            as={Ionicons}
            name='alert-circle'
            size='xl'
            color='red.500'
            mb={4}
          />
          <Text fontSize='lg' color='red.600' textAlign='center' mb={2}>
            Erro ao carregar pedido
          </Text>
          <Text fontSize='sm' color='gray.500' textAlign='center' mb={6}>
            {error}
          </Text>
          <VStack space={3} w='full' maxW='250px'>
            <Button
              colorScheme='blue'
              leftIcon={<Icon as={Ionicons} name='refresh' size='sm' />}
              onPress={handleRetry}
            >
              Tentar novamente
            </Button>
            <Button
              variant='outline'
              colorScheme='gray'
              onPress={() => router.back()}
            >
              Voltar
            </Button>
          </VStack>
        </Center>
      </Box>
    );
  }

  // Not found state
  if (!pedido) {
    return (
      <Box flex={1} bg='gray.50'>
        <Center flex={1} px={4}>
          <Icon
            as={Ionicons}
            name='document-outline'
            size='xl'
            color='gray.400'
            mb={4}
          />
          <Text fontSize='lg' color='gray.600' textAlign='center' mb={2}>
            Pedido não encontrado
          </Text>
          <Text fontSize='sm' color='gray.500' textAlign='center' mb={6}>
            O pedido solicitado não foi encontrado ou não existe.
          </Text>
          <Button
            variant='outline'
            colorScheme='gray'
            onPress={() => router.back()}
          >
            Voltar
          </Button>
        </Center>
      </Box>
    );
  }

  const itensConferidos = pedido.Itens.filter((item) => item.conferido).length;
  const totalItens = pedido.Itens.length;
  const numeroExibicao = extrairUltimos4Digitos(pedido.Numero);

  return (
    <Box flex={1} bg='gray.50'>
      {/* Header */}
      <Box bg='white' pt={12} pb={4} px={4} shadow={1}>
        <HStack alignItems='center' justifyContent='space-between' mb={4}>
          <HStack alignItems='center' space={3}>
            <Pressable onPress={() => router.back()}>
              <Icon
                as={Ionicons}
                name='arrow-back'
                size='lg'
                color='blue.500'
              />
            </Pressable>
            <VStack>
              <Text fontSize='xl' fontWeight='bold' color='gray.700'>
                NF Nº {numeroExibicao}
              </Text>
              <Text fontSize='sm' color='gray.500'>
                Pedido {pedido._id.slice(-8)}
              </Text>
            </VStack>
          </HStack>
        </HStack>

        {/* Botões de Ação */}
        <HStack space={3} justifyContent='space-between'>
          <Button
            flex={1}
            colorScheme='green'
            leftIcon={<Icon as={Ionicons} name='checkmark-done' size='sm' />}
            onPress={handleFinalizarConferencia}
          >
            Finalizar
          </Button>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Informações do Pedido */}
        <Box bg='white' mx={4} mt={4} rounded='lg' shadow={1} p={4}>
          <Text fontSize='lg' fontWeight='bold' color='gray.700' mb={3}>
            Informações do Pedido
          </Text>

          <VStack space={3}>
            <HStack justifyContent='space-between' alignItems='flex-start'>
              <HStack alignItems='center' space={2}>
                <Icon
                  as={Ionicons}
                  name='business'
                  size='sm'
                  color='blue.500'
                />
                <Text fontSize='sm' color='gray.600'>
                  Destinatário:
                </Text>
              </HStack>
              <VStack alignItems='flex-end' flex={1} ml={2}>
                <Text fontSize='sm' color='gray.700' textAlign='right'>
                  {pedido.Destinatario.Razao}
                </Text>
                <Text fontSize='xs' color='gray.500' textAlign='right'>
                  {formatCNPJ(pedido.Destinatario.Cnpj)}
                </Text>
              </VStack>
            </HStack>

            {pedido.cliente && (
              <HStack justifyContent='space-between' alignItems='flex-start'>
                <HStack alignItems='center' space={2}>
                  <Icon
                    as={Ionicons}
                    name='person'
                    size='sm'
                    color='green.500'
                  />
                  <Text fontSize='sm' color='gray.600'>
                    Cliente:
                  </Text>
                </HStack>
                <VStack alignItems='flex-end' flex={1} ml={2}>
                  <Text fontSize='sm' color='gray.700' textAlign='right'>
                    {pedido.cliente.razao_social}
                  </Text>
                  <Text fontSize='xs' color='gray.500' textAlign='right'>
                    {pedido.cliente.nome_fantasia}
                  </Text>
                </VStack>
              </HStack>
            )}

            <HStack justifyContent='space-between'>
              <HStack alignItems='center' space={2}>
                <Icon
                  as={Ionicons}
                  name='calendar'
                  size='sm'
                  color='blue.500'
                />
                <Text fontSize='sm' color='gray.600'>
                  Data de Emissão:
                </Text>
              </HStack>
              <Text fontSize='sm' color='gray.700'>
                {pedido.DataEmissao}
              </Text>
            </HStack>

            <HStack justifyContent='space-between'>
              <HStack alignItems='center' space={2}>
                <Icon as={Ionicons} name='cash' size='sm' color='green.500' />
                <Text fontSize='sm' color='gray.600'>
                  Valor Total:
                </Text>
              </HStack>
              <Text fontSize='sm' color='gray.700' fontWeight='bold'>
                {formatCurrency(pedido.ValorTotal)}
              </Text>
            </HStack>

            <HStack justifyContent='space-between'>
              <HStack alignItems='center' space={2}>
                <Icon as={Ionicons} name='cube' size='sm' color='blue.500' />
                <Text fontSize='sm' color='gray.600'>
                  Progresso:
                </Text>
              </HStack>
              <Text fontSize='sm' color='gray.700'>
                {itensConferidos}/{totalItens} itens conferidos
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Lista de Itens */}
        <Box mt={4} mb={6}>
          <Text fontSize='lg' fontWeight='bold' color='gray.700' mx={4} mb={3}>
            Lista de Itens ({itensConferidos}/{totalItens})
          </Text>
          <FlatList
            data={pedido.Itens}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
          />
        </Box>
      </ScrollView>

      {/* Modal do Scanner */}
      <Modal
        isOpen={showScanner}
        onClose={() => {
          setShowScanner(false);
          setCurrentItemIndex(null);
        }}
        size='full'
      >
        <Modal.Content maxWidth='100%' maxHeight='100%'>
          <Modal.Header>
            {currentItemIndex !== null && pedido && (
              <VStack>
                <Text>Scanner de Código de Barras</Text>
                <Text fontSize='sm' color='gray.500'>
                  Produto: {pedido.Itens[currentItemIndex].Produto.Partnumber}
                </Text>
                <Text fontSize='sm' color='gray.500'>
                  EAN13: {pedido.Itens[currentItemIndex].Produto.Ean13}
                </Text>
              </VStack>
            )}
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
                style={{ height: 400 }}
                facing='back'
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: [
                    'ean13',
                    'ean8',
                    'upc_a',
                    'upc_e',
                    'code128',
                    'code39',
                  ],
                }}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onPress={() => {
                setShowScanner(false);
                setCurrentItemIndex(null);
              }}
            >
              Fechar
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default PedidoDetailScreen;
