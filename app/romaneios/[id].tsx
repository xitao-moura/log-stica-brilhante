import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Spinner,
  ScrollView,
  Pressable,
  Center,
  Divider,
} from 'native-base';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../src/config/api.config';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
 

const RomaneioDetailsScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [romaneio, setRomaneio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchRomaneio();
  }, [id]);

  const fetchRomaneio = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get(`/romaneios/${id}`);
        // console.log(`Romaneio:`, JSON.stringify(response.data))
        setRomaneio(response.data);
      } catch (err: any) {
        console.error('Falha ao carregar romaneio', err);
      } finally {
        setLoading(false);
      }
  };

  useFocusEffect(
      useCallback(() => {
        fetchRomaneio();
      }, [])
  );

  if (loading) {
    return (
      <Center flex={1} bg="gray.50">
        <Spinner size="lg" color="blue.500" />
        <Text mt={4} color="gray.500">Carregando dados...</Text>
      </Center>
    );
  }

  if (!romaneio) {
    return (
      <Center flex={1} bg="gray.50">
        <Text color="gray.500">Romaneio não encontrado.</Text>
        <Button mt={4} onPress={() => router.back()}>Voltar</Button>
      </Center>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateString;
    }
  };

  const statusName = romaneio.status?.nome || 'Desconhecido';

  return (
    <Box flex={1} bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow={1} px={4} py={3} safeAreaTop>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" space={2}>
            <Button 
              variant="ghost" 
              p={1} 
              onPress={() => router.back()} 
              _pressed={{ bg: 'gray.100' }}
            >
              <Icon as={Ionicons} name="arrow-back" size="md" color="gray.700" />
            </Button>
            <VStack>
               <Text fontSize="lg" fontWeight="bold" color="gray.800" numberOfLines={1}>
                 {romaneio.cliente?.nome_fantasia || romaneio.cliente?.razao_social || 'Cliente'}
               </Text>
               <Text fontSize="sm" color="gray.500" numberOfLines={1}>
                 {romaneio.transportadora?.nome || romaneio.transportadora?.razao_social || 'Transportadora'}
               </Text>
            </VStack>
          </HStack>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <VStack space={4} p={4}>
          
          <Box bg="white" rounded="xl" shadow={1} p={4}>
            <VStack space={4}>
                <HStack space={3} alignItems="center">
                    <Center w={10} h={10} bg="blue.50" rounded="full">
                        <Icon as={Ionicons} name="bus-outline" size="sm" color="blue.600" />
                    </Center>
                    <VStack flex={1}>
                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" fontWeight="bold">Placa</Text>
                        <Text fontSize="md" fontWeight="medium" color="gray.800">{romaneio.placaVeiculo || '-'}</Text>
                    </VStack>
                    <Center w={10} h={10} bg="orange.50" rounded="full">
                        <Icon as={Ionicons} name="calendar-outline" size="sm" color="orange.600" />
                    </Center>
                    <VStack flex={1}>
                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" fontWeight="bold">Data Coleta</Text>
                        <Text fontSize="md" fontWeight="medium" color="gray.800">{formatDate(romaneio.dataColeta)}</Text>
                    </VStack>
                </HStack>
                
                <Divider bg="gray.100" />
                
                <HStack space={3} alignItems="center">
                    <Center w={10} h={10} bg="green.50" rounded="full">
                        <Icon as={Ionicons} name="person-outline" size="sm" color="green.600" />
                    </Center>
                    <VStack flex={1}>
                        <Text fontSize="xs" color="gray.400" textTransform="uppercase" fontWeight="bold">Motorista</Text>
                        <Text fontSize="md" fontWeight="medium" color="gray.800">{romaneio.nomeMotorista || '-'}</Text>
                    </VStack>
                </HStack>
            </VStack>
          </Box>

          <Box>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <Icon as={Ionicons} name="newspaper-outline" size="sm" color="blue.600" style={{ marginRight: 6 }} />
                <Text fontSize="md" fontWeight="bold" color="gray.700">Notas Fiscais 
                  <Text fontSize="12" color="gray.500">({romaneio.documentosTransportados?.length || 0})</Text>
                </Text>
            </View>
            
            <VStack space={3}>
                {romaneio.documentosTransportados?.map((doc: any, index: number) => {
                    const saida = doc.saida;
                    const itensDocumento = doc.itensDocumento;
                    
                    if (!saida || typeof saida === 'string') return null;
                    
                    const destinatarioNome = typeof saida.destinatario === 'object' 
                        ? (saida.destinatario?.razao || saida.destinatario?.nome) 
                        : 'Destinatário não carregado';

                    return (
                        <Pressable 
                            key={saida._id || index} 
                            onPress={() => router.push({
                                pathname: "/romaneios/nfs/[id]",
                                params: { id: saida._id, nfData: JSON.stringify(doc), romaneioId: romaneio._id }
                            })}
                        >
                            {({ isPressed }) => (
                                <Box 
                                    bg={isPressed ? "gray.50" : "white"} 
                                    p={4} 
                                    rounded="xl" 
                                    shadow={1}
                                    borderWidth={1}
                                    borderColor="gray.50"
                                >
                                    <HStack justifyContent="space-between" alignItems="center">
                                        <HStack space={3} flex={1}>
                                             <Center w={10} h={10} bg="gray.100" rounded="lg">
                                                <Icon as={Ionicons} name="document-text-outline" size="md" color="gray.600" />
                                            </Center>
                                            <VStack space={1} flex={1}>
                                                <HStack space={2} alignItems="center">
                                                    <Text fontWeight="bold" fontSize="md" color="gray.800">
                                                        NF-{saida.numero}
                                                    </Text>
                                                    <Text fontSize="xs" color="gray.400">
                                                        • {formatDate(romaneio.dataColeta)}
                                                    </Text>
                                                </HStack>
                                            </VStack>
                                        </HStack>
                                        <Icon as={Ionicons} name="chevron-forward" size="sm" color="gray.400" />
                                    </HStack>
                                    <HStack justifyContent="space-between" alignItems="center" mt={5}>
                                      <HStack flex={1}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                          <Icon as={Feather} name="map-pin" size="4" color="blue.600" style={{ marginRight: 7 }} />
                                          <Text>{destinatarioNome}</Text>
                                        </View>
                                      </HStack>
                                    </HStack>
                                    <HStack space={3} flex={1}>
                                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                          <Icon as={Feather} name="box" size="4" color="blue.600" style={{ marginRight: 7 }} />
                                          <Text>{itensDocumento?.length || 0} item(ns)</Text>
                                      </View>
                                    </HStack>
                                    <HStack space={3} flex={1} mt={3} flexDirection={ "row" }>
                                      <Box
                                        px={2}
                                        py={0.5}
                                        rounded="full"
                                        bg={doc?.statusEntrega?.color || "gray.700"}
                                      >
                                        <Text fontSize="10" fontWeight="bold" color={ "#000" }>
                                          { doc?.statusEntrega?.nome }
                                        </Text>
                                      </Box>
                                      {/* <Box
                                        px={2}
                                        py={0.5}
                                        rounded="full"
                                        bg={saida?.status?.color}
                                      >
                                        <Text fontSize="10" fontWeight="bold" color={ "#000" }>
                                          { saida?.status?.nome }
                                        </Text>
                                      </Box> */}
                                    </HStack>
                                </Box>
                            )}
                        </Pressable>
                    );
                })}
                
                {(!romaneio.documentosTransportados || romaneio.documentosTransportados.length === 0) && (
                    <Center p={4}>
                        <Text color="gray.400">Nenhuma nota fiscal vinculada.</Text>
                    </Center>
                )}
            </VStack>
          </Box>
        </VStack>
      </ScrollView>

      {/* Footer Status */}
      <Box 
        position="absolute" 
        bottom={0} 
        left={0} 
        right={0} 
        bg="white" 
        shadow={9}
        borderTopWidth={1}
        borderTopColor="gray.100"
        p={4}
      >
        <Box 
            bg={ romaneio?.status?.color || "gray.700" } 
            py={3}
            px={4} 
            rounded="lg" 
            alignItems="center" 
            justifyContent="center"
            flexDirection="row"
            shadow={1}
        >   
            <Text color={ "#000" } fontWeight="bold" fontSize="md">
                {statusName}
            </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default RomaneioDetailsScreen;
