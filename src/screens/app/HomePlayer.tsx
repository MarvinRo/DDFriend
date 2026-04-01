import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import ExitButton from "@/components/ExitButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { cssInterop } from "nativewind";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import CreatEditCaracter from "@/components/CreatEditCaracter";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import LevelEdit from "@/components/LevelUp";


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

    const [isModalVisible, setModalVisible] = useState(false);
    const [isXpModalVisible, setXpModalVisible] = useState(false);
    const [characters, setCharacters] = useState<any[]>([]);
    const [editingCharacter, setEditingCharacter] = useState<any>(null);
    const [editingXpLevel, setEditingXpLevel] = useState<any>(null);

    const loadCharacters = async () => {
        const user = auth().currentUser;
        if (!user) return;

        const query = firestore().collection('characterSheets').where('ownerId', '==', user.uid);

        try {
            const snapshotCache = await query.get({ source: 'cache' });
            if (!snapshotCache.empty) {
                setCharacters(snapshotCache.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                return;
            }
        } catch (e) {
            console.log("Cache vazio, buscando do servidor...");
        }

        try {
            const snapshotServer = await query.get({ source: 'server' });
            setCharacters(snapshotServer.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Erro ao carregar personagens:", error);
        }
    };

    useEffect(() => {
        loadCharacters();
    }, []);

    const handleSaveCharacter = async (sheetData: any) => {
        const user = auth().currentUser;
        if (!user) return;

        try {
            if (editingCharacter) {
                await firestore().collection('characterSheets').doc(editingCharacter.id).update({
                    ...sheetData,
                });
            } else {
                await firestore().collection('characterSheets').add({
                    ...sheetData,
                    ownerId: user.uid,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    level: 1,
                    experience: 0,
                });
            }
            loadCharacters(); // Atualiza a lista localmente
        } catch (error) {
            console.error("Erro ao salvar personagem:", error);
        }
    };

    const handleSaveXpLevel = async (sheetData: any) => {
        if (!editingXpLevel) return;
        try {
            await firestore().collection('characterSheets').doc(editingXpLevel.id).update({
                level: sheetData.level,
                experience: sheetData.experience,
            });
            loadCharacters(); // Atualiza a lista localmente
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
                            await firestore().collection('characterSheets').doc(id).delete();
                            loadCharacters();
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
        <SafeAreaView className='flex-1 bg-background '>
            <View className='flex-1 items-center mt-8 w-full'>
                <View className="items-center justify-center mb-8">
                    <Text className='text-textColor-primary text-[20px]'>Bem Vindo</Text>
                    <Text className='text-textColor-primary text-[24px]'>Aventureiro</Text>
                    <View className=' flex-row items-center mt-6 mb-2 px-2'>
                        <View className='w-16 h-0.5 bg-gold-dark' />
                        <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                        <View className='w-16 h-0.5 bg-gold-dark' />
                    </View>
                </View>
                <ScrollView className="flex-1 w-full" contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                    <View className='items-center justify-center'>
                        <Text className="text-textColor-secondary text-[24px]">D&D Frinds -</Text>
                        <Text className="text-textColor-secondary text-[24px]">Seu companheiro de mesa.</Text>
                    </View>

                    <View className='flex-1 w-full items-center'>
                        <Text className="text-textColor-secondary text-[18px] mb-4">Acesso Rápido</Text>
                        <View className="flex-row items-center justify-center gap-5">
                            <TouchableOpacity className="bg-card size-48 items-center justify-center rounded-lg border-[1px] border-gold" onPress={() => {
                                setEditingCharacter(null);
                                setModalVisible(true);
                            }}>
                                <View className="bg-gold-light w-20 h-20 items-center justify-center rounded-full mb-4">
                                    <SvgXml width={40} height={40} xml={swordIcon} />
                                </View>
                                <Text className="text-textColor-primary">Criar Ficha/Personagem</Text>
                                <View className=' flex-row items-center mt-6 mb-2 px-2'>
                                    <View className='w-16 h-0.5 bg-gold-dark' />
                                    <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                                    <View className='w-16 h-0.5 bg-gold-dark' />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-card size-48 items-center justify-center rounded-lg border-[1px] border-gold"
                                onPress={() => navigation.navigate('Books')}>
                                <View className="bg-gold-light w-20 h-20 items-center justify-center rounded-full mb-4">
                                    <SvgXml width={40} height={40} xml={bookIcon} />
                                </View>
                                <Text className="text-textColor-primary">Livros</Text>
                                <View className=' flex-row items-center mt-6 mb-2 px-2'>
                                    <View className='w-16 h-0.5 bg-gold-dark' />
                                    <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                                    <View className='w-16 h-0.5 bg-gold-dark' />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <ScrollView className="flex-1 w-full mt-8" contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                            {characters.map((char) => (
                                <View key={char.id} className="rounded-lg bg-card mx-[10px] my-[10px] flex-col w-[300px] h-[120px] border-[1px] border-gold">
                                    <View className="flex-row p-3 ">
                                        <TouchableOpacity className="flex-1 items-center flex-row gap-4" onPress={() => navigation.navigate('CharacterSheet', { character: char })}>
                                            <Avatar>
                                                <AvatarImage
                                                    source={{
                                                        uri: char.characterPhoto || profileXml,
                                                    }}
                                                />
                                                <AvatarFallback textClassname="text-textColor-primary font-bold">
                                                    {(char.characterName || char.nome || char.name || 'S').charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <View>
                                                <Text className="text-textColor-primary text-[20px]">{char.characterName || char.nome || char.name || 'Sem Nome'}</Text>
                                                {(char.characterRace || char.characterClass || char.raca || char.classe) && (
                                                    <Text className="text-textColor-primary text-[15px]">
                                                        {char.characterRace || char.raca} {(char.characterRace || char.raca) && (char.characterClass || char.classe) ? '/' : ''} {char.characterClass || char.classe}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                        <View className="w-[50px] justify-between items-center">
                                            <TouchableOpacity className=" bg-gold w-12 h-12 rounded-full items-center justify-center" onPress={() => {
                                                setEditingXpLevel(char);
                                                setXpModalVisible(true);
                                            }}>
                                                <Text className="color-white font-bold text-4">Lv.{char.level || 0}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View className=' flex-row justify-center items-center'>
                                        <View className='w-[120px] h-0.5 bg-gold-dark' />
                                        <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                                        <View className='w-[120px] h-0.5 bg-gold-dark' />
                                    </View>
                                    <View className="flex-row">
                                        <TouchableOpacity className="flex-1 flex-row items-center justify-center p-[10px] gap-2" onPress={() => handleEditCharacter(char)} >
                                            <SvgXml className="text-textColor-primary" xml={editIconXml} width="16" height="16" />
                                            <Text className="text-textColor-primary">Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity className="flex-1 flex-row items-center justify-center p-[10px] gap-2" onPress={() => handleDeleteCharacter(char.id)}>
                                            <SvgXml className="text-destructive" xml={deleteIconXml} width="16" height="16" />
                                            <Text className="text-destructive">Excluir</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View >
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
            <ExitButton />
        </SafeAreaView >

    );
}