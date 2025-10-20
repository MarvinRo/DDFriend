// src/components/LevelEditForm.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button} from 'react-native';
import { LevelEditFormStyle } from '../styles/LevelEditForm';

type LevelEditForm = {
    initialData: {
        level: number;
        experience: number;
        characterName: string
    },
    onSave: () => void,
    onClose: () => void,
    isSaving: () => void
}


const LevelEditForm = ({ initialData, onSave, onClose, isSaving }: LevelEditForm) => {

    const [level, setLevel] = useState('1');
    const [experience, setExperience] = useState('0');

    useEffect(() => {
        if (initialData) {
            setLevel(String(initialData.level || '1'));
            setExperience(String(initialData.experience || '0'));
        }
    }, [initialData]);

    const handleSave = () => {
        const dataToSave = {
            level: parseInt(level, 10) || 1,
            experience: parseInt(experience, 10) || 0,
        };
        onSave(dataToSave);
    };

    return (
        <View style={LevelEditFormStyle.formContainer}>
            <Text style={LevelEditFormStyle.formTitle}>Editar Nível e XP</Text>
            <Text style={LevelEditFormStyle.characterName}>{initialData?.characterName}</Text>

            <Text style={LevelEditFormStyle.label}>Nível</Text>
            <TextInput
                style={LevelEditFormStyle.input}
                value={level}
                onChangeText={setLevel}
                keyboardType="numeric"
            />

            <Text style={LevelEditFormStyle.label}>Pontos de Experiência (XP)</Text>
            <TextInput
                style={LevelEditFormStyle.input}
                value={experience}
                onChangeText={setExperience}
                keyboardType="numeric"
            />

            <View style={LevelEditFormStyle.formButtons}>
                <Button title="Cancelar" onPress={onClose} color="#f44336" />
                <Button
                    title={isSaving ? "Salvando..." : "Salvar"}
                    onPress={handleSave}
                    disabled={isSaving}
                />
            </View>
        </View>
    );
};

export default LevelEditForm;