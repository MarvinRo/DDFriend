import ExitButton from '@/components/ExitButton';
import { Progress } from '@/components/ui/Progress';
import { useNavigation } from "@react-navigation/native";
import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import firestore from '@react-native-firebase/firestore';



const AttributeHexagon = ({ label, value, modifier }: { label: string, value: number, modifier?: number }) => {
    const hexSvg = `<svg viewBox="0 0 104 120" fill="transparent" xmlns="http://www.w3.org/2000/svg">
        <path d="M52 4 L100 32 L100 88 L52 116 L4 88 L4 32 Z" stroke="#C49A4A" stroke-width="4"/>
    </svg>`;

    return (
        <View className="w-[75px] h-[85px] items-center justify-center m-1">
            <View className="absolute inset-0 items-center justify-center">
                <SvgXml xml={hexSvg} width="100%" height="100%" />
            </View>
            <View className="flex-col items-center justify-center w-full h-full pb-1">
                <Text className="text-textColor-secondary text-[12px] font-bold bg-transparent">{label}</Text>
                <Text
                    className="text-textColor-primary text-[20px] font-bold text-center p-0 m-0 w-full"
                >{value}</Text>
                {modifier !== undefined && (
                    <Text className="text-textColor-secondary text-[12px] font-bold text-center p-0 m-0 w-full">
                        ({modifier > 0 ? '+' : ''}{modifier})
                    </Text>
                )}
            </View>
        </View>
    );
};

const ArmorClassShield = ({ value }: { value: number }) => {
    return (
        <View className="w-[70px] h-[80px] items-center justify-center">
            <View className="absolute inset-0 items-center justify-center">
                <Image source={require('@/assets/images/Armadura.png')} style={{ marginTop: 17, width: 200, height: 200, resizeMode: 'contain' }} />
            </View>
            <View className="flex-col items-center justify-center w-full h-full pt-1">
                <Text className="text-textColor-primary text-[22px] font-bold text-center p-0 mt-6 w-full">{value}</Text>
            </View>
        </View>
    );
};

export default function CharacterSheet({ route }: any) {
    const arrowLeftXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C49A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`
    const bagItensXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-backpack-icon lucide-backpack"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>`
    const spellBookXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked-icon lucide-book-marked"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>`
    const bookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text-icon lucide-book-open-text"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>`


    const navigation = useNavigation<any>();
    // Pega os dados do personagem passados pela navegação
    const character = route?.params?.character || {};
    const isFromMaster = route?.params?.fromMaster;
    const campaign = route?.params?.campaign;
    const armor = route;

    // Estado local para a Vida Temporária/Atual (inicia com o valor salvo na ficha)
    const [currentLifeStr, setCurrentLifeStr] = useState(String(character.currentLife !== undefined ? character.currentLife : (character.life || 0)));
    const currentLife = parseInt(currentLifeStr, 10) || 0;
    const lifeInputRef = useRef<TextInput>(null);

    // Função que salva a vida em tempo real no banco para espelhar na mesa do Mestre
    const handleUpdateLife = async (newLife: number) => {
        setCurrentLifeStr(String(newLife));
        if (character.id) {
            try {
                await firestore().collection('characterSheets').doc(character.id).update({ currentLife: newLife });
            } catch (error) {
                console.error("Erro ao atualizar vida no Firebase:", error);
            }
        }
    };

    const checkMasterAccess = () => {
        if (isFromMaster) {
            Alert.alert("Acesso Negado", "Você é o mestre pare de tendar modificar a ficha de seu jogador( seu safado)");
            return true;
        }
        return false;
    };

    // Funções para calcular os modificadores específicos (Atributo Base + Bônus de Proficiência)
    const getSafeguardMod = (name: string) => {
        let mod = 0;
        switch (name) {
            case 'Força': mod = Math.floor((character.strength - 10) / 2); break;
            case 'Destreza': mod = Math.floor((character.dexterity - 10) / 2); break;
            case 'Constituição': mod = Math.floor((character.constitution - 10) / 2); break;
            case 'Inteligencia': mod = Math.floor((character.intelligence - 10) / 2); break;
            case 'Sabedoria': mod = Math.floor((character.wisdom - 10) / 2); break;
            case 'Carisma': mod = Math.floor((character.charisma - 10) / 2); break;
        }
        const total = (mod || 0);
        return total > 0 ? `+${total}` : total;
    };



    const getSkillMod = (name: string) => {
        let mod = 0;
        switch (name) {
            case 'Atletismo': mod = Math.floor((character.strength - 10) / 2); break;
            case 'Acrobacia': mod = Math.floor((character.dexterity - 10) / 2); break;
            case 'Furtividade': mod = Math.floor((character.dexterity - 10) / 2); break;
            case 'Prestidigitação(Ladinagem)': mod = Math.floor((character.dexterity - 10) / 2); break;
            case 'Arcanismo': mod = Math.floor((character.intelligence - 10) / 2); break;
            case 'História': mod = Math.floor((character.intelligence - 10) / 2); break;
            case 'Investigação': mod = Math.floor((character.intelligence - 10) / 2); break;
            case 'Natureza': mod = Math.floor((character.intelligence - 10) / 2); break;
            case 'Religião': mod = Math.floor((character.intelligence - 10) / 2); break;
            case 'Intuição': mod = Math.floor((character.wisdom - 10) / 2); break;
            case 'Lidar com Animais': mod = Math.floor((character.wisdom - 10) / 2); break;
            case 'Medicina': mod = Math.floor((character.wisdom - 10) / 2); break;
            case 'Percepção': mod = Math.floor((character.wisdom - 10) / 2); break;
            case 'Sobrevivência': mod = Math.floor((character.wisdom - 10) / 2); break;
            case 'Atuação': mod = Math.floor((character.charisma - 10) / 2); break;
            case 'Enganação': mod = Math.floor((character.charisma - 10) / 2); break;
            case 'Intimidação': mod = Math.floor((character.charisma - 10) / 2); break;
            case 'Persuasão': mod = Math.floor((character.charisma - 10) / 2); break;
        }
        const total = (mod || 0);
        return total > 0 ? `+${total}` : total;
    };
    return (
        <SafeAreaView className='flex-1 bg-background p-4'>
            <TouchableOpacity
                className="absolute top-6 left-4 z-50 bg-card p-2 rounded-full border border-gold mt-8"
                onPress={() => {
                    if (isFromMaster) {
                    if (campaign) {
                        navigation.navigate('MasterCampaignView', { campaign });
                    } else {
                        navigation.navigate('MasterCampaignView');
                    }
                    } else {
                        navigation.navigate('HomePlayer');
                    }
                }}
            >
                <SvgXml xml={arrowLeftXml} width="24" height="24" />
            </TouchableOpacity>
            <View className="items-center justify-center">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="items-center mb-6 mt-8 w-full relative">
                        {character.characterPhoto ? (
                            <Image source={{ uri: character.characterPhoto }} className="w-32 h-32 rounded-full border-2 border-gold mb-4" />
                        ) : (
                            <View className="w-32 h-32 rounded-full border-2 border-gold bg-card items-center justify-center mb-4">
                                <Text className="text-gold text-4xl font-bold">{(character.characterName || 'S').charAt(0).toUpperCase()}</Text>
                            </View>
                        )}
                        <Text className='text-gold text-2xl font-bold'>{character.characterName || 'Sem Nome'}</Text>
                        <Text className='text-textColor-secondary text-lg mt-1'>{character.characterRace || 'Raça Indefinida'} • {character.characterClass || 'Classe Indefinida'} • Lv.{character.level || 1}</Text>
                    </View>

                    <View className="bg-card rounded-lg p-4 border border-gold mb-4">
                        <Text className="text-gold font-bold text-lg mb-4 border-b border-gold pb-1">Informações do Personagem</Text>
                        <View className="flex-row justify-between mb-2"><Text className="text-textColor-primary font-bold">Movimento:</Text><Text className="text-textColor-secondary">{character.movement || 0}Q</Text></View>
                        <View className="flex-row justify-between mb-2"><Text className="text-textColor-primary font-bold">Bônus de Proficiência:</Text><Text className="text-textColor-secondary">+{character.efficiencyBonus || 0}</Text></View>
                        <View className="flex-row justify-between mb-2"><Text className="text-textColor-primary font-bold">Tendência:</Text><Text className="text-textColor-secondary">{character.characterTrend || 'N/A'}</Text></View>
                    </View>
                    <View className="bg-card rounded-lg p-4 border border-gold mb-4">
                        <Text className="text-gold font-bold text-lg mb-4 border-b border-gold pb-1">Salvaguarda</Text>
                        <View className="flex-row flex-wrap justify-between gap-y-2 mb-2">
                            {character.selectedSafeguards && character.selectedSafeguards.length > 0 ? (
                                character.selectedSafeguards.map((safeguard: string, index: number) => (
                                    <View key={index} className="w-[48%] flex-row justify-between items-center  border border-gold-light rounded p-2">
                                        <Text className="text-textColor-primary font-bold text-xs flex-1 mr-1">{safeguard}</Text>
                                        <Text className="text-gold font-bold">{getSafeguardMod(safeguard)}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text className="text-textColor-secondary">Nenhuma salvaguarda selecionada</Text>
                            )}
                        </View>
                    </View>

                    <View className="bg-card rounded-lg p-4 border border-gold mb-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gold font-bold text-lg">Pontos de Vida</Text>
                            <View className="flex-row items-center gap-3">
                                <TouchableOpacity onPress={() => {
                                    if (checkMasterAccess()) return;
                                    const newLife = Math.max(0, currentLife - 1);
                                    handleUpdateLife(newLife);
                                }} className="bg-destructive w-8 h-8 rounded-full items-center justify-center">
                                    <Text className="text-white font-bold text-xl">-</Text>
                                </TouchableOpacity>
                                <View className="flex-row items-center justify-center min-w-[70px]">
                                    <View className="relative">
                                        <TextInput
                                            ref={lifeInputRef}
                                            className="text-textColor-secondary font-bold text-lg p-0 m-0 text-center min-w-[30px]"
                                            keyboardType="numeric"
                                            value={currentLifeStr}
                                            onChangeText={(text) => setCurrentLifeStr(text.replace(/[^0-9]/g, ''))}
                                            onEndEditing={() => handleUpdateLife(Number(currentLifeStr) || 0)}
                                            selectTextOnFocus
                                            editable={!isFromMaster}
                                        />
                                        {isFromMaster && <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={checkMasterAccess} activeOpacity={1} />}
                                    </View>
                                    <Text className="text-textColor-secondary font-bold text-lg"> / {character.life || 0}</Text>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    if (checkMasterAccess()) return;
                                    const newLife = currentLife + 1;
                                    handleUpdateLife(newLife);
                                }} className="bg-green-600 w-8 h-8 rounded-full items-center justify-center">
                                    <Text className="text-white font-bold text-xl">+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {
                            if (checkMasterAccess()) return;
                            lifeInputRef.current?.focus();
                        }}>
                            <Progress value={currentLife} max={character.life || 1} className="mb-2" />
                        </TouchableOpacity>
                    </View>
                    <View className="w-full items-center justify-center py-2 mb-4">
                        <View className="mb-4">
                            <ArmorClassShield value={character.armorClass || 10} />
                        </View>
                        <View className="flex-row gap-2 justify-center z-10">
                            <AttributeHexagon label="FOR" value={character.strength} modifier={Math.floor((character.strength - 10) / 2)} />
                            <AttributeHexagon label="DES" value={character.dexterity} modifier={Math.floor((character.dexterity - 10) / 2)} />
                            <AttributeHexagon label="CON" value={character.constitution} modifier={Math.floor((character.constitution - 10) / 2)} />
                        </View>
                        <View className="flex-row gap-2 justify-center mt-2 z-20">
                            <AttributeHexagon label="INT" value={character.intelligence} modifier={Math.floor((character.intelligence - 10) / 2)} />
                            <AttributeHexagon label="SAB" value={character.wisdom} modifier={Math.floor((character.wisdom - 10) / 2)} />
                            <AttributeHexagon label="CAR" value={character.charisma} modifier={Math.floor((character.charisma - 10) / 2)} />
                        </View>
                    </View>
                    <View className="bg-card rounded-lg p-4 border border-gold mb-20">
                        <Text className="text-gold font-bold text-lg mb-4 border-b border-gold pb-1">Pericias Treinadas</Text>
                        <View className="flex-row flex-wrap justify-between gap-y-2 mb-2">
                            {character.selectedSkills && character.selectedSkills.length > 0 ? (
                                character.selectedSkills.map((skill: string, index: number) => (
                                    <View key={index} className="w-[48%] flex-row justify-between items-center border border-gold-light rounded p-2">
                                        <Text className="text-textColor-primary font-bold text-xs flex-1 mr-1">{skill}</Text>
                                        <Text className="text-gold font-bold">{getSkillMod(skill)}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text className="text-textColor-secondary">Nenhuma perícia selecionada</Text>
                            )}
                        </View>
                    </View>

                </ScrollView>
                <View className=" absolute bottom-0 flex-row justify-center w-full h-18 items-center bg-card rounded-lg p-2 border border-gold gap-2">
                    <TouchableOpacity className='w-[33%] border border-t-gold border-x-transparent border-b-transparent justify-center items-center flex-row gap-2'
                    onPress={() => navigation.navigate('CharacterBag', { character, fromMaster: isFromMaster, campaign })}>
                        <SvgXml className="color-gold mb-3" xml={bagItensXml} width="20px" height="20px" />
                        <Text className="text-gold font-bold text-lg mb-2 pb-1">Bolsa</Text>
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
        </SafeAreaView>

    );
}