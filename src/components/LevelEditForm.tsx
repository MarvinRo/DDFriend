// src/components/LevelEditForm.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

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
        console.log(initialData);
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
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Editar Nível e XP</Text>
            <Text style={styles.characterName}>{initialData?.characterName}</Text>

            <Text style={styles.label}>Nível</Text>
            <TextInput
                style={styles.input}
                value={level}
                onChangeText={setLevel}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Pontos de Experiência (XP)</Text>
            <TextInput
                style={styles.input}
                value={experience}
                onChangeText={setExperience}
                keyboardType="numeric"
            />

            <View style={styles.formButtons}>
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

const styles = StyleSheet.create({
    formContainer: {
        width: "90%",
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 20,
        alignSelf: 'center',
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        textAlign: 'center',
    },
    characterName: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 5,
        marginLeft: 5,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
});

export default LevelEditForm;