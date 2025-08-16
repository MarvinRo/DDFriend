// src/components/LevelEditForm.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

// 1. CORRIJA A TIPAGEM
type ItemsBagPackProps = {
    initialData: { id: string; characterName: string; }; // Recebe dados básicos do personagem
    onSave: (data: any, bagpackDocId: string) => void;
    onClose: () => void;
    isSaving: boolean;
}

const ItemsBagPack = ({ initialData, onSave, onClose, isSaving }: ItemsBagPackProps) => {
    const [isLoading, setIsLoading] = useState(true);
    // Estado para guardar o ID do documento da mochila
    const [bagpackDocId, setBagpackDocId] = useState<string | null>(null);

    // Estados para os campos do formulário
    const [platina, setPlatina] = useState('0');
    const [gold, setGold] = useState('0');
    const [silver, setSilver] = useState('0');
    const [copper, setCopper] = useState('0');
    const [items, setItems] = useState('');

    // 2. BUSCAR OS DADOS DA MOCHILA NA SUBCOLEÇÃO
    useEffect(() => {
        if (!initialData?.id) return;

        const bagpackQuery = firestore()
            .collection('characterSheets')
            .doc(initialData.id)
            .collection('bagpack')
            .limit(1); // Pegamos apenas o primeiro (e único) documento da mochila

        const subscriber = bagpackQuery.onSnapshot(querySnapshot => {
            if (!querySnapshot.empty) {
                const bagpackDoc = querySnapshot.docs[0];
                const data = bagpackDoc.data();
                setBagpackDocId(bagpackDoc.id); // Guardamos o ID do doc da mochila

                // Preenchemos os estados do formulário
                setPlatina(String(data.platina || '0'));
                setGold(String(data.gold || '0'));
                setSilver(String(data.silver || '0'));
                setCopper(String(data.copper || '0'));
                setItems(data.items || '');
            }
            setIsLoading(false);
        }, error => {
            console.error("Erro ao buscar mochila:", error);
            setIsLoading(false);
        });

        return () => subscriber();
    }, [initialData]);

    const handleSave = () => {
        if (!bagpackDocId) return; // Não salva se não tiver o ID da mochila

        const dataToSave = {
            platina: parseInt(platina, 10) || 0,
            gold: parseInt(gold, 10) || 0,
            silver: parseInt(silver, 10) || 0,
            copper: parseInt(copper, 10) || 0,
            items: items || '',
        };
        // 3. PASSA O ID DA MOCHILA DE VOLTA
        onSave(dataToSave, bagpackDocId);
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 40 }} />;
    }

    // Dentro do componente ItemsBagPack

    return (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Mochila de {initialData?.characterName}</Text>

            {/* --- ESTRUTURA JSX CORRIGIDA --- */}

            {/* Linha para Platina e Ouro */}
            <View style={styles.row}>
                {/* Campo 1: Platina */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Platina</Text>
                    <TextInput
                        style={styles.currencyInput}
                        value={platina}
                        onChangeText={setPlatina}
                        keyboardType="numeric"
                    />
                </View>

                {/* Campo 2: Ouro */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Ouro</Text>
                    <TextInput
                        style={styles.currencyInput}
                        value={gold}
                        onChangeText={setGold}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            {/* Linha para Prata e Bronze */}
            <View style={styles.row}>
                {/* Campo 3: Prata */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Prata</Text>
                    <TextInput
                        style={styles.currencyInput}
                        value={silver}
                        onChangeText={setSilver}
                        keyboardType="numeric"
                    />
                </View>

                {/* Campo 4: Bronze */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Bronze</Text>
                    <TextInput
                        style={styles.currencyInput}
                        value={copper}
                        onChangeText={setCopper}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            {/* Campo de Itens (ocupando a largura toda) */}
            <Text style={styles.label}>Itens</Text>
            <TextInput
                style={styles.itemsInput}
                value={items}
                onChangeText={setItems}
                multiline={true} // Permite múltiplas linhas
                numberOfLines={4} // Altura inicial
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
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 5,
    },
    
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    fieldContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    
    currencyInput: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        fontSize: 16,
        textAlign: 'center',
    },
    
    itemsInput: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        fontSize: 16,
        height: 100,
        textAlignVertical: 'top'
    },
    
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    characterName: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        fontSize: 16,
        width: "auto"
    },
});

export default ItemsBagPack;