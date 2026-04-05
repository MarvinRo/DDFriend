import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';

interface CreateTableProps {
    visible: boolean;
    onClose: () => void,
    onSave: (campaignData: any) => void,
    isSaving?: boolean,
    initialData?: any
}

export default function CreateTable({ onClose, onSave, initialData, visible }: CreateTableProps) {
    const [campaignName , setCampaignName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);

    const handleClose = () => {
        setCampaignName('');
        setSearchEmail('');
        setSearchResults([]);
        setSelectedPlayers([]);
        onClose();
    };

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setCampaignName(initialData.campaignName || '');
            setSelectedPlayers(initialData.players || []);
        }
    }, [initialData]);

    // Hook para realizar a busca no Firebase (com atraso de 500ms para poupar requisições)
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchEmail && searchEmail.length >= 3) {
                try {
                    // Busca na coleção users onde o e-mail "começa com" o texto digitado
                    const snapshot = await firestore()
                        .collection('users')
                        .where('email', '>=', searchEmail.toLowerCase())
                        .where('email', '<=', searchEmail.toLowerCase() + '\uf8ff')
                        .limit(5)
                        .get();
                    
                    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setSearchResults(results);
                } catch (error) {
                    console.error("Erro ao buscar usuários:", error);
                }
            } else {
                setSearchResults([]);
            }
        }, 500); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchEmail]);

    const handleSaveData = () => {
        const campaignData = {
            campaignName,
            players: selectedPlayers,
            playerIds: selectedPlayers.map(p => p.id), // Array simples de IDs para facilitar a busca do jogador
        };
        onSave(campaignData);
        handleClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                handleClose();
            }}>
            <SafeAreaView className="flex-1 justify-center items-center">
                <View className='m-5 bg-card rounded-[10px] p-[35px] items-center justify-center min-h-[400px] max-h-[80%] border-gold border-[1px] w-11/12'>
                    <ScrollView className='w-full flex-1 mb-4 ' showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <View className='flex-1 items-center justify-start w-full gap-3 pb-2'>
                            <Text className='text-textColor-primary text-[24px] font-bold mb-4'>{initialData && initialData.id ? 'Editar Campanha' : 'Nova Campanha'}</Text>
                            
                            <Input className='border-l-gold border-t-gray-500 border-r-gray-500 border-b-gray-500 border-[2px] rounded-lg w-full mb-2' placeholder='Nome da campanha' value={campaignName} onChangeText={setCampaignName} />
                            
                            <View className='w-full mt-2'>
                                <Text className='text-textColor-secondary text-sm mb-2'>Convidar Jogadores</Text>
                                <Input 
                                    className='border-l-gold border-t-gray-500 border-r-gray-500 border-b-gray-500 border-[2px] rounded-lg w-full' 
                                    placeholder='Buscar por e-mail...' 
                                    value={searchEmail} 
                                    onChangeText={setSearchEmail} 
                                    autoCapitalize="none"
                                />
                                
                                {searchResults.length > 0 && (
                                    <View className="bg-background border border-gold rounded-lg w-full max-h-40 mt-1 overflow-hidden z-50">
                                        {searchResults.map((user) => (
                                            <TouchableOpacity
                                                key={user.id}
                                                className="p-3 border-b border-gray-800"
                                                onPress={() => {
                                                    // Adiciona na lista apenas se não tiver sido adicionado ainda
                                                    if (!selectedPlayers.find(p => p.id === user.id)) {
                                                        setSelectedPlayers([...selectedPlayers, user]);
                                                    }
                                                    setSearchEmail('');
                                                    setSearchResults([]);
                                                }}
                                            >
                                                <Text className="text-textColor-primary">{user.nome || 'Sem nome'}</Text>
                                                <Text className="text-textColor-secondary text-xs">{user.email}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Exibe os jogadores adicionados em formato de Chips/Etiquetas */}
                            <View className="flex-row flex-wrap gap-2 w-full mt-2">
                                {selectedPlayers.map((player) => (
                                    <View key={player.id} className="bg-gold-dark rounded-full px-3 py-1 flex-row items-center gap-2">
                                        <Text className="text-white text-xs">{player.email}</Text>
                                        <TouchableOpacity onPress={() => setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id))}>
                                            <Text className="text-destructive font-bold ml-2">X</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                    <View className='flex-row gap-4 items-center justify-center w-full'>
                        <Pressable
                            className='bg-gold-light rounded-[40px] px-4 py-2 w-[120px] items-center justify-center'
                            onPress={handleSaveData}
                        >
                            <Text className='text-gold-dark'>Salvar</Text>
                        </Pressable>
                        <Pressable
                            className='bg-gold-dark rounded-[40px] px-4 py-2 w-[120px] items-center justify-center'
                            onPress={handleClose}>
                            <Text className='text-textColor-primary'>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}