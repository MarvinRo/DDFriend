import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, Text, View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Select } from '@/components/ui/Select';
import { SvgXml } from 'react-native-svg';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { Checkbox } from '@/components/ui/Checkbox';

interface CreatEditCaracterProps {
    visible: boolean;
    onClose: () => void,
    onSave: (sheetData: any) => void,
    isSaving?: boolean,
    initialData: {
        characterPhoto?: string;
        life: number
        characterName: string
        characterRace: string
        characterClass: string
        characterAntecedent: string
        characterTrend: string
        strength: number
        dexterity: number
        constitution: number
        intelligence: number
        wisdom: number
        charisma: number
        modExStrength: number
        modExDexterity: number
        modExConstitution: number
        modExIntelligence: number
        modExWisdom: number
        modExCharisma: number
        modStrength: number
        modDexterity: number
        modConstitution: number
        modIntelligence: number
        modWisdom: number
        modCharisma: number
        efficiencyBonus: number
        selectedSkills: string[]
        selectedSafeguards: string[]
        movement: number
    }
}

const alignments = [
    "Leal/Bom", "Neutro/Bom", "Caótico/Bom",
    "Leal/Neutro", "Neutro", "Neutro/Caótico",
    "Leal/Mal", "Neutro/Mal", "Caótico/Mal",
];
const allSkills = [
    "Acrobacia", "Arcanismo", "Atletismo", "Atuação", "Enganação",
    "Furtividade", "História", "Intimidação", "Intuição", "Investigação",
    "Lidar com Animais", "Medicina", "Natureza", "Percepção", "Persuasão",
    "Prestidigitação(Ladinagem)", "Religião", "Sobrevivência",
];

const allSafeguard = [
    "Força", "Destreza", "Constituição", "Inteligencia", "Sabedoria", "Carisma",
];

const deleteIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`

const AttributeHexagon = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => {
    // Desenho vetorial de um hexágono pontiagudo perfeitamente alinhado
    const hexSvg = `<svg viewBox="0 0 104 120" fill="transparent" xmlns="http://www.w3.org/2000/svg">
        <path d="M52 4 L100 32 L100 88 L52 116 L4 88 L4 32 Z" stroke="#C49A4A" stroke-width="4"/>
    </svg>`;

    return (
        <View className="w-[75px] h-[85px] items-center justify-center m-1">
            <View className="absolute inset-0 items-center justify-center">
                <SvgXml xml={hexSvg} width="100%" height="100%" />
            </View>
            <View className="flex-col items-center justify-center w-full h-full pb-1">
                <Text className="text-textColor-secondary text-[12px] font-bold bg-transparent">{label}</Text>
                <TextInput
                    className="text-textColor-primary text-[24px] font-bold text-center p-0 m-0 w-full"
                    keyboardType="numeric"
                    value={value ? value.toString() : ''}
                    onChangeText={(text) => onChange(Number(text.replace(/[^0-9]/g, '')))}
                    maxLength={2}
                />
            </View>
        </View>
    );
};



export default function CreatEditCaracter({ onClose, onSave, initialData, visible }: CreatEditCaracterProps) {
    const [alignment, setAlignment] = useState<string | number>();

    const handleClose = () => {
        setAlignment(undefined);
        setCharacterName('');
        setCharacterRace('');
        setCharacterClass('');
        setCharacterAntecedent('');
        setLife(0);
        setStrength(0);
        setDexterity(0);
        setConstitution(0);
        setIntelligence(0);
        setWisdom(0);
        setCharisma(0);
        setSelectedSkills([]);
        setSelectedSafeguards([]);
        setCharacterPhoto(null);
            setCharacterMovement('');
        onClose();
    };

    const [life, setLife] = useState(0)
    
    const [characterMovement, setCharacterMovement] = useState('')
    const [characterName, setCharacterName] = useState('');
    const [characterRace, setCharacterRace] = useState('');
    const [characterClass, setCharacterClass] = useState('');
    const [characterAntecedent, setCharacterAntecedent] = useState('');
    const [characterTrend, setCharacterTrend] = useState('');
    const [strength, setStrength] = useState(0);
    const [dexterity, setDexterity] = useState(0);
    const [constitution, setConstitution] = useState(0);
    const [intelligence, setIntelligence] = useState(0);
    const [wisdom, setWisdom] = useState(0);
    const [charisma, setCharisma] = useState(0);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [selectedSafeguards, setSelectedSafeguards] = useState<string[]>([])
    const [characterPhoto, setCharacterPhoto] = useState<string | null>(null);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setLife(initialData.life || 0);
            setCharacterName(initialData.characterName || '');
            setCharacterRace(initialData.characterRace || '');
            setCharacterClass(initialData.characterClass || '');
            setCharacterTrend(initialData.characterTrend || '');
            setAlignment(initialData.characterTrend || undefined);
            setCharacterAntecedent(initialData.characterAntecedent || '');
            setStrength(initialData.strength || 0);
            setDexterity(initialData.dexterity || 0);
            setConstitution(initialData.constitution || 0);
            setIntelligence(initialData.intelligence || 0);
            setWisdom(initialData.wisdom || 0);
            setCharisma(initialData.charisma || 0);
            setSelectedSkills(initialData.selectedSkills || []);
            setSelectedSafeguards(initialData.selectedSafeguards || []);
            setCharacterMovement(initialData.movement ? initialData.movement.toString() : '');
            setCharacterPhoto(initialData.characterPhoto || '');
        }
    }, [initialData]);

    const removeImage = () => {
        Alert.alert(
            "Remover Foto",
            "Tem certeza que deseja remover a foto do personagem?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: () => setCharacterPhoto(null)
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
                setCharacterPhoto(`data:${mimeType};base64,${file.base64}`);
            }
        });
    };

    const calculateModifier = (value: number) => {
        return Math.floor((value - 10) / 2);
    };

    const handleSaveData = () => {
        const sheetData = {
            characterName,
            characterRace,
            characterClass,
            characterAntecedent,
            characterTrend: alignment || '',
            characterPhoto,
            life: Number(life) || 0,
            movement: Number(characterMovement) || '',
            strength: Number(strength) || 0,
            dexterity: Number(dexterity) || 0,
            constitution: Number(constitution) || 0,
            intelligence: Number(intelligence) || 0,
            wisdom: Number(wisdom) || 0,
            charisma: Number(charisma) || 0,
            modStrength: calculateModifier(Number(strength) || 0),
            modDexterity: calculateModifier(Number(dexterity) || 0),
            modConstitution: calculateModifier(Number(constitution) || 0),
            modIntelligence: calculateModifier(Number(intelligence) || 0),
            modWisdom: calculateModifier(Number(wisdom) || 0),
            modCharisma: calculateModifier(Number(charisma) || 0),
            modExStrength: 0,
            modExDexterity: 0,
            modExConstitution: 0,
            modExIntelligence: 0,
            modExWisdom: 0,
            modExCharisma: 0,
            selectedSkills,
            selectedSafeguards,
        };
        onSave(sheetData);
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
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View className='my-5 bg-card rounded-[10px] p-[20px] items-center justify-center flex-1 max-h-[95%] border-gold border-[1px] w-11/12'>
                        <ScrollView className='w-full flex-1 mb-4 ' showsVerticalScrollIndicator={false}>
                            <View className='flex-1 items-center justify-start w-full gap-3 pb-2'>
                                <Text className='text-textColor-primary text-[24px] font-bold mb-2'>{initialData && Object.keys(initialData).length > 0 ? 'Editando Ficha' : 'Nova Ficha'}</Text>
                                <TouchableOpacity onPress={selectImage} >
                                    {characterPhoto ? (
                                        <Image
                                            source={{ uri: characterPhoto }}
                                            className="w-[120px] h-[120px] rounded-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View className="w-[120px] h-[120px] rounded-full bg-slate-800 justify-center items-center border border-dashed border-gray-100">
                                            <Text className="text-gray-100 text-center text-sm">Adicionar Foto</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>

                                {characterPhoto && (
                                    <TouchableOpacity
                                        onPress={removeImage}
                                        className="flex-row items-center mt-1 mb-2 bg-destructive py-1.5 px-3 rounded-lg"
                                    >
                                        <SvgXml xml={deleteIconXml} width="16" height="16" stroke="#f5f5f5" />
                                        <Text className="text-gray-100 ml-2 font-bold text-sm">Remover Foto</Text>
                                    </TouchableOpacity>
                                )}

                                <Input className='border-l-gold border-t-gray-500 border-r-gray-500 border-b-gray-500 border-[2px] rounded-lg w-full' placeholder='Nome' value={characterName} onChangeText={setCharacterName} />
                                <Input className='border-l-gold border-t-gray-500 border-r-gray-500 border-b-gray-500 border-[2px] rounded-lg w-full' placeholder='Raça' value={characterRace} onChangeText={setCharacterRace} />
                                <Input className='border-l-gold border-t-gray-500 border-r-gray-500 border-b-gray-500 border-[2px] rounded-lg w-full' placeholder='Classe' value={characterClass} onChangeText={setCharacterClass} />
                                <Input className='border-l-gold border-t-gray-500 border-r-gray-500 border-b-gray-500 border-[2px] rounded-lg w-full' placeholder='Antecedentes' value={characterAntecedent} onChangeText={setCharacterAntecedent} />
                                <Input className='border-l-gold border-t-gray-500 border-r-gray-500 border-b-gray-500 border-[2px] rounded-lg w-full' placeholder='Movimento' value={characterMovement} onChangeText={(text) => setCharacterMovement(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" />

                                <Select
                                    className='w-full'
                                    selectClasses='border-l-gold border-t-gray-500 border-r-gray-500 border-b-gray-500 border-[2px] rounded-lg bg-transparent'
                                    options={alignments.map((alignment) => ({ label: alignment, value: alignment }))}
                                    onSelect={(val) => setAlignment(val)}
                                    selectedValue={alignment}
                                    labelKey='label'
                                    valueKey='value'
                                    placeholder='Alinhamento'
                                />

                                <Text className='text-textColor-primary text-[18px] font-bold mt-4 mb-1'>Atributos</Text>
                                <View className=' flex-row items-center mb-2 px-2'>
                                    <View className='w-32 h-0.5 bg-gold-dark' />
                                    <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                                    <View className='w-32 h-0.5 bg-gold-dark' />
                                </View>
                                <View className="w-full items-center justify-center py-2">
                                    {/* Linha 1 */}
                                    <View className="flex-row gap-2 justify-center z-10">
                                        <AttributeHexagon label="FOR" value={strength} onChange={setStrength} />
                                        <AttributeHexagon label="DES" value={dexterity} onChange={setDexterity} />
                                    </View>
                                    {/* Linha 2 - Margem negativa para encaixar nas pontas */}
                                    <View className="flex-row gap-2 justify-center -mt-5 z-20">
                                        <AttributeHexagon label="CON" value={constitution} onChange={setConstitution} />
                                        <AttributeHexagon label="VIDA" value={life} onChange={setLife} />
                                        <AttributeHexagon label="INT" value={intelligence} onChange={setIntelligence} />
                                    </View>
                                    {/* Linha 3 - Margem negativa para encaixar nas pontas */}
                                    <View className="flex-row gap-2 justify-center -mt-5 z-30">
                                        <AttributeHexagon label="SAB" value={wisdom} onChange={setWisdom} />
                                        <AttributeHexagon label="CAR" value={charisma} onChange={setCharisma} />
                                    </View>
                                </View>

                                <Text className='text-textColor-primary text-[18px] font-bold mt-4 mb-2'>Salvaguarda</Text>
                                <View className=' flex-row items-center mb-2 px-2'>
                                    <View className='w-32 h-0.5 bg-gold-dark' />
                                    <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                                    <View className='w-32 h-0.5 bg-gold-dark' />
                                </View>
                                <View className="w-full flex-row flex-wrap justify-between px-2 mb-4">
                                    {allSafeguard.map((skill) => (
                                        <Checkbox
                                            key={skill}
                                            label={skill}
                                            className="w-[48%] mb-3"
                                            labelClasses="text-textColor-primary text-[14px] flex-shrink"
                                            checkboxClasses="border-gold w-5 h-5"
                                            checked={selectedSafeguards.includes(skill)}
                                            onValueChange={(checked) => {
                                                if (checked) setSelectedSafeguards(prev => [...prev, skill]);
                                                else setSelectedSafeguards(prev => prev.filter(s => s !== skill));
                                            }}
                                        />
                                    ))}
                                </View>

                                <Text className='text-textColor-primary text-[18px] font-bold mt-4 mb-2'>Perícias</Text>
                                <View className=' flex-row items-center mb-2 px-2'>
                                    <View className='w-32 h-0.5 bg-gold-dark' />
                                    <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                                    <View className='w-32 h-0.5 bg-gold-dark' />
                                </View>
                                <View className="w-full flex-row flex-wrap justify-between px-2 mb-4">
                                    {allSkills.map((skill) => (
                                        <Checkbox
                                            key={skill}
                                            label={skill}
                                            className="w-[48%] mb-3"
                                            labelClasses="text-textColor-primary text-[14px] flex-shrink"
                                            checkboxClasses="border-gold w-5 h-5"
                                            checked={selectedSkills.includes(skill)}
                                            onValueChange={(checked) => {
                                                if (checked) setSelectedSkills(prev => [...prev, skill]);
                                                else setSelectedSkills(prev => prev.filter(s => s !== skill));
                                            }}
                                        />
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
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}