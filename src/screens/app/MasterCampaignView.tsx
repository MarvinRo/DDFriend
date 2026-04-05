import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';

export default function MasterCampaignView({ route }: any) {
    const navigation = useNavigation<any>();
    const campaign = route?.params?.campaign || {};
    const [characters, setCharacters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const arrowLeftXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C49A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`;
    const profileXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

    useEffect(() => {
        if (!campaign.id) return;

        // Usamos onSnapshot para que a lista atualize em tempo real se a vida do jogador mudar na ficha dele
        const unsubscribe = firestore()
            .collection('characterSheets')
            .where('campaignId', '==', campaign.id)
            .onSnapshot(
                (snapshot) => {
                    if (snapshot) {
                        const chars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setCharacters(chars);
                    }
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Erro ao buscar fichas da mesa:", error);
                    setIsLoading(false);
                }
            );

        return () => unsubscribe();
    }, [campaign.id]);

    const handleExpelPlayer = (characterId: string, characterName: string, ownerId: string) => {
        Alert.alert(
            "Expulsar Jogador",
            `Tem certeza que deseja remover ${characterName} da mesa? A ficha não será apagada, apenas desvinculada.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Expulsar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Define o campaignId como nulo para desvincular, respeitando a regra do Firebase
                            await firestore().collection('characterSheets').doc(characterId).update({
                                campaignId: null
                            });

                            // Remove o jogador da lista de convidados da campanha
                            if (ownerId && campaign.id) {
                                const campaignRef = firestore().collection('campaigns').doc(campaign.id);
                                const campaignDoc = await campaignRef.get();
                                if (campaignDoc.exists) {
                                    const campaignData = campaignDoc.data();
                                    const updatedPlayers = (campaignData?.players || []).filter((p: any) => p.id !== ownerId);
                                    const updatedPlayerIds = (campaignData?.playerIds || []).filter((id: string) => id !== ownerId);
                                    await campaignRef.update({ players: updatedPlayers, playerIds: updatedPlayerIds });
                                }
                            }
                        } catch (error) {
                            console.error("Erro ao expulsar jogador:", error);
                            Alert.alert("Erro", "Não foi possível remover o jogador da mesa.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className='flex-1 bg-background p-4'>
            <TouchableOpacity
                className="absolute top-6 left-4 z-50 bg-card p-2 rounded-full border border-gold mt-8"
                onPress={() => navigation.navigate('HomeMaster')}
            >
                <SvgXml xml={arrowLeftXml} width="24" height="24" />
            </TouchableOpacity>

            <View className='flex-1 items-center mt-20 w-full'>
                <Text className='text-gold text-2xl font-bold mb-2'>{campaign.campaignName}</Text>
                <Text className='text-textColor-secondary text-sm mb-8'>Jogadores na Mesa</Text>

                <ScrollView className="flex-1 w-full" contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                    {isLoading ? (
                        <Text className="text-textColor-secondary">Localizando aventureiros...</Text>
                    ) : characters.length === 0 ? (
                        <Text className="text-textColor-secondary">Nenhum jogador aceitou o convite ainda.</Text>
                    ) : (
                        characters.map((char) => (
                            <View key={char.id} className="rounded-lg bg-card mx-[10px] my-[10px] flex-col w-[320px] border-[1px] border-gold">
                                <View className="flex-row p-3 items-center">
                                    <Avatar>
                                        <AvatarImage source={{ uri: char.characterPhoto || undefined }} />
                                        <AvatarFallback textClassname="text-textColor-primary font-bold">
                                            {(char.characterName || 'S').charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <View className="ml-4 flex-1">
                                        <Text className="text-textColor-primary text-[18px] font-bold">{char.characterName || 'Sem Nome'}</Text>
                                        <Text className="text-textColor-secondary text-[12px]">
                                            {char.characterRace || 'Raça'} • {char.characterClass || 'Classe'} • Lv.{char.level || 1}
                                        </Text>
                                        <Text className="text-gold text-[14px] mt-2 font-bold">HP: {char.life || 0}   |   CA: {char.armorClass || 10}</Text>
                                    </View>
                                </View>
                                
                                <View className="flex-row border-t border-gold-dark">
                                    <TouchableOpacity className="flex-1 flex-row items-center justify-center py-[12px] border-r border-gold-dark" onPress={() => navigation.navigate('CharacterSheet', { character: char, fromMaster: true, campaign })}>
                                        <Text className="text-textColor-primary font-bold text-sm">Ver Ficha</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 flex-row items-center justify-center py-[12px]" onPress={() => handleExpelPlayer(char.id, char.characterName, char.ownerId)}>
                                        <Text className="text-destructive font-bold text-sm">Expulsar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}