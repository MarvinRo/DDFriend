import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // 1. Importar
import { SpellAndAbilitiesFormStyles } from '../styles/SpellsAndAbilitiesFormStyles';
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
            style={SpellAndAbilitiesFormStyles.keyboardAvoidingContainer}
        >
            {/* 2. ScrollView permite a rolagem e centraliza o conteúdo */}
            <ScrollView contentContainerStyle={SpellAndAbilitiesFormStyles.scrollContainer}>
                {/* 3. Esta View é o seu "cartão" de formulário com o estilo visual */}
                <View style={SpellAndAbilitiesFormStyles.formContainer}>
                    <Text style={SpellAndAbilitiesFormStyles.formTitle}>Magias e Habilidades</Text>
                    <Text style={SpellAndAbilitiesFormStyles.characterName}>{initialData?.characterName}</Text>

                    <Text style={SpellAndAbilitiesFormStyles.label}>Talentos</Text>
                    <TextInput
                        style={SpellAndAbilitiesFormStyles.textArea}
                        value={talents}
                        onChangeText={setTalents}
                        multiline
                        numberOfLines={6}
                    />
                    <Text style={SpellAndAbilitiesFormStyles.label}>Habilidades</Text>
                    <TextInput
                        style={SpellAndAbilitiesFormStyles.textArea}
                        value={abilities}
                        onChangeText={setAbilities}
                        multiline
                        numberOfLines={6}
                    />

                    <Text style={SpellAndAbilitiesFormStyles.label}>Magias Conhecidas</Text>
                    <TextInput
                        style={SpellAndAbilitiesFormStyles.textArea}
                        value={spells}
                        onChangeText={setSpells}
                        multiline
                        numberOfLines={6}
                    />

                    <View style={SpellAndAbilitiesFormStyles.formButtons}>
                        <Button title="Cancelar" onPress={onClose} color="#f44336" />
                        <Button
                            title={isSaving ? "Salvando..." : "Salvar"}
                            onPress={handleSave}
                            disabled={isSaving || isLoading}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
export default SpellsAndAbilitiesForm;