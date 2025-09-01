import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { Text as PaperText } from 'react-native-paper';

type CharacterSheetForm = {
    onClose: () => void,
    onSave: (sheetData: any) => void,
    isSaving: () => void,
    initialData: {
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
        selectedSkills: string

    }
};

const CharacterSheetForm = ({ onClose, onSave, isSaving, initialData }: CharacterSheetForm) => {
    const [life, setLife] = useState(0)
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
    const [modExStrength, setModExStrength] = useState(0);
    const [modExDexterity, setModExDexterity] = useState(0);
    const [modExConstitution, setModExConstitution] = useState(0);
    const [modExIntelligence, setModExIntelligence] = useState(0);
    const [modExWisdom, setModExWisdom] = useState(0);
    const [modExCharisma, setModExCharisma] = useState(0);
    const [modStrength, setModStrength] = useState(0);
    const [modDexterity, setModDexterity] = useState(0);
    const [modConstitution, setModConstitution] = useState(0);
    const [modIntelligence, setModIntelligence] = useState(0);
    const [modWisdom, setModWisdom] = useState(0);
    const [modCharisma, setModCharisma] = useState(0);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
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
            setLife(initialData.life || 0)
            setCharacterName(initialData.characterName || '');
            setCharacterRace(initialData.characterRace || '');
            setCharacterClass(initialData.characterClass || '');
            setCharacterTrend(initialData.characterTrend || '');
            setCharacterAntecedent(initialData.characterAntecedent || '');
            setStrength(initialData.strength || 0)
            setDexterity(initialData.dexterity || 0)
            setConstitution(initialData.constitution || 0)
            setIntelligence(initialData.intelligence || 0)
            setWisdom(initialData.wisdom || 0)
            setCharisma(initialData.charisma || 0)
            setModExStrength(initialData.modExStrength || 0)
            setModExDexterity(initialData.modExDexterity || 0)
            setModExConstitution(initialData.modExConstitution || 0)
            setModExIntelligence(initialData.modExIntelligence || 0)
            setModExWisdom(initialData.modExWisdom || 0)
            setModExCharisma(initialData.modExCharisma || 0)
            setModStrength(Math.floor((initialData.strength - 10) / 2) || 0)
            setModDexterity(Math.floor((initialData.dexterity - 10) / 2) || 0)
            setModConstitution(Math.floor((initialData.constitution - 10) / 2) || 0)
            setModIntelligence(Math.floor((initialData.intelligence - 10) / 2) || 0)
            setModWisdom(Math.floor((initialData.wisdom - 10) / 2) || 0)
            setModCharisma(Math.floor((initialData.charisma - 10) / 2) || 0)
            setSelectedSkills(initialData.selectedSkills || [''])
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
        else if (!life) {
            Alert.alert('Atenção', 'O personagem deve ter pontos de vida, é obrigatório.');
            return;
        }
        

        const sheetData = {
            life,
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
            selectedSkills,
            modExStrength,
            modExDexterity,
            modExConstitution,
            modExIntelligence,
            modExWisdom,
            modExCharisma,
            modStrength: modExStrength ? Math.floor((strength - 10) / 2) + modExStrength : Math.floor((strength - 10) / 2),
            modDexterity: modExDexterity ? Math.floor((dexterity - 10) / 2) + modExDexterity : Math.floor((dexterity - 10) / 2),
            modConstitution: modExConstitution ? Math.floor((constitution - 10) / 2) + modExConstitution : Math.floor((constitution - 10) / 2),
            modIntelligence: modExIntelligence ? Math.floor((intelligence - 10) / 2) + modExIntelligence : Math.floor((intelligence - 10) / 2),
            modWisdom: modExWisdom ? Math.floor((wisdom - 10) / 2) + modExWisdom : Math.floor((wisdom - 10) / 2),
            modCharisma: modExCharisma ? Math.floor((charisma - 10) / 2) + modExCharisma : Math.floor((charisma - 10) / 2),
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
                <View style={styles.row}>
                    <TextInput style={styles.inputDouble} placeholder="Vida" value={life.toString()} onChangeText={(text) => setLife(Number(text))} />
                    {/* <View style={styles.pickerContainer}>
                        <Picker selectedValue={characterTrend} onValueChange={setCharacterTrend} style={styles.picker}>
                            <Picker.Item label="Tendência" value="" enabled={false} />
                            {alignments.map(align => <Picker.Item key={align} label={align} value={align} />)}
                        </Picker>
                    </View> */}
                </View>
                <Text style={styles.sectionTitle}>Atributos</Text>
                <View style={styles.row}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "38%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Força</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                    <View style={{ alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between", width: "38%", marginRight: "10%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Destreza</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <TextInput style={styles.inputQuad} placeholder="Força" value={strength.toString()} onChangeText={(text) => setStrength(Number(text))} keyboardType="numeric" />
                    <TextInput style={styles.inputQuad} placeholder="Mod. Força" value={modExStrength.toString()} onChangeText={(text) => setModExStrength(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modStrength) || Number(modExStrength) > 0 ? `+${Number(modStrength) + Number(modExStrength)}` : Number(modStrength)}</Text>
                    <TextInput style={styles.inputQuad} placeholder="Destreza" value={dexterity.toString()} onChangeText={(text) => setDexterity(Number(text))} keyboardType="numeric" />
                    <TextInput style={styles.inputQuad} placeholder="Mod. Destreza" value={modExDexterity.toString()} onChangeText={(text) => setModExDexterity(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modDexterity) || Number(modExDexterity) > 0 ? `+${Number(modDexterity) + Number(modExDexterity)}` : Number(modDexterity)}</Text>
                </View>
                <View style={styles.row}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "38%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Const.</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                    <View style={{ alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between", width: "38%", marginRight: "10%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Inteli.</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <TextInput style={styles.inputQuad} placeholder="Constituição" value={constitution.toString()} onChangeText={(text) => setConstitution(Number(text))} keyboardType="numeric" />
                    <TextInput style={styles.inputQuad} placeholder="Mod. Constituição" value={modExConstitution.toString()} onChangeText={(text) => setModExConstitution(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modConstitution) || Number(modExConstitution) > 0 ? `+${Number(modConstitution) + Number(modExConstitution)}` : Number(modConstitution)}</Text>
                    <TextInput style={styles.inputQuad} placeholder="Inteligência" value={intelligence.toString()} onChangeText={(text) => setIntelligence(Number(text))} keyboardType="numeric" />
                    <TextInput style={styles.inputQuad} placeholder="Mod. Inteligência" value={modExIntelligence.toString()} onChangeText={(text) => setModExIntelligence(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modIntelligence) || Number(modExIntelligence) > 0 ? `+${Number(modIntelligence) + Number(modExIntelligence)}` : Number(modIntelligence)}</Text>
                </View>
                <View style={styles.row}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "38%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Sabedo.</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                    <View style={{ alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between", width: "38%", marginRight: "10%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Carisma</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <TextInput style={styles.inputQuad} placeholder="Sabedoria" value={wisdom.toString()} onChangeText={(text) => setWisdom(Number(text))} keyboardType="numeric" />
                    <TextInput style={styles.inputQuad} placeholder="Mod. Sabedoria" value={modExWisdom.toString()} onChangeText={(text) => setModExWisdom(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modWisdom) || Number(modExWisdom) > 0 ? `+${Number(modWisdom) + Number(modExWisdom)}` : Number(modWisdom)}</Text>
                    <TextInput style={styles.inputQuad} placeholder="Carisma" value={charisma.toString()} onChangeText={(text) => setCharisma(Number(text))} keyboardType="numeric" />
                    <TextInput style={styles.inputQuad} placeholder="Mod. Carisma" value={modExCharisma.toString()} onChangeText={(text) => setModExCharisma(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modCharisma) || Number(modExCharisma) > 0 ? `+${Number(modCharisma) + Number(modExCharisma)}` : Number(modCharisma)}</Text>
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
                        <Button title="Cancelar" onPress={onClose} color="#f44336" disabled={isSaving} />
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
    inputQuad: {
        backgroundColor: '#333',
        color: '#fff',
        width: "16%",
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