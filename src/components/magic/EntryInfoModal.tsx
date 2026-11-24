import React from 'react';
import { Modal, View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type EntryInfoModalProps = {
    visible: boolean;
    name: string;
    description: string;
    subtitle?: string;
    readOnly?: boolean;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
};

export default function EntryInfoModal({ visible, name, description, subtitle, readOnly, onClose, onEdit, onDelete }: EntryInfoModalProps) {
    const confirmDelete = () => {
        Alert.alert('Remover', `Remover "${name}" do grimório?`, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Remover', style: 'destructive', onPress: onDelete },
        ]);
    };

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
            <SafeAreaView className="flex-1 bg-black/80 justify-center items-center">
                <View className="bg-card border border-gold rounded-[10px] p-5 w-11/12 max-h-[80%]">
                    <Text className="text-gold font-bold text-xl text-center">{name}</Text>
                    {subtitle ? <Text className="text-textColor-secondary text-xs text-center mt-1">{subtitle}</Text> : null}

                    <ScrollView className="mt-4 mb-4" showsVerticalScrollIndicator>
                        <Text className="text-textColor-primary text-[15px] leading-6">
                            {description?.trim() ? description : 'Nenhuma descrição cadastrada.'}
                        </Text>
                    </ScrollView>

                    <View className="flex-row gap-3 justify-center">
                        {!readOnly && onDelete ? (
                            <Pressable className="bg-destructive rounded-[40px] px-4 py-2 items-center" onPress={confirmDelete}>
                                <Text className="text-gray-100 font-bold">Remover</Text>
                            </Pressable>
                        ) : null}
                        {!readOnly && onEdit ? (
                            <Pressable className="bg-gold-light rounded-[40px] px-4 py-2 items-center" onPress={onEdit}>
                                <Text className="text-gold-dark font-bold">Editar</Text>
                            </Pressable>
                        ) : null}
                        <Pressable className="bg-gold-dark rounded-[40px] px-4 py-2 items-center" onPress={onClose}>
                            <Text className="text-textColor-primary font-bold">Fechar</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}
