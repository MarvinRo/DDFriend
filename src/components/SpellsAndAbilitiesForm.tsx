import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';

type SpellsFormProps = {
    initialData: { id: string; characterName: string; };
    onSave: (data: any, docId: string) => void;
    onClose: () => void;
    isSaving: boolean;
}

const SpellsAndAbilitiesForm = ({ initialData, onSave, onClose, isSaving }: SpellsFormProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [docId, setDocId] = useState<string | null>(null);

    // Estados para os campos
    const [spells, setSpells] = useState('');
    const [abilities, setAbilities] = useState('');
    const [talents, setTalents] = useState('');

    useEffect(() => {
        if (!initialData?.id) return;

        // Busca os dados na nova subcoleção
        const query = firestore()
            .collection('characterSheets')
            .doc(initialData.id)
            .collection('spellsAndAbilities')
            .limit(1);

        const subscriber = query.onSnapshot(querySnapshot => {
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();
                setDocId(doc.id);

                setSpells(data.spells || '');
                setAbilities(data.abilities || '');
                setTalents(data.talents || '');
            }
            setIsLoading(false);
        }, error => {
            console.error("Erro ao buscar magias e habilidades:", error);
            setIsLoading(false);
        });

        return () => subscriber();
    }, [initialData]);

    const handleSave = () => {
        if (!docId) return;

        const dataToSave = {
            spells: spells || '',
            abilities: abilities || '',
            talents: talents || '',
        };
        onSave(dataToSave, docId);
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 40 }} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingContainer}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Magias e Habilidades</Text>
                <Text style={styles.characterName}>{initialData?.characterName}</Text>

                <Text style={styles.label}>Talentos</Text>
                <TextInput
                    style={styles.textArea}
                    value={talents}
                    onChangeText={setTalents}
                    multiline
                    numberOfLines={6}
                />
                <Text style={styles.label}>Habilidades</Text>
                <TextInput
                    style={styles.textArea}
                    value={abilities}
                    onChangeText={setAbilities}
                    multiline
                    numberOfLines={6}
                />

                <Text style={styles.label}>Magias Conhecidas</Text>
                <TextInput
                    style={styles.textArea}
                    value={spells}
                    onChangeText={setSpells}
                    multiline
                    numberOfLines={6}
                />

                <View style={styles.formButtons}>
                    <Button title="Cancelar" onPress={onClose} color="#f44336" />
                    <Button
                        title={isSaving ? "Salvando..." : "Salvar"}
                        onPress={handleSave}
                        disabled={isSaving || isLoading}
                    />
                </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1, // Garante que o container ocupe todo o espaço disponível
    },
    scrollContainer: {
        flexGrow: 1, // Permite que o conteúdo cresça
        justifyContent: 'center', // Centraliza o formulário verticalmente
    },
    formContainer: { width: "90%", backgroundColor: '#2a2a2a', borderRadius: 10, padding: 20, alignSelf: 'center' },
    formTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5, textAlign: 'center' },
    characterName: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 20 },
    label: { fontSize: 14, color: '#aaa', marginBottom: 5, marginLeft: 5 },
    textArea: {
        backgroundColor: '#333', color: '#fff', borderRadius: 5, paddingHorizontal: 15,
        paddingVertical: 10, marginBottom: 15, fontSize: 16, height: 120, textAlignVertical: 'top',
    },
    formButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});

export default SpellsAndAbilitiesForm;