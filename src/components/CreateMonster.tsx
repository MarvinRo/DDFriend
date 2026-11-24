import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, Text, View, ScrollView, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { DND_API_BASE, translateText } from '@/lib/dndApi';

interface CreateMonsterProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}
const deleteIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`

// A API devolve armor_class como array de objetos ({ type, value }) ou, em versões antigas, como número
const parseArmorClass = (armorClass: any): number | null => {
    const value = Array.isArray(armorClass) ? armorClass[0]?.value : armorClass;
    return typeof value === 'number' ? value : null;
};

// CR pode ser fracionário (0.125, 0.25, 0.5): exibe como 1/8, 1/4, 1/2
const formatChallengeRating = (cr: number | null | undefined): string => {
    if (cr === null || cr === undefined) return '';
    const fractions: Record<number, string> = { 0.125: '1/8', 0.25: '1/4', 0.5: '1/2' };
    return fractions[cr] ?? String(cr);
};

// Aceita "1/4", "0,25", "0.25" ou "5"; vazio ou inválido vira null
const parseChallengeRating = (text: string): number | null => {
    const clean = text.trim().replace(',', '.');
    if (!clean) return null;
    const fraction = clean.match(/^(\d+)\s*\/\s*(\d+)$/);
    const value = fraction ? Number(fraction[1]) / Number(fraction[2]) : Number(clean);
    return Number.isFinite(value) && value >= 0 ? value : null;
};

export default function CreateMonster({ visible, onClose, onSave, initialData }: CreateMonsterProps) {
    const [name, setName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [hp, setHp] = useState('');
    const [ac, setAc] = useState('');
    const [str, setStr] = useState('');
    const [dex, setDex] = useState('');
    const [con, setCon] = useState('');
    const [int, setInt] = useState('');
    const [wis, setWis] = useState('');
    const [cha, setCha] = useState('');
    const [challengeRating, setChallengeRating] = useState('');
    const [xp, setXp] = useState('');
    // Identificador estável do monstro na API (ex.: "adult-red-dragon"), usado para busca e duplicidade
    const [apiIndex, setApiIndex] = useState('');

    const [apiSearch, setApiSearch] = useState('');
    const [apiResults, setApiResults] = useState<any[]>([]);
    const [isFetchingApi, setIsFetchingApi] = useState(false);
    const [allMonsters, setAllMonsters] = useState<any[]>([]);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setName(initialData.name || '');
            setPhotoUrl(initialData.photoUrl || '');
            setDescription(initialData.description || '');
            setHp(String(initialData.hp || ''));
            setAc(String(initialData.ac || ''));
            setStr(String(initialData.str || ''));
            setDex(String(initialData.dex || ''));
            setCon(String(initialData.con || ''));
            setInt(String(initialData.int || ''));
            setWis(String(initialData.wis || ''));
            setCha(String(initialData.cha || ''));
            setChallengeRating(formatChallengeRating(initialData.challengeRating));
            setXp(initialData.xp !== undefined && initialData.xp !== null ? String(initialData.xp) : '');
            setApiIndex(initialData.apiIndex || '');
        } else {
            handleReset();
        }
    }, [initialData, visible]);

    // Busca a lista base de monstros da API ao abrir o modal
    useEffect(() => {
        if (visible && allMonsters.length === 0) {
            fetch(`${DND_API_BASE}/api/2014/monsters`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then(data => setAllMonsters(data.results || []))
                .catch(err => console.error("Erro ao carregar lista D&D API:", err));
        }
    }, [visible]);

    // Filtra localmente os monstros conforme o mestre digita
    useEffect(() => {
        if (apiSearch.length >= 2) {
            const filtered = allMonsters.filter(m => m.name.toLowerCase().includes(apiSearch.toLowerCase())).slice(0, 5);
            setApiResults(filtered);
        } else {
            setApiResults([]);
        }
    }, [apiSearch, allMonsters]);

    const handleReset = () => {
        setName('');
        setPhotoUrl('');
        setDescription('');
        setHp('');
        setAc('');
        setStr('');
        setDex('');
        setCon('');
        setInt('');
        setWis('');
        setCha('');
        setChallengeRating('');
        setXp('');
        setApiIndex('');
        setApiSearch('');
        setApiResults([]);
    };

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert("Aviso", "O monstro precisa de um nome.");
            return;
        }

        const data = {
            name,
            photoUrl,
            description,
            hp: Number(hp) || 0,
            ac: Number(ac) || 0,
            str: Number(str) || 10,
            dex: Number(dex) || 10,
            con: Number(con) || 10,
            int: Number(int) || 10,
            wis: Number(wis) || 10,
            cha: Number(cha) || 10,
            challengeRating: parseChallengeRating(challengeRating),
            xp: Number(xp) || 0,
            apiIndex: apiIndex || null,
        };

        onSave(data);
        handleReset();
        onClose();
    };

    const closeAndReset = () => {
        handleReset();
        onClose();
    }

    const handleSelectApiMonster = async (index: string) => {
        setIsFetchingApi(true);
        setApiSearch('');
        setApiResults([]);
        try {
            const res = await fetch(`${DND_API_BASE}/api/2014/monsters/${index}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            setApiIndex(data.index || index);
            setName(data.name || '');
            setHp(String(data.hit_points || ''));
            setAc(String(parseArmorClass(data.armor_class) ?? 10));
            setChallengeRating(formatChallengeRating(data.challenge_rating));
            setXp(data.xp !== undefined && data.xp !== null ? String(data.xp) : '');
            setStr(String(data.strength || '10'));
            setDex(String(data.dexterity || '10'));
            setCon(String(data.constitution || '10'));
            setInt(String(data.intelligence || '10'));
            setWis(String(data.wisdom || '10'));
            setCha(String(data.charisma || '10'));

            // Dicionários para termos comuns de D&D
            const sizeMap: any = { Tiny: 'Miúdo', Small: 'Pequeno', Medium: 'Médio', Large: 'Grande', Huge: 'Enorme', Gargantuan: 'Imenso' };
            const typeMap: any = { beast: 'Besta', dragon: 'Dragão', aberration: 'Aberração', celestial: 'Celestial', construct: 'Construto', elemental: 'Elemental', fey: 'Fada', fiend: 'Corruptor', giant: 'Gigante', humanoid: 'Humanoide', monstrosity: 'Monstruosidade', ooze: 'Limo', plant: 'Planta', undead: 'Morto-vivo', swarm: 'Enxame' };
            const alignMap: any = { 'lawful good': 'Leal e Bom', 'neutral good': 'Neutro e Bom', 'chaotic good': 'Caótico e Bom', 'lawful neutral': 'Leal e Neutro', 'neutral': 'Neutro', 'chaotic neutral': 'Caótico e Neutro', 'lawful evil': 'Leal e Mau', 'neutral evil': 'Neutro e Mau', 'chaotic evil': 'Caótico e Mau', 'unaligned': 'Sem Alinhamento', 'any alignment': 'Qualquer Alinhamento' };

            const tSize = sizeMap[data.size] || data.size;
            const tType = typeMap[data.type] || data.type;
            const tAlign = alignMap[data.alignment] || data.alignment;

            let descRaw = '';
            if (data.size && data.type && data.alignment) {
                descRaw += `${tSize} ${tType}, ${tAlign}\n\n`;
            }
            if (data.special_abilities) {
                descRaw += '--- Habilidades ---\n';
                data.special_abilities.forEach((a: any) => descRaw += `• ${a.name}: ${a.desc}\n`);
            }
            if (data.actions) {
                descRaw += '\n--- Ações ---\n';
                data.actions.forEach((a: any) => descRaw += `• ${a.name}: ${a.desc}\n`);
            }
            if (data.reactions?.length) {
                descRaw += '\n--- Reações ---\n';
                data.reactions.forEach((a: any) => descRaw += `• ${a.name}: ${a.desc}\n`);
            }
            if (data.legendary_actions?.length) {
                descRaw += '\n--- Ações Lendárias ---\n';
                data.legendary_actions.forEach((a: any) => descRaw += `• ${a.name}: ${a.desc}\n`);
            }

            // Realiza a tradução do nome e de todas as habilidades de uma só vez
            const translatedName = await translateText(data.name);
            const translatedDesc = await translateText(descRaw);

            setName(translatedName || data.name);
            setDescription(translatedDesc || descRaw);

            if (data.image) {
                setPhotoUrl(`${DND_API_BASE}${data.image}`);
            } else {
                setPhotoUrl('');
            }
        } catch (error) {
            Alert.alert("Erro", "Falha ao buscar detalhes do monstro na API.");
        } finally {
            setIsFetchingApi(false);
        }
    };

    const removeImage = () => {
        Alert.alert(
            "Remover Foto",
            "Tem certeza que deseja remover a foto do monstro?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: () => setPhotoUrl('')
                }
            ]
        );
    };

    const selectImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 0.5,
            maxWidth: 600,
            maxHeight: 600,
            includeBase64: true,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) return;

            if (response.assets && response.assets.length > 0) {
                const file = response.assets[0];
                const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

                if (file.fileSize && file.fileSize > maxSizeInBytes) {
                    Alert.alert(
                        "Arquivo muito grande",
                        `A imagem atual possui ${(file.fileSize / (1024 * 1024)).toFixed(2)}MB. O limite é 10MB.`
                    );
                    return;
                }
                const mimeType = file.type || 'image/jpeg';
                setPhotoUrl(`data:${mimeType};base64,${file.base64}`);
            }
        });
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={closeAndReset}>
            <SafeAreaView className="flex-1 bg-black/80">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <View className='my-5 bg-card rounded-[10px] p-[25px] items-center justify-center flex-1 max-h-[85%] border-gold border-[1px] w-11/12'>
                        <ScrollView className='w-full flex-1 mb-4' showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
                            <Text className='text-textColor-primary text-[24px] font-bold mb-4 text-center'>
                                {initialData && initialData.id ? 'Editar Monstro' : 'Criar Monstro'}
                            </Text>

                            {/* Input de Busca da API Oficial */}
                            {!initialData?.id && (
                                <View className='w-full mb-6 z-50'>
                                    <Text className='text-gold font-bold text-xs mb-1 text-center'>Auto-completar D&D 5e (nomes em inglês)</Text>
                                    <Input
                                        className='border-gold border-[1px] bg-background rounded-lg w-full text-center'
                                        placeholder='Buscar monstro (ex: Goblin...)'
                                        value={apiSearch}
                                        onChangeText={setApiSearch}
                                        autoCapitalize="none"
                                    />
                                    {isFetchingApi && <Text className="text-gold mt-1 text-center text-xs">Importando e traduzindo dados...</Text>}
                                    {apiResults.length > 0 && (
                                        <ScrollView 
                                            className="bg-background border border-gold rounded-lg w-full mt-1 z-50 max-h-[200px]"
                                            nestedScrollEnabled={true}
                                            keyboardShouldPersistTaps="handled"
                                        >
                                            {apiResults.map((monster) => (
                                                <TouchableOpacity
                                                    key={monster.index}
                                                    className="p-3 border-b border-gray-800"
                                                    onPress={() => handleSelectApiMonster(monster.index)}
                                                >
                                                    <Text className="text-textColor-primary font-bold">{monster.name}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    )}
                                </View>
                            )}

                            <View className="items-center mb-4">
                                <TouchableOpacity onPress={selectImage}>
                                    {photoUrl ? (
                                        <Image
                                            source={{ uri: photoUrl }}
                                            className="w-[120px] h-[120px] rounded-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View className="w-[120px] h-[120px] rounded-full bg-slate-800 justify-center items-center border border-dashed border-gray-100">
                                            <Text className="text-gray-100 text-center text-sm">Adicionar Foto</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>

                                {photoUrl ? (
                                    <TouchableOpacity
                                        onPress={removeImage}
                                        className="flex-row items-center mt-2 bg-destructive py-1.5 px-3 rounded-lg"
                                    >
                                        <SvgXml xml={deleteIconXml} width="16" height="16" stroke="#f5f5f5" />
                                        <Text className="text-gray-100 ml-2 font-bold text-sm">Remover Foto</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>

                            <Input className='border-gold border-[1px] rounded-lg w-full mb-3' placeholder='Nome do Monstro' value={name} onChangeText={setName} />

                            <View className="flex-row justify-between w-full mb-3">
                                <View className="w-[48%]">
                                    <Text className="text-textColor-secondary text-xs mb-1">Pontos de Vida (HP)</Text>
                                    <Input className='border-gold border-[1px] rounded-lg w-full text-center' placeholder='HP' keyboardType="numeric" value={hp} onChangeText={setHp} />
                                </View>
                                <View className="w-[48%]">
                                    <Text className="text-textColor-secondary text-xs mb-1">Classe de Armadura (CA)</Text>
                                    <Input className='border-gold border-[1px] rounded-lg w-full text-center' placeholder='CA' keyboardType="numeric" value={ac} onChangeText={setAc} />
                                </View>
                            </View>

                            <View className="flex-row justify-between w-full mb-3">
                                <View className="w-[48%]">
                                    <Text className="text-textColor-secondary text-xs mb-1">Nível de Desafio (ND)</Text>
                                    <Input className='border-gold border-[1px] rounded-lg w-full text-center' placeholder='ex: 1/4' value={challengeRating} onChangeText={setChallengeRating} />
                                </View>
                                <View className="w-[48%]">
                                    <Text className="text-textColor-secondary text-xs mb-1">Experiência (XP)</Text>
                                    <Input className='border-gold border-[1px] rounded-lg w-full text-center' placeholder='XP' keyboardType="numeric" value={xp} onChangeText={setXp} />
                                </View>
                            </View>

                            <Text className="text-gold font-bold mb-2 mt-2">Atributos Base</Text>
                            <View className="flex-row flex-wrap justify-between w-full mb-3 gap-y-3">
                                {['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'].map((attr, index) => {
                                    const value = [str, dex, con, int, wis, cha][index];
                                    const setter = [setStr, setDex, setCon, setInt, setWis, setCha][index];
                                    return (
                                        <View key={attr} className="w-[30%]">
                                            <Text className="text-textColor-secondary text-xs mb-1 text-center">{attr}</Text>
                                            <Input className='border-gold border-[1px] rounded-lg w-full text-center' placeholder='10' keyboardType="numeric" value={value} onChangeText={setter} />
                                        </View>
                                    );
                                })}
                            </View>

                            <Text className="text-gold font-bold mb-2 mt-2">Descrição / Habilidades</Text>
                            <TextInput
                                multiline
                                textAlignVertical="top"
                                className="text-textColor-primary text-[16px] min-h-[120px] border border-gold rounded-lg p-3 bg-background mb-4"
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Ações, ataques, resistências e história do monstro..."
                                placeholderTextColor="#666"
                            />

                        </ScrollView>

                        <View className='flex-row gap-4 items-center justify-center w-full mt-2'>
                            <Pressable className='bg-gold-light rounded-[40px] px-4 py-2 w-[120px] items-center justify-center' onPress={handleSave}>
                                <Text className='text-gold-dark font-bold'>Salvar</Text>
                            </Pressable>
                            <Pressable className='bg-gold-dark rounded-[40px] px-4 py-2 w-[120px] items-center justify-center' onPress={closeAndReset}>
                                <Text className='text-textColor-primary font-bold'>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}