// src/components/LevelEditForm.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import {ItemsBagPackStyle} from '../styles/ItemsBagPackStyle'
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
    
    const [bagpackDocId, setBagpackDocId] = useState<string | null>(null);
    const [platina, setPlatina] = useState(0);
    const [gold, setGold] = useState(0);
    const [silver, setSilver] = useState(0);
    const [electrum, setElectrum] = useState(0);
    const [armor, setArmor] = useState(0);
    const [copper, setCopper] = useState(0);
    const [items, setItems] = useState('');

    useEffect(() => {
        if (!initialData?.id) return;

        const bagpackQuery = firestore()
            .collection('characterSheets')
            .doc(initialData.id)
            .collection('bagpack')
            .limit(1);

        const subscriber = bagpackQuery.onSnapshot(querySnapshot => {
            if (!querySnapshot.empty) {
                const bagpackDoc = querySnapshot.docs[0];
                const data = bagpackDoc.data();
                setBagpackDocId(bagpackDoc.id);

                setPlatina(data.platina || 0);
                setGold(data.gold || 0);
                setSilver(data.silver || 0);
                setElectrum(data.electrum || 0);
                setCopper(data.copper || 0);
                setItems(data.items || '');
                setArmor(data.armor || 0);
            }
            setIsLoading(false);
        }, error => {
            console.error("Erro ao buscar mochila:", error);
            setIsLoading(false);
        });

        return () => subscriber();
    }, [initialData]);

    const handleSave = () => {
        if (!bagpackDocId) return;

        const dataToSave = {
            platina: platina || 0,
            gold: gold || 0,
            silver: silver || 0,
            copper: copper || 0,
            electrum: electrum || 0,
            armor: armor || 0,
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
        <View style={ItemsBagPackStyle.formContainer}>
            <Text style={ItemsBagPackStyle.formTitle}>Mochila de {initialData?.characterName}</Text>
            <View style={ItemsBagPackStyle.row}>
                <View style={ItemsBagPackStyle.fieldContainer}>
                    <Text style={ItemsBagPackStyle.label}>Platina</Text>
                    <TextInput
                        style={ItemsBagPackStyle.currencyInput}
                        value={platina.toString()} 
                        onChangeText={(text) =>setPlatina(Number(text))}
                        keyboardType="numeric"
                    />
                </View>
                <View style={ItemsBagPackStyle.fieldContainer}>
                    <Text style={ItemsBagPackStyle.label}>Ouro</Text>
                    <TextInput
                        style={ItemsBagPackStyle.currencyInput}
                        value={gold.toString()}
                        onChangeText={(text) =>setGold(Number(text))}
                        keyboardType="numeric"
                    />
                </View>
            </View>
            <View style={ItemsBagPackStyle.row}>
                <View style={ItemsBagPackStyle.fieldContainer}>
                    <Text style={ItemsBagPackStyle.label}>Prata</Text>
                    <TextInput
                        style={ItemsBagPackStyle.currencyInput}
                        value={silver.toString()}
                        onChangeText={(text) =>setSilver(Number(text))}
                        keyboardType="numeric"
                    />
                </View>
                <View style={ItemsBagPackStyle.fieldContainer}>
                    <Text style={ItemsBagPackStyle.label}>Electrum</Text>
                    <TextInput
                        style={ItemsBagPackStyle.currencyInput}
                        value={electrum.toString()}
                        onChangeText={(text) =>setElectrum(Number(text))}
                        keyboardType="numeric"
                    />
                </View>
            </View>
            <View style={ItemsBagPackStyle.row}>
                <View style={ItemsBagPackStyle.fieldContainer}>
                    <Text style={ItemsBagPackStyle.label}>Bronze</Text>
                    <TextInput
                        style={ItemsBagPackStyle.currencyInput}
                        value={copper.toString()}
                        onChangeText={(text) =>setCopper(Number(text))}
                        keyboardType="numeric"
                    />
                </View>
                <View style={ItemsBagPackStyle.fieldContainer}>
                    <Text style={ItemsBagPackStyle.label}>Classe de Armadura</Text>
                    <TextInput
                        style={ItemsBagPackStyle.currencyInput}
                        value={armor.toString()}
                        onChangeText={(text) =>setArmor(Number(text))}
                        keyboardType="numeric"
                    />
                </View>
            </View>
            <Text style={ItemsBagPackStyle.label}>Itens</Text>
            <TextInput
                style={ItemsBagPackStyle.itemsInput}
                value={items}
                onChangeText={setItems}
                multiline={true}
                numberOfLines={4}
            />

            <View style={ItemsBagPackStyle.formButtons}>
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

export default ItemsBagPack;