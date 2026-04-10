import { View, Text, TouchableOpacity, ScrollView, Alert, Clipboard } from "react-native";
import ExitButton from "@/components/ExitButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { cssInterop } from "nativewind";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import CreateTable from "@/components/CreateTable";
import CreateMonster from "@/components/CreateMonster";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";


cssInterop(SvgXml, {
    className: 'style',
});
const deleteIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
const editIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`
const bookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text-icon lucide-book-open-text"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>`
const monsterIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ghost"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>`

export default function HomeMaster({ onPressLevel }: any) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<any>(null);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isMonsterModalVisible, setMonsterModalVisible] = useState(false);
    const [editingMonster, setEditingMonster] = useState<any>(null);
    const navigation = useNavigation<any>();

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        const user = auth().currentUser;
        if (!user) return;

        // Busca na nova coleção "campaigns" onde o mestre atual é o dono
        const query = firestore().collection('campaigns').where('masterId', '==', user.uid);

        try {
            const snapshotCache = await query.get({ source: 'cache' });
            if (!snapshotCache.empty) {
                setCampaigns(snapshotCache.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                return;
            }
        } catch (e) {
            console.log("Cache vazio, buscando do servidor...");
        }

        try {
            const snapshotServer = await query.get({ source: 'server' });
            setCampaigns(snapshotServer.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Erro ao carregar campanhas:", error);
        }
    };

    const handleSaveCampaign = async (campaignData: any) => {
        const user = auth().currentUser;
        if (!user) return;

        try {
            if (editingCampaign) {
                await firestore().collection('campaigns').doc(editingCampaign.id).update({
                    ...campaignData,
                });
            } else {
                await firestore().collection('campaigns').add({
                    ...campaignData,
                    masterId: user.uid,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
            }
            loadCampaigns(); // Atualiza a lista localmente
        } catch (error) {
            console.error("Erro ao salvar campanha:", error);
        }
    };

    const handleDeleteCampaign = (id: string) => {
        Alert.alert(
            "Excluir Campanha",
            "Tem certeza que deseja excluir esta campanha? Os jogadores perderão o acesso a mesa.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await firestore().collection('campaigns').doc(id).delete();
                            loadCampaigns();
                        } catch (error) {
                            console.error("Erro ao excluir campanha:", error);
                        }
                    }
                }
            ]
        );
    };

    const handleSaveMonster = async (monsterData: any) => {
        const user = auth().currentUser;
        if (!user) return;

        try {
            if (editingMonster) {
                await firestore().collection('monsters').doc(editingMonster.id).update({
                    ...monsterData,
                });
            } else {
                // Verifica se já existe um monstro com esse nome exato no Bestiário Global
                const checkDuplicate = await firestore().collection('monsters').where('name', '==', monsterData.name).get();
                
                if (!checkDuplicate.empty) {
                    Alert.alert(
                        "Monstro já existente",
                        "Alguém já cadastrou um monstro com este nome no Bestiário Global! Busque-o diretamente dentro da sua Mesa para adicioná-lo à batalha sem precisar recriar."
                    );
                    return; // Interrompe o salvamento
                }

                await firestore().collection('monsters').add({
                    ...monsterData,
                    masterId: user.uid,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
            }
            Alert.alert("Sucesso", "Monstro adicionado ao Bestiário Global!");
        } catch (error) {
            console.error("Erro ao salvar monstro:", error);
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-background '>
            <ExitButton />
            <View className='flex-1 items-center mt-8 w-full'>
                <Text className='text-2xl font-bold text-primary mb-10'>Bem-vindo, Mestre!</Text>

                <View className="flex-row justify-center items-center gap-5 mb-10">
                    <TouchableOpacity className="bg-card size-48 items-center justify-center rounded-lg border-[1px] border-gold" onPress={() => {
                        setEditingMonster(null);
                        setMonsterModalVisible(true);
                    }}>
                        <View className="bg-gold-light w-20 h-20 items-center justify-center rounded-full mb-4">
                            <SvgXml width={40} height={40} xml={monsterIconXml} />
                        </View>
                        <Text className="text-textColor-primary">Criar Monstros</Text>
                        <View className=' flex-row items-center mt-6 mb-2 px-2'>
                            <View className='w-16 h-0.5 bg-gold-dark' />
                            <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                            <View className='w-16 h-0.5 bg-gold-dark' />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-card size-48 items-center justify-center rounded-lg border-[1px] border-gold "
                        onPress={() => navigation.navigate('Books', { isMaster: true })}>
                        <View className="bg-gold-light w-20 h-20 items-center justify-center rounded-full mb-4">
                            <SvgXml width={40} height={40} xml={bookIcon} />
                        </View>
                        <Text className="text-textColor-primary">Livros do mestre</Text>
                        <View className=' flex-row items-center mt-6 mb-2 px-2'>
                            <View className='w-16 h-0.5 bg-gold-dark' />
                            <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                            <View className='w-16 h-0.5 bg-gold-dark' />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text className='text-2xl font-bold text-primary mb-4'>Campanhas existentes.</Text>
                <View className=' flex-row items-center mt-6 mb-2 px-2'>
                    <View className='w-16 h-0.5 bg-gold-dark' />
                    <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                    <View className='w-16 h-0.5 bg-gold-dark' />
                </View>
                <ScrollView className="flex-1 w-full mt-8" contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                    <Button label="Criar Nova Campanha" className="bg-gold-dark p-2 text-textColor-primary" onPress={() => {
                        setEditingCampaign(null);
                        setModalVisible(true);
                    }} />

                    {campaigns.map((campaign) => (
                        <View key={campaign.id} className="rounded-lg bg-card mx-[10px] my-[10px] flex-col w-[300px] min-h-[140px] border-[1px] border-gold">
                            <View className="flex-row p-3 ">
                                <View className="flex-1 items-center flex-row gap-4" >

                                    <TouchableOpacity className="flex-1" onPress={() => navigation.navigate('MasterCampaignView', { campaign })}>
                                        <Text className="text-textColor-primary text-[20px] font-bold" numberOfLines={1}>{campaign.campaignName || 'Mesa sem nome'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className=' flex-row justify-center items-center mt-2'>
                                <View className='w-[120px] h-0.5 bg-gold-dark' />
                                <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                                <View className='w-[120px] h-0.5 bg-gold-dark' />
                            </View>

                            <View className="flex-row mt-2">
                                <TouchableOpacity className="flex-1 flex-row items-center justify-center p-[10px] gap-2" onPress={() => {
                                    setEditingCampaign(campaign);
                                    setModalVisible(true);
                                }}>
                                    <SvgXml className="text-textColor-primary" xml={editIconXml} width="16" height="16" />
                                    <Text className="text-textColor-primary">Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 flex-row items-center justify-center p-[10px] gap-2" onPress={() => handleDeleteCampaign(campaign.id)}>
                                    <SvgXml className="text-destructive" xml={deleteIconXml} width="16" height="16" />
                                    <Text className="text-destructive">Excluir</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View >
            <CreateTable
                visible={isModalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditingCampaign(null);
                }}
                onSave={handleSaveCampaign}
                initialData={editingCampaign || {}} />
            <CreateMonster
                visible={isMonsterModalVisible}
                onClose={() => {
                    setMonsterModalVisible(false);
                    setEditingMonster(null);
                }}
                onSave={handleSaveMonster}
                initialData={editingMonster || {}} />
        </SafeAreaView >

    );
}