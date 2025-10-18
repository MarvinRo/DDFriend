/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Modal,
    ImageBackground,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

type ViewSheetProps = {
    initialData: {
        modCharisma: number;
        modWisdom: number;
        modIntelligence: number;
        modConstitution: number;
        modStrength: number;
        life:string;
        characterRace: string;
        characterName: string;
        characterClass: string;
        level: number;
        characterAntecedent: string;
        characterTrend: string;
        experience: number;
        strength: number;
        wisdom: number;
        charisma: number;
        intelligence: number;
        constitution: number;
        dexterity: number;
        modDexterity: number
        platina: number;
        gold: number;
        electrum: number;
        silver: number;
        copper: number;
        armor: number;
        movement:number;
        efficiencyBonus:number;
        selectedSkills: string[];
        selectedSafeguards:string[];
    }
    initialBag: {
        platina: number;
        gold: number;
        electrum: number;
        silver: number;
        copper: number;
        armor: number;
        items: string;
    }
    userInfo: { _user: { displayName: string } }
    onClose: () => void;
};

const ViewSheet = ({ onClose, initialData, initialBag, userInfo }: ViewSheetProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const imageUrls = [
        { props: { source: require('../assets/images/ficha-p1.png') } },
        { props: { source: require('../assets/images/ficha-p2.png') } },
        { props: { source: require('../assets/images/ficha-p3.png') } },
    ];
    const overlays = [
        (
            <>
                {/* informações da ficha */}
                <View style={[styles.infoContainer, { top: '4.5%', left: '20%' }]}>
                    <Text style={styles.infoText}>{initialData.characterName}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '3.5%', left: '78%' }]}>
                    <Text style={styles.infoText}>{userInfo._user.displayName}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '3.3%', left: '43%' }]}>
                    <Text style={styles.infoText}>{initialData.characterClass}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '3.3%', left: '53%' }]}>
                    <Text style={styles.infoText}>Lv.{initialData.level}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '3.3%', left: '59.7%' }]}>
                    <Text style={styles.infoText}>{initialData.characterAntecedent}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '6.8%', left: '43%' }]}>
                    <Text style={styles.infoText}>{initialData.characterRace}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '6.8%', left: '57%' }]}>
                    <Text style={styles.infoText}>{initialData.characterTrend}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '6.8%', left: '84%' }]}>
                    <Text style={styles.infoText}>{initialData.experience}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '24%', left: '48%' }]}>
                    <Text style={styles.status}>{initialData.life}</Text>
                </View>
                {/* informações de statos e modificadores */}
                <View style={[styles.infoContainer, { top: '17%', left: '4.5%' }]}>
                    <Text style={styles.status}>{initialData.strength}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '20.3%', left: '6%' }]}>
                    <Text style={styles.modifierStatus}>{initialData.modStrength}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '26%', left: '4.5%' }]}>
                    <Text style={styles.status}>{initialData.dexterity}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '29.7%', left: '6%' }]}>
                    <Text style={styles.modifierStatus}>{initialData.modDexterity}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '35.5%', left: '4.5%' }]}>
                    <Text style={styles.status}>{initialData.constitution}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '39%', left: '6%' }]}>
                    <Text style={styles.modifierStatus}>{initialData.modConstitution}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '44.5%', left: '4.5%' }]}>
                    <Text style={styles.status}>{initialData.intelligence}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '48.4%', left: '6%' }]}>
                    <Text style={styles.modifierStatus}>{initialData.modIntelligence}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '54%', left: '4.5%' }]}>
                    <Text style={styles.status}>{initialData.wisdom}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '57.8%', left: '6%' }]}>
                    <Text style={styles.modifierStatus}>{initialData.modWisdom}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '63.5%', left: '4.5%' }]}>
                    <Text style={styles.status}>{initialData.charisma}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '67%', left: '6%' }]}>
                    <Text style={styles.modifierStatus}>{initialData.modCharisma}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '73.4%', left: '2.5%' }]}>
                    <Text style={styles.modifierStatus}>{initialData.modWisdom + 10}</Text>
                </View>
                {/* Bônus de proeficiência */}
                <View style={[styles.infoContainer, { top: '19%', left: '14.8%' }]}>
                    <Text style={styles.modifier}>{initialData.efficiencyBonus > 0 ? "+"+ initialData.efficiencyBonus : 0}</Text>
                </View>
                {/* Informações de Salvaguardas */}
                <View style={[styles.infoContainer, { top: '23.3%', left: '17.1%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSafeguards.includes('Força') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modStrength}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '19%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSafeguards.includes('Força') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '25%', left: '17.1%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSafeguards.includes('Destreza') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modDexterity}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '20.8%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSafeguards.includes('Destreza') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '25%', left: '17.1%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSafeguards.includes('Destreza') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modDexterity}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '20.8%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSafeguards.includes('Destreza') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '26.8%', left: '17.1%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSafeguards.includes('Constituição') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modConstitution}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '22.5%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSafeguards.includes('Constituição') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '28.6%', left: '17.1%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSafeguards.includes('Inteligencia') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modIntelligence}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '24.3%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSafeguards.includes('Inteligencia') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '28.6%', left: '17.1%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSafeguards.includes('Inteligencia') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modIntelligence}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '24.3%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSafeguards.includes('Inteligencia') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '30.3%', left: '17.1%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSafeguards.includes('Sabedoria') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modWisdom}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '26%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSafeguards.includes('Sabedoria') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '32%', left: '17.1%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSafeguards.includes('Carisma') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modCharisma}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '27.8%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSafeguards.includes('Carisma') ? '.' : ''}
                    </Text>
                </View>
                {/* Informações de Pericias */}
                <View style={[styles.infoContainer, { top: '34%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Acrobacia') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '38.3%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Acrobacia') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modDexterity}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '35.78%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Arcanismo') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '40%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Arcanismo') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modIntelligence}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '37.5%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Atletismo') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '41.8%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Atletismo') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modStrength}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '39.28%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Atuação') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '43.56%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Atuação') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modCharisma}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '41%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Enganação') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '45.3%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Enganação') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modCharisma}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '42.8%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Furtividade') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '47%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Furtividade') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modDexterity}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '44.5%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('História') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '48.8%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Furtividade') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modIntelligence}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '46.3%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Intimidação') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '50.6%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Intimidação') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modCharisma}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '48.06%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Intuição') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '52.3%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Intuição') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modWisdom}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '49.8%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Investigação') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '54%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Investigação') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modIntelligence}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '51.55%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Lidar com Animais') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '55.8%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Lidar com Animais') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modWisdom}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '53.3%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Medicina') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '57.7%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Medicina') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modWisdom}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '55.1%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Natureza') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '59.3%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Natureza') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modIntelligence}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '56.8%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Percepção') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '61.2%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Percepção') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modWisdom}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '58.6%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Persuasão') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '62.9%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Persuasão') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modCharisma}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '60.4%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Prestidigitação(Ladinagem)') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '64.7%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Furtividade') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modDexterity}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '62.1%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Religião') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '66.4%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Religião') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modIntelligence}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '63.9%', left: '14.1%' }]}>
                    <Text style={styles.selectedSkillss}>
                        {initialData.selectedSkills.includes('Sobrevivência') ? '.' : ''}
                    </Text>
                </View>
                <View style={[styles.infoContainer, { top: '68.2%', left: '17%' }]}>
                    <Text style={[
                        styles.modifier,
                        { color: initialData.selectedSkills.includes('Sobrevivência') ? 'black' : 'gray' }
                    ]}>
                        {initialData.modWisdom}
                    </Text>
                </View>
                {/* informações da Bolsa */}
                <View style={[styles.infoContainer, { top: '16%', left: '37%' }]}>
                    <Text style={styles.status}>{initialBag.armor}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '88.5%', left: '37.5%' }]}>
                    <Text style={styles.modifier}>{initialBag.platina}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '85%', left: '37.5%' }]}>
                    <Text style={styles.modifier}>{initialBag.gold}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '82%', left: '38.5%' }]}>
                    <Text style={styles.modifier}>{initialBag.electrum}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '78.5%', left: '37.5%' }]}>
                    <Text style={styles.modifier}>{initialBag.silver}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '75%', left: '37.5%' }]}>
                    <Text style={styles.modifier}>{initialBag.copper}</Text>
                </View>
                <View style={[styles.infoContainer, { top: '75%', left: '45%' }]}>
                    <Text style={styles.itemsBag}>{initialBag.items}</Text>
                </View>
                {/* iniciativa */}
                <View style={[styles.infoContainer, { top: '16%', left: '47.5%' }]}>
                    <Text style={styles.status}>{initialData.modDexterity}</Text>
                </View>
                {/* Deslocamento */}
                <View style={[styles.infoContainer, { top: '16%', left: '57.5%' }]}>
                    <Text style={styles.status}>{initialData.movement}</Text>
                </View>
            </>
        ),
        (<>
            <View style={[styles.infoContainer, { top: '25%', right: '10%' }]}>
                <Text style={styles.infoText}>Outra Info P2</Text>
            </View>
        </>),
        (<>
            <View style={[styles.infoContainer, { bottom: '15%', left: '30%' }]}>
                <Text style={styles.infoText}>Mais Info P3</Text>
            </View>
        </>),
    ];

    return (
        <Modal visible={true} transparent={true} onRequestClose={onClose}>
            <ImageViewer
                imageUrls={imageUrls}
                onCancel={onClose}
                enableSwipeDown={true}
                backgroundColor={'#000'}
                index={currentIndex}
                onChange={(index) => {
                    if (index !== undefined) {
                        setCurrentIndex(index);
                    }
                }}
                renderImage={(props) => (
                    <ImageBackground {...props}>
                        {overlays[currentIndex]}
                    </ImageBackground>
                )}
            />
            <View style={styles.containerDoBotao}>
                <Button title="Fechar" onPress={onClose} color="#b30202" />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    containerDoBotao: {
        position: 'absolute',
        bottom: 40,
        width: '80%',
        alignSelf: 'center',
        zIndex: 20,
    },
    infoContainer: {
        position: 'absolute',
        padding: 5,
        borderRadius: 5,
    },
    infoText: {
        fontSize: 8,
        color: '#000',
    },
    status: {
        fontSize: 16,
        color: '#000',
    },
    selectedSkillss: {
        fontSize: 28,
        color: '#000',
    },
    modifier: {
        fontSize: 8,
        color: '#000',
    },
    itemsBag: {
        fontSize: 6,
        color: '#000',
        width:"100%",
        maxWidth:70,
        height:"auto",
        maxHeight:100,
    },
    modifierStatus: {
        fontSize: 13,
        color: '#000',
    },
});

export default ViewSheet;