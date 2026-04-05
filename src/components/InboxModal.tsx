import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { SvgXml } from 'react-native-svg';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';

interface InboxModalProps {
    visible: boolean;
    onClose: () => void;
    characters: any[];
    onUpdate: () => void;
}

const mailOpenIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-open"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>`;

export default function InboxModal({ visible, onClose, characters, onUpdate }: InboxModalProps) {
    const [invitations, setInvitations] = useState<any[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchInvitations = async () => {
        const user = auth().currentUser;
        if (!user) return;
        
        setIsLoading(true);
        try {
            // 1. Busca todas as campanhas em que o ID do jogador atual está na lista
            const campaignsSnap = await firestore().collection('campaigns').where('playerIds', 'array-contains', user.uid).get();
            const campaignsData = campaignsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // 2. Verifica as campanhas que o jogador já aceitou (se alguma ficha dele já possui esse campaignId)
            const acceptedCampaignIds = characters.filter((c: any) => c.campaignId).map((c: any) => c.campaignId);

            // 3. Filtra apenas os convites pendentes
            const pending = campaignsData.filter(c => !acceptedCampaignIds.includes(c.id));
            setInvitations(pending);
        } catch (error) {
            console.error("Erro ao buscar convites:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            setSelectedCampaign(null);
            fetchInvitations();
        }
    }, [visible, characters]);

    const handleAccept = async (characterId: string) => {
        if (!selectedCampaign) return;
        try {
            // Adiciona o campaignId na ficha escolhida pelo jogador
            await firestore().collection('characterSheets').doc(characterId).update({
                campaignId: selectedCampaign.id
            });
            Alert.alert("Sucesso!", "Você entrou na mesa com sucesso.");
            onUpdate();
            onClose();
        } catch (error) {
            Alert.alert("Erro", "Não foi possível aceitar o convite.");
        }
    };

    const handleReject = async (campaignId: string) => {
        const user = auth().currentUser;
        if (!user) return;
        try {
            // Remove o jogador da lista da mesa, assim o mestre saberá que ele não está mais e poderá re-convidar
            const campaignRef = firestore().collection('campaigns').doc(campaignId);
            const campaignDoc = await campaignRef.get();
            
            if (campaignDoc.exists) {
                const campaignData = campaignDoc.data();
                const playerToRemove = (campaignData?.players || []).find((p: any) => p.id === user.uid || p.uid === user.uid);
                
                const updates: any = {
                    playerIds: firestore.FieldValue.arrayRemove(user.uid)
                };
                if (playerToRemove) {
                    updates.players = firestore.FieldValue.arrayRemove(playerToRemove);
                }
                await campaignRef.update(updates);
            }
            fetchInvitations(); // Atualiza a lista
        } catch (error: any) {
            console.error("Erro ao recusar convite:", error);
            Alert.alert("Erro", `Não foi possível recusar o convite. Detalhes: ${error.message}`);
        }
    };

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <SafeAreaView className="flex-1 justify-center items-center bg-black/60">
                <View className='m-5 bg-card rounded-[10px] p-[25px] items-center min-h-[400px] max-h-[80%] border-gold border-[1px] w-11/12'>
                    
                    <View className="flex-row items-center gap-3 mb-6 w-full justify-center">
                        <SvgXml xml={mailOpenIconXml} className="text-gold" width={28} height={28} />
                        <Text className='text-textColor-primary text-[22px] font-bold'>Caixa de Entrada</Text>
                    </View>

                    <ScrollView className='w-full flex-1 mb-4' showsVerticalScrollIndicator={false}>
                        {isLoading ? (
                            <Text className="text-textColor-secondary text-center mt-4">Buscando convites...</Text>
                        ) : invitations.length === 0 ? (
                            <Text className="text-textColor-secondary text-center mt-4">Você não tem novos convites de mesa.</Text>
                        ) : selectedCampaign ? (
                            <View className="w-full">
                                <Text className="text-textColor-primary text-center mb-4">
                                    Com qual personagem você deseja entrar na mesa <Text className="text-gold font-bold">{selectedCampaign.campaignName}</Text>?
                                </Text>
                                {characters.map(char => (
                                    <TouchableOpacity 
                                        key={char.id} 
                                        className="bg-background border border-gold-light rounded-lg p-3 mb-3 flex-row items-center gap-4"
                                        onPress={() => handleAccept(char.id)}
                                    >
                                        <Avatar>
                                            <AvatarImage source={{ uri: char.characterPhoto }} />
                                            <AvatarFallback textClassname="text-textColor-primary font-bold">
                                                {(char.characterName || 'S').charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <View>
                                            <Text className="text-gold font-bold text-lg">{char.characterName || 'Sem Nome'}</Text>
                                            <Text className="text-textColor-secondary text-xs">Nível {char.level || 1}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity onPress={() => setSelectedCampaign(null)} className="mt-2 p-2 items-center">
                                    <Text className="text-textColor-secondary">Voltar para convites</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            invitations.map(invite => (
                                <View key={invite.id} className="bg-background border border-gold rounded-lg p-4 mb-4 w-full">
                                    <Text className="text-textColor-secondary text-xs">Convite para a mesa:</Text>
                                    <Text className="text-gold font-bold text-xl mb-3">{invite.campaignName || 'Mesa sem nome'}</Text>
                                    
                                    <View className="flex-row gap-3">
                                        <TouchableOpacity className="flex-1 bg-green-700/80 border border-green-500 py-2 rounded-full items-center" onPress={() => setSelectedCampaign(invite)}>
                                            <Text className="text-white font-bold">Aceitar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-1 bg-destructive/80 border border-red-500 py-2 rounded-full items-center" onPress={() => handleReject(invite.id)}>
                                            <Text className="text-white font-bold">Recusar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <Pressable className='bg-gold-dark rounded-[40px] px-6 py-2 items-center justify-center mt-2' onPress={onClose}>
                        <Text className='text-textColor-primary font-bold'>Fechar</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </Modal>
    );
}