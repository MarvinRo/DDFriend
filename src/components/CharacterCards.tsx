/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { CharacterCardStyle } from '../styles/CharacterCardStyle';

const deleteIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
const editIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`
const bagItensXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-backpack-icon lucide-backpack"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>` 
const spellBookXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked-icon lucide-book-marked"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>`
type CharacterCardProps = {
    name: string;
    race: string;
    level: number;
    characterClass: string;
    onPress: () => void;
    onDelete: () => void;
    onEdit: () => void;
    onPressLevel: () => void;
    onPressBagItens: () => void;
    onPressSpells:() => void;
};



const CharacterCard = ({ name, race, characterClass, level, onPress, onDelete, onEdit, onPressLevel, onPressBagItens, onPressSpells }: CharacterCardProps) => (
    <View style={CharacterCardStyle.card}>
        {/* Container principal do conteúdo */}
        <View style={CharacterCardStyle.cardBody}>

            {/* Coluna de Informações (flexível) */}
            <TouchableOpacity style={CharacterCardStyle.infoColumn} onPress={onPress}>
                <Text style={CharacterCardStyle.cardTextName}>{name}</Text>
                {(race || characterClass) && (
                    <Text style={CharacterCardStyle.cardTextSecondary}>
                        {race} / {characterClass}
                    </Text>
                )}
            </TouchableOpacity>

            {/* Coluna de Ações (fixa) */}
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

        {/* Rodapé com botões de Editar/Excluir */}
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

export default CharacterCard;