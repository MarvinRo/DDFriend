/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { CharacterCardStyle } from '../styles/CharacterCardStyle';

interface CharacterCardProps {
    name: string;
    race: string;
    characterClass: string;
    level: number;
    characterPhoto?: string;
    onPress: () => void;
    onDelete: () => void;
    onEdit: () => void;
    onPressLevel: () => void;
    onPressBagItens: () => void;
    onPressSpells: () => void;
}

const deleteIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
const editIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`
const bagItensXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-backpack-icon lucide-backpack"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>`
const spellBookXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked-icon lucide-book-marked"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>`
const profileXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`

const CharacterCard = ({
    name,
    race,
    characterClass,
    level,
    characterPhoto,
    onPress,
    onDelete,
    onEdit,
    onPressLevel,
    onPressBagItens,
    onPressSpells,
}: CharacterCardProps) => {
    // Estado local para controlar a foto em tela cheia
    const [isModalVisible, setModalVisible] = useState(false);

    return (
        <View style={CharacterCardStyle.card}>
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.characterTitle}>{name}</Text>
                        <Image
                            source={{ uri: characterPhoto }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.closeInstruction}>Toque para fechar</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity
                onPress={() => characterPhoto && setModalVisible(true)}
                style={[CharacterCardStyle.iconCard, { overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}
            >
                {characterPhoto ? (
                    <Image
                        source={{ uri: characterPhoto }}
                        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                    />
                ) : (
                    <SvgXml xml={profileXml} width="24" height="24" stroke="#f5f5f5" />
                )}
            </TouchableOpacity>

            <View style={CharacterCardStyle.cardBody}>
                {/* O conteúdo do card permanece igual */}
                <TouchableOpacity style={CharacterCardStyle.infoColumn} onPress={onPress}>
                    <Text style={CharacterCardStyle.cardTextName}>{name}</Text>
                    {(race || characterClass) && (
                        <Text style={CharacterCardStyle.cardTextSecondary}>
                            {race} / {characterClass}
                        </Text>
                    )}
                </TouchableOpacity>

                <View style={CharacterCardStyle.actionsColumn}>
                    <TouchableOpacity onPress={onPressLevel}>
                        <Text style={CharacterCardStyle.cardTextLevel}>Lv.{level}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressBagItens} style={CharacterCardStyle.iconButton}>
                        <SvgXml xml={bagItensXml} width="24" height="24" stroke="#f5f5f5" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressSpells} style={CharacterCardStyle.iconButton}>
                        <SvgXml xml={spellBookXml} width="24" height="24" stroke="#f5f5f5" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={CharacterCardStyle.cardFooter}>
                <TouchableOpacity style={CharacterCardStyle.footerButton} onPress={onEdit} >
                    <SvgXml xml={editIconXml} width="16" height="16" stroke="#f5f5f5" />
                    <Text style={CharacterCardStyle.footerButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={CharacterCardStyle.footerButton} onPress={onDelete}>
                    <SvgXml xml={deleteIconXml} width="16" height="16" stroke="#f5f5f5" />
                    <Text style={CharacterCardStyle.footerButtonText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Estilos específicos para o Modal de expansão
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    characterTitle: {
        color: '#f5f5f5',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    fullImage: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.6,
        borderRadius: 8,
    },
    closeInstruction: {
        color: '#888',
        marginTop: 20,
        fontSize: 12,
    },
});

export default CharacterCard;