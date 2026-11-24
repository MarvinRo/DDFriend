import ExitButton from '@/components/ExitButton';
import { Progress } from '@/components/ui/Progress';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { collection, doc, onSnapshot, updateDoc, addDoc } from '@react-native-firebase/firestore';
import { db } from '@/lib/firebase';


const ShieldInput = ({ label, value, onChange, onBlur, isFromMaster, onCheckMaster }: any) => {
    return (
        <View className="w-[75px] h-[85px] items-center justify-center m-1">
            <View className="absolute inset-0 items-center justify-center">
                <Image source={require('@/assets/images/Armadura.png')} style={{ width: 200, height: 200, resizeMode: 'contain' }} />
            </View>
            <View className="flex-col items-center justify-center w-full h-full pt-1 relative">
                <TextInput
                    editable={!isFromMaster}
                    className="text-textColor-primary text-[24px] font-bold text-center p-0 m-0 w-full"
                    keyboardType="numeric"
                    value={value ? value.toString() : ''}
                    onChangeText={(text) => onChange(Number(text.replace(/[^0-9]/g, '')))}
                    onBlur={onBlur}
                    maxLength={2}
                />
                {isFromMaster && <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={onCheckMaster} activeOpacity={1} />}
            </View>
        </View>
    );
};

export default function CharacterBag({ route }: any) {
    const arrowLeftXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C49A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`
    const sheetIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`
    const bagItensXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-backpack-icon lucide-backpack"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>`
    const spellBookXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked-icon lucide-book-marked"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>`
    const bookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text-icon lucide-book-open-text"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>`



    const navigation = useNavigation<any>();
    const character = route?.params?.character || {};
    const isFromMaster = route?.params?.fromMaster;
    const campaign = route?.params?.campaign;

    const [bagpack, setBagpack] = useState('');
    const [platina, setPlatina] = useState(0);
    const [gold, setGold] = useState(0);
    const [silver, setSilver] = useState(0);
    const [electrum, setElectrum] = useState(0);
    const [armorClass, setArmorClass] = useState(character.armorClass || 10);
    const [copper, setCopper] = useState(0);
    const [bagpackDocId, setBagpackDocId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const populateBagpack = (doc: any) => {
        setBagpackDocId(doc.id);
        const data = doc.data();
        setBagpack(data.items || '');
        setPlatina(data.platina || 0);
        setGold(data.gold || 0);
        setSilver(data.silver || 0);
        setElectrum(data.electrum || 0);
        setCopper(data.copper || 0);
    };

    // Últimos valores gravados por este aparelho: a confirmação do servidor traz esses mesmos dados,
    // e aplicá-los apagaria o que o jogador está digitando em outro campo nesse meio-tempo
    const lastWrittenBagRef = useRef<string | null>(null);
    const lastWrittenArmorRef = useRef<number | null>(null);

    // Bolsa em tempo real (o mestre vê as mudanças do jogador sem reabrir a tela)
    useEffect(() => {
        if (!character.id) return;
        const unsubscribe = onSnapshot(
            collection(db, 'characterSheets', character.id, 'bagpack'),
            (snapshot) => {
                if (!snapshot || snapshot.metadata.hasPendingWrites || snapshot.empty) return;
                const bagDoc = snapshot.docs[0];
                const data = bagDoc.data();
                const incoming = JSON.stringify({
                    items: data.items || '', platina: data.platina || 0, gold: data.gold || 0,
                    silver: data.silver || 0, electrum: data.electrum || 0, copper: data.copper || 0,
                });
                if (incoming === lastWrittenBagRef.current) {
                    setBagpackDocId(bagDoc.id);
                    return;
                }
                populateBagpack(bagDoc);
            },
            (error) => console.error("Erro ao carregar bolsa:", error)
        );
        return () => unsubscribe();
    }, [character.id]);

    // CA fica no documento da ficha
    useEffect(() => {
        if (!character.id) return;
        const unsubscribe = onSnapshot(
            doc(db, 'characterSheets', character.id),
            (snapshot) => {
                if (!snapshot?.exists() || snapshot.metadata.hasPendingWrites) return;
                const remoteArmor = snapshot.data()?.armorClass;
                if (remoteArmor === undefined || remoteArmor === lastWrittenArmorRef.current) return;
                setArmorClass(remoteArmor);
            },
            (error) => console.error("Erro ao acompanhar a CA:", error)
        );
        return () => unsubscribe();
    }, [character.id]);

    const checkMasterAccess = () => {
        if (isFromMaster) {
            Alert.alert("Acesso Negado", "Você é o mestre pare de tendar modificar a ficha de seu jogador( seu safado)");
            return true;
        }
        return false;
    };

    const saveBagpack = async () => {
        if (isFromMaster) return;
        if (!character.id) return;
        setIsSaving(true);

        const bagpackData = {
            items: bagpack,
            platina,
            gold,
            silver,
            electrum,
            copper,
        };

        lastWrittenBagRef.current = JSON.stringify(bagpackData);
        lastWrittenArmorRef.current = armorClass;

        try {
            await updateDoc(doc(db, 'characterSheets', character.id), {
                armorClass: armorClass
            });

            const bagpackRef = collection(db, 'characterSheets', character.id, 'bagpack');

            if (bagpackDocId) {
                // Se já existir um documento na subcoleção, apenas atualiza
                await updateDoc(doc(bagpackRef, bagpackDocId), bagpackData);
            } else {
                // Se o personagem ainda não tiver nenhum documento na bolsa, cria um
                const newDoc = await addDoc(bagpackRef, bagpackData);
                setBagpackDocId(newDoc.id);
            }
        } catch (error) {
            console.error("Erro ao salvar bolsa:", error);
            Alert.alert("Erro", "Não foi possível salvar as alterações da bolsa.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-background p-4'>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1}}>
            <View className="flex-1 items-center justify-center">
                <ScrollView className="flex-1 w-full" contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                    <View className=" w-full bg-card rounded-lg p-4 mt-0 border border-gold mb-2">
                        <View className="flex-row justify-between items-center mb-4 border-b border-gold pb-2">
                            <Text className="text-gold font-bold text-lg">Bolsa do Personagem</Text>
                        <TouchableOpacity onPress={() => { if (isFromMaster) { checkMasterAccess(); } else { saveBagpack(); } }} disabled={isSaving} className="bg-gold-light px-3 py-1 rounded">
                                <Text className="text-gold-dark font-bold text-sm">{isSaving ? 'Salvando...' : 'Salvar'}</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={true} className="h-[250px]" nestedScrollEnabled={true}>
                        <View className="relative w-full">
                            <TextInput
                                editable={!isFromMaster}
                                multiline
                                textAlignVertical="top"
                                className="text-textColor-primary text-[16px] min-h-[250px]"
                                value={bagpack}
                                onChangeText={setBagpack}
                                onBlur={saveBagpack}
                                placeholder="Ex: 1x Espada Longa&#10;5x Poções de Cura&#10;Corda de 15m..."
                                placeholderTextColor="#666"
                            />
                            {isFromMaster && <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={checkMasterAccess} activeOpacity={1} />}
                        </View>
                        </ScrollView>
                    </View>
                    <View className="w-full bg-card rounded-lg p-4 border border-gold mb-4 flex-row justify-between items-center">
                        <Text className="text-gold font-bold text-lg w-1/2">Classe de Armadura (CA)</Text>
                    <ShieldInput label="CA" value={armorClass} onChange={setArmorClass} onBlur={saveBagpack} isFromMaster={isFromMaster} onCheckMaster={checkMasterAccess} />
                    </View>
                    <View className=" w-full bg-card rounded-lg p-4 border border-gold mb-20">
                        <View className="flex-row justify-between items-center mb-4 border-b border-gold pb-2">
                            <Text className="text-gold font-bold text-lg">Carteira do Personagem</Text>
                        </View>
                        <View className="flex-row flex-wrap justify-between gap-y-4">
                            <View className="w-[30%] items-center">
                                <Text className="text-textColor-secondary font-bold mb-1">Platina (PL)</Text>
                            <View className="relative w-full">
                                <TextInput editable={!isFromMaster} className="bg-background border border-gold-light text-textColor-primary text-center rounded p-2 w-full" keyboardType="numeric" value={String(platina)} onChangeText={(val) => setPlatina(Number(val.replace(/[^0-9]/g, '')))} onBlur={saveBagpack} />
                                {isFromMaster && <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={checkMasterAccess} activeOpacity={1} />}
                            </View>
                            </View>
                            <View className="w-[30%] items-center">
                                <Text className="text-textColor-secondary font-bold mb-1">Ouro (PO)</Text>
                            <View className="relative w-full">
                                <TextInput editable={!isFromMaster} className="bg-background border border-gold-light text-textColor-primary text-center rounded p-2 w-full" keyboardType="numeric" value={String(gold)} onChangeText={(val) => setGold(Number(val.replace(/[^0-9]/g, '')))} onBlur={saveBagpack} />
                                {isFromMaster && <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={checkMasterAccess} activeOpacity={1} />}
                            </View>
                            </View>
                            <View className="w-[30%] items-center">
                                <Text className="text-textColor-secondary font-bold mb-1">Electrum (PE)</Text>
                            <View className="relative w-full">
                                <TextInput editable={!isFromMaster} className="bg-background border border-gold-light text-textColor-primary text-center rounded p-2 w-full" keyboardType="numeric" value={String(electrum)} onChangeText={(val) => setElectrum(Number(val.replace(/[^0-9]/g, '')))} onBlur={saveBagpack} />
                                {isFromMaster && <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={checkMasterAccess} activeOpacity={1} />}
                            </View>
                            </View>
                            <View className="w-[30%] items-center">
                                <Text className="text-textColor-secondary font-bold mb-1">Prata (PP)</Text>
                            <View className="relative w-full">
                                <TextInput editable={!isFromMaster} className="bg-background border border-gold-light text-textColor-primary text-center rounded p-2 w-full" keyboardType="numeric" value={String(silver)} onChangeText={(val) => setSilver(Number(val.replace(/[^0-9]/g, '')))} onBlur={saveBagpack} />
                                {isFromMaster && <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={checkMasterAccess} activeOpacity={1} />}
                            </View>
                            </View>
                            <View className="w-[30%] items-center">
                                <Text className="text-textColor-secondary font-bold mb-1">Cobre (PC)</Text>
                            <View className="relative w-full">
                                <TextInput editable={!isFromMaster} className="bg-background border border-gold-light text-textColor-primary text-center rounded p-2 w-full" keyboardType="numeric" value={String(copper)} onChangeText={(val) => setCopper(Number(val.replace(/[^0-9]/g, '')))} onBlur={saveBagpack} />
                                {isFromMaster && <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={checkMasterAccess} activeOpacity={1} />}
                            </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View className="absolute bottom-0 flex-row justify-center w-full h-18 items-center bg-card rounded-lg p-2 border border-gold gap-2">
                        <TouchableOpacity className='w-[33%] border border-t-gold border-x-transparent border-b-transparent justify-center items-center flex-row gap-2'
                        onPress={() => navigation.navigate('CharacterSheet', { character: { ...character, armorClass }, fromMaster: isFromMaster, campaign })}>
                            <SvgXml className="color-gold mb-3" xml={sheetIconXml} width="20px" height="20px" />
                            <Text className="text-gold font-bold text-lg mb-2 pb-1">Ficha</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-[33%] border border-t-gold border-x-transparent border-b-transparent justify-center items-center flex-row gap-2'
                        onPress={() => navigation.navigate('CharacterMagic', { character, fromMaster: isFromMaster, campaign })}>
                            <SvgXml className="color-gold mb-3" xml={spellBookXml} width="20px" height="20px" />
                            <Text className="text-gold font-bold text-lg mb-2 pb-1">Magias</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='w-[33%] border border-t-gold border-x-transparent border-b-transparent justify-center items-center flex-row gap-2'
                            onPress={() => navigation.navigate('Books', { isMaster: isFromMaster })}>
                            <SvgXml className="color-gold mb-3" xml={bookIcon} width="20px" height="20px" />
                            <Text className="text-gold font-bold text-lg mb-2 pb-1">Livros</Text>
                        </TouchableOpacity>
                    </View>
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>

    );
}