import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { Text as PaperText } from 'react-native-paper';

type CharacterSheetForm = {
    onClose: () => void,
    onSave: (sheetData: any) => void,
    isSaving: () => void,
    initialData: {
        characterName:string
        characterRace:string
        characterClass:string
        characterAntecedent:string
        characterTrend:string
        strength:number
        dexterity:number
        constitution:number
        intelligence:number
        wisdom:number
        charisma:number
        selectedSkills:string
    }
};

const CharacterSheetForm = ({ onClose, onSave, isSaving, initialData }: CharacterSheetForm) => {
    const [characterName, setCharacterName] = useState('');
    const [characterRace, setCharacterRace] = useState('');
    const [characterClass, setCharacterClass] = useState('');
    const [characterAntecedent, setCharacterAntecedent] = useState('');
    const [characterTrend, setCharacterTrend] = useState('');
    const [strength, setStrength] = useState('');
    const [dexterity, setDexterity] = useState('');
    const [constitution, setConstitution] = useState('');
    const [intelligence, setIntelligence] = useState('');
    const [wisdom, setWisdom] = useState('');
    const [charisma, setCharisma] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([''])
    const [isEnabled] = useState(false);


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

    useEffect(() => {
        if (initialData) {
            setCharacterName(initialData.characterName || '');
            setCharacterRace(initialData.characterRace || '');
            setCharacterClass(initialData.characterClass || '');
            setCharacterTrend(initialData.characterTrend || '');
            setCharacterAntecedent(initialData.characterAntecedent || '');
            setStrength(initialData.strength || '')
            setDexterity(initialData.dexterity || '')
            setConstitution(initialData.constitution || '')
            setIntelligence(initialData.intelligence || '')
            setWisdom(initialData.wisdom || '')
            setCharisma(initialData.charisma || '')
            setSelectedSkills(initialData.selectedSkills || '')
        }
    }, [initialData]);

    const handleSkillToggle = (skillName: string) => {
        setSelectedSkills(prev => prev.includes(skillName) ? prev.filter(s => s !== skillName) : [...prev, skillName]);
    };
    const handleSave = () => {
        if (characterName.trim() === '') {
            Alert.alert('Atenção', 'Por favor, insira um nome para o personagem.');
            return;
        }
        else if (characterRace.trim() === '') {
            Alert.alert('Atenção', 'O personagem deve ter uma Raça, é obrigatório.');
            return;
        }
        else if (characterClass.trim() === '') {
            Alert.alert('Atenção', 'O personagem deve ter uma Classe, é obrigatório.');
            return;
        }
        else if (characterAntecedent.trim() === '') {
            Alert.alert('Atenção', 'O personagem deve ter um Antecedente, é obrigatório.');
            return;
        }
        else if (characterTrend.trim() === '') {
            Alert.alert('Atenção', 'O personagem deve ter uma Tendência moral, é obrigatório.');
            return;
        }

        const sheetData = {
            characterName,
            characterRace,
            characterClass,
            characterAntecedent,
            characterTrend,
            strength,
            dexterity,
            constitution,
            intelligence,
            wisdom,
            charisma,
            selectedSkills
        }
        onSave(sheetData);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingContainer}
        >
            <ScrollView style={styles.formContainer}>
                <Text style={styles.formTitle}>{initialData ? 'Editar Ficha' : 'Nova Ficha'}</Text>

                <TextInput style={styles.input} placeholder="Nome do Personagem" value={characterName} onChangeText={setCharacterName} />
                <View style={styles.row}>
                    <TextInput style={styles.inputDouble} placeholder="Raça" value={characterRace} onChangeText={setCharacterRace} />
                    <TextInput style={styles.inputDouble} placeholder="Classe" value={characterClass} onChangeText={setCharacterClass} />
                </View>
                <View style={styles.row}>
                    <TextInput style={styles.inputDouble} placeholder="Antecedente" value={characterAntecedent} onChangeText={setCharacterAntecedent} />
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={characterTrend} onValueChange={setCharacterTrend} style={styles.picker}>
                            <Picker.Item label="Tendência" value="" enabled={false} />
                            {alignments.map(align => <Picker.Item key={align} label={align} value={align} />)}
                        </Picker>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Atributos</Text>
                <View style={styles.row}>
                    <TextInput style={styles.inputDouble} placeholder="Força" value={strength} onChangeText={setStrength} keyboardType="numeric" />
                    <TextInput style={styles.inputDouble} placeholder="Destreza" value={dexterity} onChangeText={setDexterity} keyboardType="numeric" />
                </View>
                <View style={styles.row}>
                    <TextInput style={styles.inputDouble} placeholder="Constituição" value={constitution} onChangeText={setConstitution} keyboardType="numeric" />
                    <TextInput style={styles.inputDouble} placeholder="Inteligência" value={intelligence} onChangeText={setIntelligence} keyboardType="numeric" />
                </View>
                <View style={styles.row}>
                    <TextInput style={styles.inputDouble} placeholder="Sabedoria" value={wisdom} onChangeText={setWisdom} keyboardType="numeric" />
                    <TextInput style={styles.inputDouble} placeholder="Carisma" value={charisma} onChangeText={setCharisma} keyboardType="numeric" />
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Perícias</Text>
                    {allSkills.map(skill => (
                        <View key={skill} style={styles.checkboxItem}>
                            <PaperText style={styles.checkboxLabel} onPress={() => handleSkillToggle(skill)}>
                                {skill}
                            </PaperText>
                            <Switch
                                trackColor={{ false: "#767577", true: "#0579c7" }}
                                thumbColor={isEnabled ? "#0495f5" : "#f4f3f4"}
                                onValueChange={() => handleSkillToggle(skill)}
                                value={selectedSkills.includes(skill)}
                            />
                        </View>
                    ))}
                    <View style={styles.formButtons}>
                        <Button title="Cancelar" onPress={onClose} color="#888" disabled={isSaving} />
                        {isSaving ? <ActivityIndicator color="#3498db" /> : <Button title="Salvar" onPress={handleSave} />}
                    </View>
                </View>

            </ScrollView>

        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
        width: '100%',
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,

    },
    checkboxLabel: {
        color: '#fff',
        marginLeft: 8,
        flex: 1
    },
    formContainer: {
        width: "90%",
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 20,
        alignSelf: 'center',
        marginVertical: 30, // Margem no topo e na base
        paddingBottom: 80, // <-- 1. SOLUÇÃO PARA BOTÕES CORTADOS
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    placeholderItem: {
        color: '#999',
    },
    sectionContainer: {
        marginBottom: 20,
    },

    listContainer: {
        width: '100%',
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
    },
    emptyListContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    pickerContainer: {
        height: 50,
        width: 150,
        backgroundColor: '#333',
        borderRadius: 5,
        marginBottom: 20,
        justifyContent: 'center',
    },
    picker: {
        color: '#fff',
    },
    newSheetButton: {
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    newSheetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    inputDouble: {
        backgroundColor: '#333',
        color: '#fff',
        width: "48%",
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
});

export default CharacterSheetForm;