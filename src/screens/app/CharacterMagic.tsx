import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import firestore from '@react-native-firebase/firestore';

type SpellLevelData = {
    level: number;
    spells: string;
    slotsCurrent: string;
    slotsMax: string;
};

export default function CharacterMagic({ route }: any) {
    // Ícones padronizados
    const arrowLeftXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C49A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`
    const sheetIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`
    const bagItensXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-backpack-icon lucide-backpack"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>`
    const bookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text-icon lucide-book-open-text"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>`


    const navigation = useNavigation<any>();
    const character = route?.params?.character || {};

    const [cantrips, setCantrips] = useState('');
    const [talents, setTalents] = useState('');
    const [spellLevels, setSpellLevels] = useState<SpellLevelData[]>(
        Array.from({ length: 9 }, (_, i) => ({
            level: i + 1, spells: '', slotsCurrent: '', slotsMax: ''
        }))
    );

    const [magicDocId, setMagicDocId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Busca as magias da subcoleção "magic" no Firebase
    useEffect(() => {
        if (!character.id) return;

        const unsubscribe = firestore()
            .collection('characterSheets')
            .doc(character.id)
            .collection('spellsAndAbilities')
            .onSnapshot(
                (snapshot) => {
                    if (snapshot && !snapshot.empty) {
                        const doc = snapshot.docs[0];
                        setMagicDocId(doc.id);
                        const data = doc.data();
                        setCantrips(data.cantrips || '');
                        setTalents(data.talents || '');
                        if (data.spellLevels && Array.isArray(data.spellLevels)) {
                            setSpellLevels(data.spellLevels);
                        }
                        console.log(data);
                    }
                },
                (error) => {
                    console.error("Erro no onSnapshot de magias:", error);
                }
            );

        return () => unsubscribe();
    }, [character.id]);

    const updateSpellLevel = (level: number, field: keyof SpellLevelData, value: string) => {
        setSpellLevels(prev => prev.map(lvl =>
            lvl.level === level ? { ...lvl, [field]: value } : lvl
        ));
    };

    const saveMagic = async () => {
        if (!character.id) return;
        setIsSaving(true);

        const magicData = { cantrips, spellLevels, talents };

        try {
            const magicRef = firestore().collection('characterSheets').doc(character.id).collection('spellsAndAbilities');

            if (magicDocId) {
                await magicRef.doc(magicDocId).update(magicData);
            } else {
                const newDoc = await magicRef.add(magicData);
                setMagicDocId(newDoc.id);
            }
        } catch (error) {
            console.error("Erro ao salvar magias:", error);
            Alert.alert("Erro", "Não foi possível salvar as magias do personagem.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-background p-4'>
            <View className="flex-1 items-center justify-center">
                <View className="w-full bg-card rounded-lg p-4 border border-gold mb-18 flex-1">
                    <View className="flex-row justify-between items-center mb-4 border-b border-gold pb-2">
                        <Text className="text-gold font-bold text-lg">Grimório de Magias</Text>
                        <TouchableOpacity onPress={saveMagic} disabled={isSaving} className="bg-gold-light px-3 py-1 rounded">
                            <Text className="text-gold-dark font-bold text-sm">{isSaving ? 'Salvando...' : 'Salvar'}</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={true} nestedScrollEnabled={true} className="flex-1">
                        <View className="mb-6 border-b border-gold pb-4">
                            <Text className="text-gold font-bold mb-2">Talentos e Habilidades</Text>
                            <ScrollView showsVerticalScrollIndicator={true} className="h-[150px]" nestedScrollEnabled={true}>
                                <TextInput
                                    multiline
                                    textAlignVertical="top"
                                    className="text-textColor-primary text-[16px] min-h-[150px] border border-gold-light rounded p-2 bg-background"
                                    value={talents}
                                    onChangeText={setTalents}
                                    onBlur={saveMagic}
                                    placeholder="Ex: Visão no Escuro, Ataque Furtivo, Atleta, Sortudo..."
                                    placeholderTextColor="#666"
                                />
                            </ScrollView>
                        </View>

                        <View className="mb-6 border-b border-gold pb-4">
                            <Text className="text-gold font-bold mb-2">Truques (Nível 0)</Text>
                            <ScrollView showsVerticalScrollIndicator={true} className="h-[120px]" nestedScrollEnabled={true}>
                                <TextInput
                                    multiline
                                    textAlignVertical="top"
                                    className="text-textColor-primary text-[16px] min-h-[120px] border border-gold-light rounded p-2 bg-background"
                                    value={cantrips}
                                    onChangeText={setCantrips}
                                    onBlur={saveMagic}
                                    placeholder="Ex: Raio de Fogo, Luz, Prestidigitação..."
                                    placeholderTextColor="#666"
                                />
                            </ScrollView>
                        </View>

                        {spellLevels.map((lvl) => (
                            <View key={lvl.level} className="mb-6 border-b border-gold pb-4">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-gold font-bold">Magias de Nível {lvl.level}</Text>
                                    <View className="flex-row items-center gap-1">
                                        <Text className="text-textColor-secondary text-xs mr-1">Espaços:</Text>
                                        <TextInput className="bg-background border border-gold-light text-textColor-primary text-center rounded w-8 h-8 p-0" keyboardType="numeric" value={lvl.slotsCurrent} onChangeText={(val) => updateSpellLevel(lvl.level, 'slotsCurrent', val.replace(/[^0-9]/g, ''))} onBlur={saveMagic} />
                                        <Text className="text-textColor-secondary font-bold text-lg mx-1">/</Text>
                                        <TextInput className="bg-background border border-gold-light text-textColor-primary text-center rounded w-8 h-8 p-0" keyboardType="numeric" value={lvl.slotsMax} onChangeText={(val) => updateSpellLevel(lvl.level, 'slotsMax', val.replace(/[^0-9]/g, ''))} onBlur={saveMagic} />
                                    </View>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={true} className="h-[150px]" nestedScrollEnabled={true}>
                                    <TextInput
                                        multiline
                                        textAlignVertical="top"
                                        className="text-textColor-primary text-[16px] min-h-[150px] border border-gold-light rounded p-2 bg-background"
                                        value={lvl.spells}
                                        onChangeText={(val) => updateSpellLevel(lvl.level, 'spells', val)}
                                        onBlur={saveMagic}
                                        placeholder={`Anotações e magias do nível ${lvl.level}...`}
                                        placeholderTextColor="#666"
                                    />
                                </ScrollView>
                            </View>
                        ))}

                        {/* Espaçador final para garantir que o scroll chegue até o fundo confortavelmente */}
                        <View className="h-4" />
                    </ScrollView>
                </View>

                {/* Barra de Navegação Inferior */}
                <View className="absolute bottom-0 flex-row justify-center w-full h-18 items-center bg-card rounded-lg p-2 border border-gold gap-2">
                    <TouchableOpacity className='w-[33%] border border-t-gold border-x-transparent border-b-transparent justify-center items-center flex-row gap-2'
                        onPress={() => navigation.navigate('CharacterSheet', { character })}>
                        <SvgXml className="color-gold mb-3" xml={sheetIconXml} width="20px" height="20px" />
                        <Text className="text-gold font-bold text-lg mb-2 pb-1">Ficha</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='w-[33%] border border-t-gold border-x-transparent border-b-transparent justify-center items-center flex-row gap-2'
                        onPress={() => navigation.navigate('CharacterBag', { character })}>
                        <SvgXml className="color-gold mb-3" xml={bagItensXml} width="20px" height="20px" />
                        <Text className="text-gold font-bold text-lg mb-2 pb-1">Bolsa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='w-[33%] border border-t-gold border-x-transparent border-b-transparent justify-center items-center flex-row gap-2'
                    onPress={() => navigation.navigate('Books')}>
                        <SvgXml className="color-gold mb-3" xml={bookIcon} width="20px" height="20px" />
                        <Text className="text-gold font-bold text-lg mb-2 pb-1">Livros</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}