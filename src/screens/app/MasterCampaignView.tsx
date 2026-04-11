import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Modal as RNModal, Keyboard, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, where, onSnapshot, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import CreateMonster from "@/components/CreateMonster";
import { Input } from '@/components/ui/Input';

// Componente para segurar a digitação da iniciativa sem re-ordenar a lista prematuramente
const InitiativeInput = ({ initialValue, onUpdate }: { initialValue: number, onUpdate: (val: string) => void }) => {
    const [val, setVal] = useState(String(initialValue || 0));
    
    useEffect(() => {
        setVal(String(initialValue || 0));
    }, [initialValue]);

    return (
        <TextInput
            className="bg-background border border-gold-light rounded text-textColor-primary text-center w-10 h-10 p-0"
            keyboardType="numeric"
            value={val}
            onChangeText={(text) => setVal(text.replace(/[^0-9]/g, ''))}
            onEndEditing={() => onUpdate(val)} // Só envia pro Firebase ao terminar de digitar/fechar teclado
        />
    );
};

// Componente para segurar a digitação do HP sem re-renderizar prematuramente
const HpInput = ({ initialValue, maxHp, onUpdate }: { initialValue: number, maxHp: number, onUpdate: (val: number) => void }) => {
    const [val, setVal] = useState(String(initialValue ?? 0));
    
    useEffect(() => {
        setVal(String(initialValue ?? 0));
    }, [initialValue]);

    return (
        <View className="flex-row items-center">
            <TextInput
                className="text-textColor-primary font-bold text-center min-w-[30px] p-0 m-0 border-b border-gold-dark/50"
                keyboardType="numeric"
                value={val}
                onChangeText={(text) => setVal(text.replace(/[^0-9]/g, ''))}
                onEndEditing={() => onUpdate(Number(val))}
                selectTextOnFocus
            />
            <Text className="text-textColor-primary font-bold"> / {maxHp}</Text>
        </View>
    );
};

export default function MasterCampaignView({ route }: any) {
    const navigation = useNavigation<any>();
    const campaign = route?.params?.campaign || {};
    const [campaignData, setCampaignData] = useState<any>(campaign);
    const [characters, setCharacters] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [campaignMonsters, setCampaignMonsters] = useState<any[]>([]);
    const [filteredBestiary, setFilteredBestiary] = useState<any[]>([]);
    const [searchBestiary, setSearchBestiary] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [isBestiaryVisible, setBestiaryVisible] = useState(false);
    const [isMonsterModalVisible, setMonsterModalVisible] = useState(false);
    const [editingMonster, setEditingMonster] = useState<any>(null);

    const arrowLeftXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C49A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`;
    const profileXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

    useEffect(() => {
        let unsubscribeCampaign: () => void;
        let unsubscribeChars: () => void;

        if (!campaign.id) return;

        const db = getFirestore();
        
        // Observa as mudanças no documento da campanha em tempo real (para a Iniciativa e Estado de Combate atualizarem na tela)
        unsubscribeCampaign = onSnapshot(doc(db, 'campaigns', campaign.id), (docSnap) => {
            if (docSnap.exists()) {
                setCampaignData({ id: docSnap.id, ...docSnap.data() });
            }
        });

        // Usamos onSnapshot para que a lista atualize em tempo real se a vida do jogador mudar na ficha dele
        const q = query(collection(db, 'characterSheets'), where('campaignId', '==', campaign.id));
        unsubscribeChars = onSnapshot(
            q,
                (snapshot) => {
                    if (snapshot) {
                        const chars = snapshot.docs.map((doc: { id: any; data: () => any; }) => ({ ...doc.data(), id: doc.id }));
                        setCharacters(chars);
                    }
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Erro ao buscar fichas da mesa:", error);
                    setIsLoading(false);
                }
            );

        return () => {
            if (unsubscribeCampaign) unsubscribeCampaign();
            if (unsubscribeChars) unsubscribeChars();
        };
    }, [campaign.id]);

    useEffect(() => {
        if (!campaign.id) return;
        
        const db = getFirestore();
        const monstersRef = collection(db, 'campaigns', campaign.id, 'monsters');
        const unsubscribeMonsters = onSnapshot(
            monstersRef,
                (snapshot) => {
                    if (snapshot) {
                        const mons = snapshot.docs.map((doc: { id: any; data: () => any; }) => ({ ...doc.data(), id: doc.id }));
                        setCampaignMonsters(mons);
                    }
                },
                (error) => console.error("Erro ao buscar monstros da mesa:", error)
            );
        return () => unsubscribeMonsters();
    }, [campaign.id]);

    const combatants = useMemo(() => {
        const state = campaignData.combatState || [];
        return state.map((c: any) => {
            if (c.type === 'player') {
                const p = characters.find(x => x.id === c.id);
                return p ? { ...p, combatId: c.id, type: 'player', sortInit: c.initiative } : null;
            } else {
                const baseId = c.baseId || c.id.split('_')[0]; // Suporte para monstros novos com sufixo e antigos sem
                const m = campaignMonsters.find(x => x.id === baseId);
                if (m) {
                    let displayName = m.name;
                    const parts = c.id.split('_');
                    if (parts.length > 1) {
                        displayName = `${m.name} ${parts[parts.length - 1]}`; // Adiciona o número (Ex: Duende 2)
                    }
                    return { ...m, name: displayName, combatId: c.id, type: 'monster', sortInit: c.initiative, currentHp: c.currentHp !== undefined ? c.currentHp : (m.hp || 0) };
                }
                return null;
            }
        }).filter(Boolean).sort((a: any, b: any) => b.sortInit - a.sortInit);
    }, [characters, campaignMonsters, campaignData.combatState]);

    const openBestiary = async () => {
        setBestiaryVisible(true);
        setSearchBestiary('');
        setFilteredBestiary([]);
        setHasSearched(false);
        setIsSearching(false);
    };

    const handleSearchBestiary = async () => {
        Keyboard.dismiss();

        if (!searchBestiary || searchBestiary.trim().length === 0) {
            setFilteredBestiary([]);
            setHasSearched(false);
            return;
        }

        setFilteredBestiary([]);
        setIsSearching(true);
        setHasSearched(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const db = getFirestore();
            const snap = await getDocs(collection(db, 'monsters'));
            
            const allMons = snap.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));
            console.log(allMons);
            

            const normalize = (text: string) => {
                if (!text) return '';
                let str = text.toLowerCase();
                try {
                    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                } catch (e) {
                    str = str.replace(/[áàãâä]/g, 'a')
                             .replace(/[éèêë]/g, 'e')
                             .replace(/[íìîï]/g, 'i')
                             .replace(/[óòõôö]/g, 'o')
                             .replace(/[úùûü]/g, 'u')
                             .replace(/[ç]/g, 'c')
                             .replace(/[ñ]/g, 'n');
                }
                return str.replace(/[^a-z0-9]/g, '');
            };

            const normalizedSearch = normalize(searchBestiary);
            
            const combinedResults = allMons.filter((m: { name: string; description: string; photoUrl: any; }) => {
                const normalizedName = normalize(m.name);
                const normalizedDesc = normalize(m.description);
                const url = (m.photoUrl || '').toLowerCase();
                
                // Busca no nome traduzido, na descrição e na URL da foto (que tem o nome original em inglês)
                return normalizedName.includes(normalizedSearch) || 
                       url.includes(normalizedSearch) ||
                       normalizedDesc.includes(normalizedSearch);
            });

            combinedResults.sort((a:any, b:any) => (a.name || '').localeCompare(b.name || ''));
            console.log("Monstros filtrados com sucesso:", combinedResults[0]);
            setFilteredBestiary(combinedResults);
        } catch (error) {
            console.error("Erro ao buscar no Firebase:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddMonsterToTable = async (monster: any) => {
        try {
            const db = getFirestore();
            const monsterData = { ...monster };
            delete monsterData.id; // Garante que o ID da subcoleção não seja sobrescrito

            await addDoc(collection(db, 'campaigns', campaign.id, 'monsters'), {
                ...monsterData,
                rootId: monster.id,
                currentHp: monster.hp || 0,
                initiative: 0,
                addedAt: serverTimestamp()
            });
            Alert.alert("Sucesso", `${monster.name} adicionado à mesa!`);
            setBestiaryVisible(false);
        } catch(e) {
            Alert.alert("Erro", "Não foi possível adicionar o monstro.");
        }
    };

    const handleUpdateHp = async (id: string, currentHp: number, change: number) => {
        const newHp = Math.max(0, (currentHp || 0) + change);
        const db = getFirestore();
        const currentState = campaignData.combatState || [];
        const newState = currentState.map((c: any) => c.id === id ? { ...c, currentHp: newHp } : c);
        await updateDoc(doc(db, 'campaigns', campaign.id), { combatState: newState });
    };

    const handleSetHp = async (id: string, newHp: number) => {
        const db = getFirestore();
        const currentState = campaignData.combatState || [];
        const newState = currentState.map((c: any) => c.id === id ? { ...c, currentHp: Math.max(0, newHp) } : c);
        await updateDoc(doc(db, 'campaigns', campaign.id), { combatState: newState });
    };

    const handleUpdateInitiative = async (id: string, initiative: string) => {
        const val = Number(initiative) || 0;
        const db = getFirestore();
        const currentState = campaignData.combatState || [];
        const newState = currentState.map((c: any) => c.id === id ? { ...c, initiative: val } : c);
        await updateDoc(doc(db, 'campaigns', campaign.id), { combatState: newState });
    };

    const handleAddToCombat = async (id: string, type: 'player' | 'monster') => {
        const db = getFirestore();
        const currentState = campaignData.combatState || [];
        if (type === 'player') {
            if (!currentState.find((c: any) => c.id === id)) {
                await updateDoc(doc(db, 'campaigns', campaign.id), {
                    combatState: [...currentState, { id, type, initiative: 0 }]
                });
            }
        } else {
            let newId = id;
            const existingInstances = currentState.filter((c: any) => c.id === id || c.id.startsWith(`${id}_`));
            if (existingInstances.length > 0) {
                let maxIdx = 1;
                existingInstances.forEach((inst: any) => {
                    const parts = inst.id.split('_');
                    if (parts.length > 1) {
                        const idx = parseInt(parts[parts.length - 1], 10);
                        if (!isNaN(idx) && idx > maxIdx) maxIdx = idx;
                    }
                });
                newId = `${id}_${maxIdx + 1}`;
            }
            let initialHp = 0;
            const m = campaignMonsters.find(x => x.id === id);
            if (m) initialHp = m.hp || 0;
            await updateDoc(doc(db, 'campaigns', campaign.id), {
                combatState: [...currentState, { id: newId, baseId: id, type, initiative: 0, currentHp: initialHp }]
            });
        }
    };

    const handleRemoveFromCombat = async (id: string) => {
        const db = getFirestore();
        const currentState = campaignData.combatState || [];
        await updateDoc(doc(db, 'campaigns', campaign.id), {
            combatState: currentState.filter((c: any) => c.id !== id)
        });
    };

    const handleClearCombat = () => {
        Alert.alert("Limpar Campo", "Deseja encerrar a batalha e esvaziar o campo de combate?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Limpar", style: "destructive", onPress: async () => await updateDoc(doc(getFirestore(), 'campaigns', campaign.id), { combatState: [] }) }
        ]);
    };

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
                            const db = getFirestore();

                            // Remove do combate automaticamente
                            const currentState = campaignData.combatState || [];
                            const updatedState = currentState.filter((c: any) => c.id !== characterId);
                            if (updatedState.length !== currentState.length) {
                                await updateDoc(doc(db, 'campaigns', campaign.id), { combatState: updatedState });
                            }

                            // Define o campaignId como nulo para desvincular, respeitando a regra do Firebase
                            await updateDoc(doc(db, 'characterSheets', characterId), {
                                campaignId: null
                            });

                            // Remove o jogador da lista de convidados da campanha
                            if (ownerId && campaign.id) {
                                const campaignRef = doc(db, 'campaigns', campaign.id);
                                const campaignDoc = await getDoc(campaignRef);
                                if (campaignDoc.exists()) {
                                    const campaignData = campaignDoc.data();
                                    const updatedPlayers = (campaignData?.players || []).filter((p: any) => p.id !== ownerId);
                                    const updatedPlayerIds = (campaignData?.playerIds || []).filter((id: string) => id !== ownerId);
                                    await updateDoc(campaignRef, { players: updatedPlayers, playerIds: updatedPlayerIds });
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

    const handleDeleteMonster = (id: string) => {
        Alert.alert("Remover Monstro", "Deseja remover este monstro da mesa de forma definitiva?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Remover",
                style: "destructive",
                onPress: async () => {
                    try {
                        const db = getFirestore();

                        // Limpa os IDs do monstro do Campo de Batalha caso ele esteja em combate
                        const currentState = campaignData.combatState || [];
                        const updatedState = currentState.filter((c: any) => c.baseId !== id && c.id !== id && !(typeof c.id === 'string' && c.id.startsWith(`${id}_`)));
                        if (updatedState.length !== currentState.length) {
                            await updateDoc(doc(db, 'campaigns', campaign.id), { combatState: updatedState });
                        }

                        await deleteDoc(doc(db, 'campaigns', campaign.id, 'monsters', id));
                    } catch (error) {
                        console.error("Erro ao remover monstro:", error);
                        Alert.alert("Erro", "Não foi possível remover o monstro da mesa.");
                    }
                }
            }
        ]);
    };

    const handleSaveLocalMonster = async (monsterData: any) => {
        if (editingMonster) {
            try {
                const db = getFirestore();
                await updateDoc(doc(db, 'campaigns', campaign.id, 'monsters', editingMonster.id), {
                    ...monsterData,
                });
                setMonsterModalVisible(false);
            } catch(error) {
                Alert.alert("Erro", "Não foi possível salvar as alterações do monstro.");
            }
        }
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

                <ScrollView className="flex-1 w-full" contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                    
                    {/* SEÇÃO 1: CAMPO DE BATALHA */}
                    {combatants.length > 0 && (
                        <View className="w-full items-center mb-10 mt-4 border border-gold-dark p-2 rounded-lg bg-black/40">
                            <Text className="text-gold text-xl font-bold mb-2 mt-2">⚔️ Campo de Batalha</Text>
                            <TouchableOpacity onPress={handleClearCombat} className="bg-destructive px-6 py-2 rounded-full mb-4">
                                <Text className="text-white font-bold">Limpar Campo</Text>
                            </TouchableOpacity>
                            
                            {combatants.map((char: any) => (
                                <View key={`combat-${char.combatId}`} className="rounded-lg bg-card mx-[10px] my-[10px] flex-col w-[310px] border-[1px] border-gold shadow-lg shadow-black">
                                    <View className="flex-row p-3 items-center">
                                        <Avatar>
                                            <AvatarImage source={{ uri: (char.type === 'player' ? char.characterPhoto : char.photoUrl) || undefined }} />
                                            <AvatarFallback textClassname="text-textColor-primary font-bold">
                                                {(char.type === 'player' ? char.characterName || 'S' : char.name || 'M').charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <View className="ml-4 flex-1">
                                            <Text className="text-textColor-primary text-[18px] font-bold" numberOfLines={1}>{char.type === 'player' ? char.characterName : char.name}</Text>
                                        </View>
                                        <View className="items-center ml-2">
                                            <Text className="text-gold text-[10px] mb-1">Iniciativa</Text>
                                            <InitiativeInput 
                                                initialValue={char.sortInit} 
                                                onUpdate={(val) => handleUpdateInitiative(char.combatId, val)} 
                                            />
                                        </View>
                                    </View>
                                    
                                    <View className="flex-row items-center justify-between px-3 py-2 bg-black/20 border-t border-gold-dark">
                                        <Text className="text-gold font-bold text-sm">CA: {char.type === 'player' ? char.armorClass || 10 : char.ac || 10}</Text>
                                        <View className="flex-row items-center gap-3">
                                            {char.type === 'monster' ? (
                                                <>
                                                    <TouchableOpacity onPress={() => handleUpdateHp(char.combatId, char.currentHp ?? char.hp ?? 0, -1)} className="bg-destructive w-7 h-7 rounded-full items-center justify-center">
                                                        <Text className="text-white font-bold">-</Text>
                                                    </TouchableOpacity>
                                                <HpInput 
                                                    initialValue={char.currentHp ?? char.hp ?? 0} 
                                                    maxHp={char.hp || 0} 
                                                    onUpdate={(val) => handleSetHp(char.combatId, val)} 
                                                />
                                                    <TouchableOpacity onPress={() => handleUpdateHp(char.combatId, char.currentHp ?? char.hp ?? 0, 1)} className="bg-green-600 w-7 h-7 rounded-full items-center justify-center">
                                                        <Text className="text-white font-bold">+</Text>
                                                    </TouchableOpacity>
                                                </>
                                            ) : (
                                                <Text className="text-textColor-primary font-bold">
                                                    HP Atual: {char.currentLife !== undefined ? char.currentLife : (char.life || 0)} / {char.life || 0}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    <TouchableOpacity className="flex-row items-center justify-center py-[10px] border-t border-gold-dark" onPress={() => handleRemoveFromCombat(char.combatId)}>
                                        <Text className="text-destructive font-bold text-sm">Retirar do Combate</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* SEÇÃO 2: JOGADORES NA MESA */}
                    <View className="w-full items-center mb-6 mt-4">
                        <Text className="text-gold text-xl font-bold mb-4">🛡️ Jogadores na Mesa</Text>
                        {characters.length === 0 ? <Text className="text-textColor-secondary mb-4">Nenhum jogador na mesa.</Text> : null}
                        {characters.map(char => (
                            <View key={`player-${char.id}`} className="rounded-lg bg-card mx-[10px] my-[10px] flex-col w-[320px] border-[1px] border-gold">
                                <View className="flex-row p-3 items-center">
                                    <Avatar>
                                        <AvatarImage source={{ uri: char.characterPhoto || undefined }} />
                                        <AvatarFallback textClassname="text-textColor-primary font-bold">{(char.characterName || 'S').charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <View className="ml-4 flex-1">
                                        <Text className="text-textColor-primary text-[18px] font-bold" numberOfLines={1}>{char.characterName}</Text>
                                        <Text className="text-textColor-secondary text-[12px]">{char.characterRace || 'Raça'} • {char.characterClass || 'Classe'} • Lv.{char.level || 1}</Text>
                                    </View>
                                </View>
                                <View className="flex-row border-t border-gold-dark">
                                    <TouchableOpacity className="flex-1 items-center justify-center py-3 border-r border-gold-dark" onPress={() => navigation.navigate('CharacterSheet', { character: char, fromMaster: true, campaign })}>
                                        <Text className="text-textColor-primary font-bold text-sm">Ver Ficha</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 items-center justify-center py-3 border-r border-gold-dark" onPress={() => handleExpelPlayer(char.id, char.characterName, char.ownerId)}>
                                        <Text className="text-destructive font-bold text-sm">Remover</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 items-center justify-center py-3 bg-gold-dark/20 rounded-br-lg" onPress={() => handleAddToCombat(char.id, 'player')}>
                                        <Text className="text-gold font-bold text-sm">⚔️ Batalha</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* SEÇÃO 3: MONSTROS NA MESA */}
                    <View className="w-full items-center mb-6 border-t border-gold-dark pt-6">
                        <Text className="text-gold text-xl font-bold mb-4">🐉 Monstros na Mesa</Text>
                        
                        <TouchableOpacity className="bg-gold-dark px-6 py-2 rounded-full mb-6 shadow-md shadow-black" onPress={openBestiary}>
                            <Text className="text-textColor-primary font-bold text-sm">Importar do Bestiário Global</Text>
                        </TouchableOpacity>

                        {campaignMonsters.length === 0 ? <Text className="text-textColor-secondary mb-4">A mesa está segura. Sem monstros.</Text> : null}
                        {campaignMonsters.map(monster => (
                            <View key={`monster-${monster.id}`} className="rounded-lg bg-card mx-[10px] my-[10px] flex-col w-[320px] border-[1px] border-gold">
                                <View className="flex-row p-3 items-center">
                                    <Avatar>
                                        <AvatarImage source={{ uri: monster.photoUrl || undefined }} />
                                        <AvatarFallback textClassname="text-textColor-primary font-bold">{(monster.name || 'M').charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <View className="ml-4 flex-1">
                                        <Text className="text-textColor-primary text-[18px] font-bold" numberOfLines={1}>{monster.name}</Text>
                                        <Text className="text-textColor-secondary text-[12px]">HP Máximo: {monster.hp || 0}  |  CA: {monster.ac || 10}</Text>
                                    </View>
                                </View>
                                <View className="flex-row border-t border-gold-dark">
                                    <TouchableOpacity className="flex-1 items-center justify-center py-3 border-r border-gold-dark" onPress={() => { setEditingMonster(monster); setMonsterModalVisible(true); }}>
                                        <Text className="text-textColor-primary font-bold text-sm">Editar Ficha</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 items-center justify-center py-3 border-r border-gold-dark" onPress={() => handleDeleteMonster(monster.id)}>
                                        <Text className="text-destructive font-bold text-sm">Remover</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 items-center justify-center py-3 bg-gold-dark/20 rounded-br-lg" onPress={() => handleAddToCombat(monster.id, 'monster')}>
                                        <Text className="text-gold font-bold text-sm">⚔️ Batalha</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <RNModal animationType="slide" transparent={true} visible={isBestiaryVisible} onRequestClose={() => setBestiaryVisible(false)}>
                <SafeAreaView className="flex-1 bg-black/90 justify-center items-center">
                    {/* Adicionamos min-h-[500px] para impedir que a tela "esprema" os resultados para zero */}
                    <View className='m-5 bg-card rounded-[10px] p-[20px] items-center w-11/12 min-h-[500px] max-h-[85%] border-gold border-[1px]'>
                        <Text className="text-gold text-xl font-bold mb-4">Bestiário Global</Text>
                        
                        <ScrollView className="w-full flex-1 mb-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            {isSearching ? (
                                <Text className="text-gold text-center mt-4 font-bold">Buscando no banco de dados...</Text>
                            ) : (
                                <View className="w-full pb-4">
                                    {filteredBestiary.map(monster => (
                                        <View key={monster.id} className="bg-background rounded-lg border border-gold-dark mb-4 overflow-hidden">
                                            <View className="flex-row items-center p-3">
                                                {monster.photoUrl ? (
                                                    <Image 
                                                        source={{ uri: monster.photoUrl }} 
                                                        style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#C49A4A' }} 
                                                    />
                                                ) : (
                                                    <View style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#C49A4A', backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' }}>
                                                        {(monster.name || 'M').charAt(0).toUpperCase()}
                                                    </View>
                                                )}
                                                <View className="ml-3 flex-1">
                                                    <Text className="text-gold font-bold text-lg" numberOfLines={1}>{monster.name}</Text>
                                                    <Text className="text-textColor-secondary text-xs">HP: {monster.hp} | CA: {monster.ac}</Text>
                                                    <Text className="text-textColor-secondary text-[10px] mt-1" numberOfLines={2}>{monster.description}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity className="bg-gold-light p-3 items-center justify-center border-t border-gold-dark" onPress={() => handleAddMonsterToTable(monster)}>
                                                <Text className="text-gold-dark font-bold text-sm">Adicionar à Mesa</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    
                                    {hasSearched && filteredBestiary.length === 0 && (
                                        <Text className="text-textColor-secondary text-center mt-4">Nenhum monstro encontrado com este nome.</Text>
                                    )}
                                    {!hasSearched && (
                                        <Text className="text-textColor-secondary text-center mt-4">Os resultados da sua busca aparecerão aqui em cima.</Text>
                                    )}
                                </View>
                            )}
                        </ScrollView>

                        <View className="flex-row items-center w-full mb-2 gap-2 mt-2">
                            <View className="flex-1">
                                <Input
                                    className='border-gold border-[1px] bg-background rounded-lg w-full text-center'
                                    placeholder='Buscar monstro...'
                                    value={searchBestiary}
                                    onChangeText={setSearchBestiary}
                                    autoCapitalize="none"
                                    onSubmitEditing={handleSearchBestiary}
                                />
                            </View>
                            <TouchableOpacity className="bg-gold-dark px-4 py-3 rounded-lg justify-center items-center" onPress={handleSearchBestiary}>
                                <Text className="text-textColor-primary font-bold">Buscar</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity className="bg-transparent border border-destructive px-6 py-2 rounded-full mt-2 w-full items-center" onPress={() => setBestiaryVisible(false)}>
                            <Text className="text-destructive font-bold">Fechar Bestiário</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </RNModal>

            <CreateMonster
                visible={isMonsterModalVisible}
                onClose={() => {
                    setMonsterModalVisible(false);
                    setEditingMonster(null);
                }}
                onSave={handleSaveLocalMonster}
                initialData={editingMonster || {}} 
            />
        </SafeAreaView>
    );
}