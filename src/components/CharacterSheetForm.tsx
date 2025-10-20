import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { CharacterSheetFormStyle } from '../styles/CharacterSheetFormStyle'
import { Text as PaperText } from 'react-native-paper';

type CharacterSheetForm = {
    onClose: () => void,
    onSave: (sheetData: any) => void,
    isSaving: () => void,
    initialData: {
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
        efficiencyBonus:number
        selectedSkills: string[]
        selectedSafeguards: string[]
        movement: number
    }
};

const CharacterSheetForm = ({ onClose, onSave, isSaving, initialData }: CharacterSheetForm) => {
    const [life, setLife] = useState('')
    const [efficiencyBonus, setEfficiencyBonus] = useState('')
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
    const [selectedSafeguards, setSelectedSafeguards] = useState<string[]>([])
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

    const allSafeguard = [
        "Força", "Destreza", "Constituição", "Inteligencia", "Sabedoria", "Carisma",
    ];

    useEffect(() => {
        if (initialData) {
            setLife(initialData.life ? initialData.life.toString() : '');
            setEfficiencyBonus(initialData.efficiencyBonus ? initialData.efficiencyBonus.toString() : '');
            setCharacterName(initialData.characterName || '');
            setCharacterRace(initialData.characterRace || '');
            setCharacterClass(initialData.characterClass || '');
            setCharacterTrend(initialData.characterTrend || '');
            setCharacterAntecedent(initialData.characterAntecedent || '');
            setStrength(initialData.strength || 0);
            setDexterity(initialData.dexterity || 0);
            setConstitution(initialData.constitution || 0);
            setIntelligence(initialData.intelligence || 0);
            setWisdom(initialData.wisdom || 0);
            setCharisma(initialData.charisma || 0);
            setModExStrength(initialData.modExStrength || 0);
            setModExDexterity(initialData.modExDexterity || 0);
            setModExConstitution(initialData.modExConstitution || 0);
            setModExIntelligence(initialData.modExIntelligence || 0);
            setModExWisdom(initialData.modExWisdom || 0);
            setModExCharisma(initialData.modExCharisma || 0);
            setModStrength(Math.floor((initialData.strength - 10) / 2) || 0);
            setModDexterity(Math.floor((initialData.dexterity - 10) / 2) || 0);
            setModConstitution(Math.floor((initialData.constitution - 10) / 2) || 0);
            setModIntelligence(Math.floor((initialData.intelligence - 10) / 2) || 0);
            setModWisdom(Math.floor((initialData.wisdom - 10) / 2) || 0);
            setModCharisma(Math.floor((initialData.charisma - 10) / 2) || 0);
            setSelectedSkills(initialData.selectedSkills || ['']);
            setSelectedSafeguards(initialData.selectedSafeguards || ['']);
            setCharacterMovement(initialData.movement ? initialData.movement.toString() : '');
        }
    }, [initialData]);

    const handleSkillToggle = (skillName: string) => {
        setSelectedSkills(prev => prev.includes(skillName) ? prev.filter(s => s !== skillName) : [...prev, skillName]);
    };

    const handleSafeguardToggle = (safeguardName: string) => {
        setSelectedSafeguards(prev => prev.includes(safeguardName) ? prev.filter(s => s !== safeguardName) : [...prev, safeguardName]);
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
        else if (life.toString().trim() === '' || isNaN(Number(life))) {
            Alert.alert('Atenção', 'O personagem deve ter pontos de vida, é obrigatório.');
            return;
        }



        const sheetData = {
            life: Number(life),
            movement: Number(characterMovement),
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
            selectedSafeguards,
            modExStrength,
            modExDexterity,
            efficiencyBonus,
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
            style={CharacterSheetFormStyle.keyboardAvoidingContainer}
        >
            <ScrollView style={CharacterSheetFormStyle.formContainer}>
                <Text style={CharacterSheetFormStyle.formTitle}>{initialData ? 'Editar Ficha' : 'Nova Ficha'}</Text>

                <TextInput style={CharacterSheetFormStyle.input} placeholder="Nome do Personagem" value={characterName} onChangeText={setCharacterName} />
                <View style={CharacterSheetFormStyle.row}>
                    <TextInput style={CharacterSheetFormStyle.inputDouble} placeholder="Raça" value={characterRace} onChangeText={setCharacterRace} />
                    <TextInput style={CharacterSheetFormStyle.inputDouble} placeholder="Classe" value={characterClass} onChangeText={setCharacterClass} />
                </View>
                <View style={CharacterSheetFormStyle.row}>
                    <TextInput style={CharacterSheetFormStyle.inputDouble} placeholder="Antecedente" value={characterAntecedent} onChangeText={setCharacterAntecedent} />
                    <View style={CharacterSheetFormStyle.pickerContainer}>
                        <Picker selectedValue={characterTrend} onValueChange={setCharacterTrend} style={CharacterSheetFormStyle.picker}>
                            <Picker.Item label="Tendência" value="" enabled={false} />
                            {alignments.map(align => <Picker.Item key={align} label={align} value={align} />)}
                        </Picker>
                    </View>
                </View>
                <View style={CharacterSheetFormStyle.row}>
                    <TextInput style={CharacterSheetFormStyle.inputDouble} placeholder="Vida" value={life} onChangeText={(text) => setLife(text)} keyboardType="numeric" />
                    <TextInput style={CharacterSheetFormStyle.inputDouble} placeholder="Movimento" value={characterMovement} onChangeText={setCharacterMovement} keyboardType="numeric" />
                </View>
                <View style={CharacterSheetFormStyle.row}>
                    <TextInput style={CharacterSheetFormStyle.inputDouble} placeholder="Proeficiência" value={efficiencyBonus} onChangeText={(text) => setEfficiencyBonus(text)} keyboardType="numeric" />
                    {/* <TextInput style={CharacterSheetFormStyle.inputDouble} placeholder="Movimento" value={characterMovement} onChangeText={setCharacterMovement} keyboardType="numeric" /> */}
                </View>
                <Text style={CharacterSheetFormStyle.sectionTitle}>Atributos</Text>
                <View style={CharacterSheetFormStyle.row}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "38%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Força</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                    <View style={{ alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between", width: "38%", marginRight: "10%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Destreza</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                </View>

                <View style={CharacterSheetFormStyle.row}>
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Força" value={strength.toString()} onChangeText={(text) => setStrength(Number(text))} keyboardType="numeric" />
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Mod. Força" value={modExStrength.toString()} onChangeText={(text) => setModExStrength(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modStrength) || Number(modExStrength) > 0 ? `+${Number(modStrength) + Number(modExStrength)}` : Number(modStrength)}</Text>
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Destreza" value={dexterity.toString()} onChangeText={(text) => setDexterity(Number(text))} keyboardType="numeric" />
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Mod. Destreza" value={modExDexterity.toString()} onChangeText={(text) => setModExDexterity(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modDexterity) || Number(modExDexterity) > 0 ? `+${Number(modDexterity) + Number(modExDexterity)}` : Number(modDexterity)}</Text>
                </View>
                <View style={CharacterSheetFormStyle.row}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "38%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Const.</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                    <View style={{ alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between", width: "38%", marginRight: "10%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Inteli.</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                </View>
                <View style={CharacterSheetFormStyle.row}>
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Constituição" value={constitution.toString()} onChangeText={(text) => setConstitution(Number(text))} keyboardType="numeric" />
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Mod. Constituição" value={modExConstitution.toString()} onChangeText={(text) => setModExConstitution(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modConstitution) || Number(modExConstitution) > 0 ? `+${Number(modConstitution) + Number(modExConstitution)}` : Number(modConstitution)}</Text>
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Inteligência" value={intelligence.toString()} onChangeText={(text) => setIntelligence(Number(text))} keyboardType="numeric" />
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Mod. Inteligência" value={modExIntelligence.toString()} onChangeText={(text) => setModExIntelligence(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modIntelligence) || Number(modExIntelligence) > 0 ? `+${Number(modIntelligence) + Number(modExIntelligence)}` : Number(modIntelligence)}</Text>
                </View>
                <View style={CharacterSheetFormStyle.row}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "38%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Sabedo.</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                    <View style={{ alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between", width: "38%", marginRight: "10%" }}>
                        <Text style={{ color: "#f5f5f5" }}>Carisma</Text>
                        <Text style={{ color: "#f5f5f5" }}>Mod. Ex</Text>
                    </View>
                </View>
                <View style={CharacterSheetFormStyle.row}>
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Sabedoria" value={wisdom.toString()} onChangeText={(text) => setWisdom(Number(text))} keyboardType="numeric" />
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Mod. Sabedoria" value={modExWisdom.toString()} onChangeText={(text) => setModExWisdom(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modWisdom) || Number(modExWisdom) > 0 ? `+${Number(modWisdom) + Number(modExWisdom)}` : Number(modWisdom)}</Text>
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Carisma" value={charisma.toString()} onChangeText={(text) => setCharisma(Number(text))} keyboardType="numeric" />
                    <TextInput style={CharacterSheetFormStyle.inputQuad} placeholder="Mod. Carisma" value={modExCharisma.toString()} onChangeText={(text) => setModExCharisma(Number(text))} keyboardType="numeric" />
                    <Text style={{ color: "#f5f5f5" }}>{Number(modCharisma) || Number(modExCharisma) > 0 ? `+${Number(modCharisma) + Number(modExCharisma)}` : Number(modCharisma)}</Text>
                </View>
                <View style={CharacterSheetFormStyle.sectionContainer}>
                    <Text style={CharacterSheetFormStyle.sectionTitle}>Perícias</Text>
                    {allSkills.map(skill => (
                        <View key={skill} style={CharacterSheetFormStyle.checkboxItem}>
                            <PaperText style={CharacterSheetFormStyle.checkboxLabel} onPress={() => handleSkillToggle(skill)}>
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
                    <Text style={CharacterSheetFormStyle.sectionTitle}>Salvaguardas</Text>
                    {allSafeguard.map(safeguard => (
                        <View key={safeguard} style={CharacterSheetFormStyle.checkboxItem}>
                            <PaperText style={CharacterSheetFormStyle.checkboxLabel} onPress={() => handleSafeguardToggle(safeguard)}>
                                {safeguard}
                            </PaperText>
                            <Switch
                                trackColor={{ false: "#767577", true: "#0579c7" }}
                                thumbColor={isEnabled ? "#0495f5" : "#f4f3f4"}
                                onValueChange={() => handleSafeguardToggle(safeguard)}
                                value={selectedSafeguards.includes(safeguard)}
                            />
                        </View>
                    ))}
                    <View style={CharacterSheetFormStyle.formButtons}>
                        <Button title="Cancelar" onPress={onClose} color="#f44336" disabled={isSaving} />
                        {isSaving ? <ActivityIndicator color="#3498db" /> : <Button title="Salvar" onPress={handleSave} />}
                    </View>
                </View>

            </ScrollView>

        </KeyboardAvoidingView >
    );
};

export default CharacterSheetForm;