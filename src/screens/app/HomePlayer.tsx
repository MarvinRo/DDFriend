import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import ExitButton from "@/components/ExitButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { cssInterop } from "nativewind";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import CreatEditCaracter from "@/components/CreatEditCaracter";
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import { auth, db, docsWithId } from '@/lib/firebase';
import { useNavigation } from "@react-navigation/native";
import LevelEdit from "@/components/LevelUp";
import InboxModal from "@/components/InboxModal";


// Habilita o uso de className no SvgXml mapeando as classes para a prop 'style'
cssInterop(SvgXml, {
    className: 'style',
});

export default function HomePlayer({ onPressLevel }: any) {
    const swordIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-swords-icon lucide-swords"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>`
    const bookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text-icon lucide-book-open-text"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>`
    const deleteIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
    const editIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`
    const profileXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
    const mailIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`

    const [isModalVisible, setModalVisible] = useState(false);
    const [isXpModalVisible, setXpModalVisible] = useState(false);
    const [isInboxVisible, setInboxVisible] = useState(false);
    const [characters, setCharacters] = useState<any[]>([]);
    const [editingCharacter, setEditingCharacter] = useState<any>(null);
    const [editingXpLevel, setEditingXpLevel] = useState<any>(null);
    const [hasNewInvites, setHasNewInvites] = useState(false);
    // Situação da lista de fichas, exibida na tela quando não há fichas para mostrar
    const [listStatus, setListStatus] = useState<{ state: 'loading' | 'ready' | 'error' | 'no-user'; email?: string | null; fromCache?: boolean; error?: string }>({ state: 'loading' });

    useEffect(() => {
        // Espera o Firebase Auth confirmar o usuário antes de assinar as fichas: se a tela montar
        // antes disso, auth.currentUser ainda é null e a lista ficaria vazia até reiniciar o app
        let unsubscribeSheets: (() => void) | undefined;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            unsubscribeSheets?.();
            unsubscribeSheets = undefined;

            if (!user) {
                setCharacters([]);
                setListStatus({ state: 'no-user' });
                return;
            }

            setListStatus({ state: 'loading', email: user.email });
            unsubscribeSheets = onSnapshot(
                query(collection(db, 'characterSheets'), where('ownerId', '==', user.uid)),
                (snapshot) => {
                    if (!snapshot) return;
                    setCharacters(docsWithId(snapshot));
                    setListStatus({ state: 'ready', email: user.email, fromCache: snapshot.metadata.fromCache });
                },
                (error: any) => {
                    console.error("Erro ao carregar personagens:", error);
                    setListStatus({ state: 'error', email: user.email, error: `${error?.code || ''} ${error?.message || 'Erro desconhecido'}`.trim() });
                }
            );
        });

        return () => {
            unsubscribeAuth();
            unsubscribeSheets?.();
        };
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // Observa as mesas onde o jogador foi convidado em tempo real
        const unsubscribe = onSnapshot(
            query(collection(db, 'campaigns'), where('playerIds', 'array-contains', user.uid)),
            (snapshot) => {
                if (snapshot) {
                    const campaignsData = docsWithId(snapshot);
                    const acceptedCampaignIds = characters.filter((c: any) => c.campaignId).map((c: any) => c.campaignId);
                    const pending = campaignsData.filter(c => !acceptedCampaignIds.includes(c.id));
                    setHasNewInvites(pending.length > 0);
                }
            }, (error) => console.error("Erro ao ouvir convites em tempo real:", error));

        return () => unsubscribe();
    }, [characters]); // Atualiza o observer caso a lista de fichas (e convites aceitos) mude

    const handleSaveCharacter = async (sheetData: any) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            if (editingCharacter) {
                await updateDoc(doc(db, 'characterSheets', editingCharacter.id), {
                    ...sheetData,
                });
            } else {
                await addDoc(collection(db, 'characterSheets'), {
                    ...sheetData,
                    ownerId: user.uid,
                    createdAt: serverTimestamp(),
                    level: 1,
                    experience: 0,
                    efficiencyBonus: 2,
                });
            }
        } catch (error) {
            console.error("Erro ao salvar personagem:", error);
        }
    };

    const handleSaveXpLevel = async (sheetData: any) => {
        if (!editingXpLevel) return;
        try {
            await updateDoc(doc(db, 'characterSheets', editingXpLevel.id), {
                level: sheetData.level,
                experience: sheetData.experience,
                efficiencyBonus: sheetData.efficiencyBonus,
            });
        } catch (error) {
            console.error("Erro ao atualizar XP/Nível:", error);
            Alert.alert("Erro", "Não foi possível atualizar a experiência.");
        }
    };

    const handleDeleteCharacter = (id: string) => {
        Alert.alert(
            "Excluir Personagem",
            "Tem certeza que deseja excluir esta ficha? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'characterSheets', id));
                        } catch (error) {
                            console.error("Erro ao excluir personagem:", error);
                            Alert.alert("Erro", "Não foi possível excluir a ficha.");
                        }
                    }
                }
            ]
        );
    };

    const handleEditCharacter = (char: any) => {
        setEditingCharacter(char);
        setModalVisible(true);
    };

    const navigation = useNavigation<any>();

    return (
        <SafeAreaView className='flex-1 bg-background'>
            {/* Barra superior: Convites à esquerda e Sair à direita, na mesma linha */}
            <View className='flex-row items-center justify-between px-4 mt-12'>
                <TouchableOpacity onPress={() => setInboxVisible(true)} className="flex-row items-center bg-card border border-gold-dark rounded-full px-4 h-12">
                    <View className="relative">
                        <SvgXml xml={mailIconXml} width="18" height="18" className="text-textColor-primary" />
                        {hasNewInvites && (
                            <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-background" />
                        )}
                    </View>
                    <Text className="text-textColor-primary ml-2 text-sm font-bold">Convites</Text>
                </TouchableOpacity>
                <ExitButton inline />
            </View>

            <View className='flex-1 w-full px-4'>
                {/* Saudação compacta */}
                <View className="items-center mt-2 mb-4">
                    <Text className='text-gold font-bold text-[20px]'>Bem-vindo, Aventureiro</Text>
                    <Text className="text-textColor-secondary text-xs mt-0.5">D&D Friends · Seu companheiro de mesa</Text>
                    <View className='flex-row items-center mt-2'>
                        <View className='w-12 h-0.5 bg-gold-dark' />
                        <View className='w-1.5 h-1.5 bg-gold mx-2 origin-center rotate-45' />
                        <View className='w-12 h-0.5 bg-gold-dark' />
                    </View>
                </View>

                {/* Acesso rápido em botões compactos */}
                <View className="flex-row gap-3 mb-4">
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center gap-2 bg-gold-light rounded-lg py-2.5 border border-gold"
                        onPress={() => {
                            setEditingCharacter(null);
                            setModalVisible(true);
                        }}
                    >
                        <SvgXml width={18} height={18} xml={swordIcon} />
                        <Text className="text-gold-dark font-bold text-sm">Nova ficha</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 flex-row items-center justify-center gap-2 bg-card rounded-lg py-2.5 border border-gold"
                        onPress={() => navigation.navigate('Books')}
                    >
                        <SvgXml width={18} height={18} xml={bookIcon} className="text-textColor-primary" />
                        <Text className="text-textColor-primary font-bold text-sm">Livros</Text>
                    </TouchableOpacity>
                </View>

                {/* Lista de fichas: ocupa o resto da tela e é a única parte que rola */}
                <View className="flex-row items-baseline justify-between mb-2">
                    <Text className="text-gold font-bold text-[16px]">Suas fichas</Text>
                    <Text className="text-textColor-secondary text-xs">{characters.length} {characters.length === 1 ? 'personagem' : 'personagens'}</Text>
                </View>
                {characters.length === 0 ? (
                    <Text className="text-textColor-secondary text-xs text-center px-4 mt-4">
                        {listStatus.state === 'loading' && 'Carregando fichas...'}
                        {listStatus.state === 'no-user' && 'Nenhum usuário logado.'}
                        {listStatus.state === 'error' && `Erro ao carregar: ${listStatus.error}`}
                        {listStatus.state === 'ready' && `Nenhuma ficha encontrada para ${listStatus.email || 'esta conta'}${listStatus.fromCache ? ' (dados do cache, sem conexão)' : ''}. Toque em "Nova ficha" para criar.`}
                    </Text>
                ) : null}
                <ScrollView
                    className="flex-1 w-full"
                    contentContainerStyle={{ paddingBottom: 20 }}
                    // Barra de rolagem sempre visível para indicar que há mais fichas
                    showsVerticalScrollIndicator
                    persistentScrollbar
                    indicatorStyle="white"
                >
                    {characters.map((char) => {
                        const name = char.characterName || char.nome || char.name || 'Sem Nome';
                        const race = char.characterRace || char.raca;
                        const charClass = char.characterClass || char.classe;
                        return (
                            <View key={char.id} className="flex-row items-center rounded-lg bg-card border border-gold mb-2 pl-3 pr-1 py-2">
                                <TouchableOpacity
                                    className="flex-1 flex-row items-center gap-3"
                                    onPress={() => navigation.navigate('CharacterSheet', { character: char })}
                                >
                                    <Avatar>
                                        <AvatarImage source={{ uri: char.characterPhoto || profileXml }} />
                                        <AvatarFallback textClassname="text-textColor-primary font-bold">
                                            {name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <View className="flex-1">
                                        <Text className="text-textColor-primary text-[16px] font-bold" numberOfLines={1}>{name}</Text>
                                        {race || charClass ? (
                                            <Text className="text-textColor-secondary text-xs" numberOfLines={1}>
                                                {[race, charClass].filter(Boolean).join(' / ')}
                                            </Text>
                                        ) : null}
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-gold rounded-full px-2.5 py-1 mx-1"
                                    onPress={() => {
                                        setEditingXpLevel(char);
                                        setXpModalVisible(true);
                                    }}
                                    accessibilityLabel={`Nível e experiência de ${name}`}
                                >
                                    <Text className="color-white font-bold text-xs">Lv.{char.level || 0}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="p-2" onPress={() => handleEditCharacter(char)} accessibilityLabel={`Editar ${name}`} hitSlop={6}>
                                    <SvgXml className="text-textColor-primary" xml={editIconXml} width="18" height="18" />
                                </TouchableOpacity>
                                <TouchableOpacity className="p-2" onPress={() => handleDeleteCharacter(char.id)} accessibilityLabel={`Excluir ${name}`} hitSlop={6}>
                                    <SvgXml className="text-destructive" xml={deleteIconXml} width="18" height="18" />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
            <CreatEditCaracter
                visible={isModalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditingCharacter(null);
                }}
                onSave={handleSaveCharacter}
                initialData={editingCharacter || {}} />
            <LevelEdit
                visible={isXpModalVisible}
                onClose={() => {
                    setXpModalVisible(false);
                    setEditingXpLevel(null);
                }}
                onSave={handleSaveXpLevel}
                initialData={{
                    level: editingXpLevel?.level || 0,
                    experience: editingXpLevel?.experience || editingXpLevel?.xp || 0
                }} />
            <InboxModal 
                visible={isInboxVisible} 
                onClose={() => setInboxVisible(false)} 
                characters={characters} 
            onUpdate={() => {}} 
            />
        </SafeAreaView >

    );
}