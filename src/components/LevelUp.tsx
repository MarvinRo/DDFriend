import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, Text, View, ScrollView } from 'react-native';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LevelEditProps {
    visible: boolean;
    onClose: () => void,
    onSave: (sheetData: any) => void,
    isSaving?: boolean,
    initialData: {
        level: number
        experience: number
    }
}

export default function LevelEdit({ onClose, onSave, initialData, visible }: LevelEditProps) {
    const [level, setLevel] = useState("0")
    const [experience, setExperience] = useState("0")
    const [efficiencyBonus, setEfficiencyBonus] = useState('')

    const handleClose = () => {
        setLevel("0");
        setExperience("0");
        onClose();
    };

    const initLevel = initialData?.level;
    const initExp = initialData?.experience;

    useEffect(() => {
        if (visible) {
            setLevel(initLevel !== undefined ? String(initLevel) : "0");
            setExperience(initExp !== undefined ? String(initExp) : "0");
        }
    }, [visible, initLevel, initExp]);



    const getEfficiencyBonus = (currentLevel: number) => {
        if (currentLevel >= 1 && currentLevel <= 4) return 2;
        if (currentLevel > 4 && currentLevel <= 8) return 3;
        if (currentLevel > 8 && currentLevel <= 12) return 4;
        if (currentLevel > 12 && currentLevel <= 16) return 5;
        if (currentLevel > 16 && currentLevel <= 20) return 6;
        return 0;
    };


    const handleSaveData = () => {
        const currentLevel = Number(level) || 1;
        const sheetData = {
            level: currentLevel,
            experience: Number(experience) || 0,
            efficiencyBonus: getEfficiencyBonus(currentLevel),
        };
        onSave(sheetData);
        handleClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                handleClose();
            }}>
            <SafeAreaView className="flex-1 justify-center items-center">
                <View className='m-5 bg-card rounded-[10px] p-[35px] items-center justify-center h-[300px] border-gold border-[1px] w-11/12'>
                    <ScrollView className='w-full flex-1 mb-4 ' showsVerticalScrollIndicator={false}>
                        <View className='flex-1 items-center justify-start w-full gap-3 pb-2'>
                            <Text className='text-textColor-primary text-[24px] font-bold mb-2'>Experiência</Text>
                            <Input className='border-l-gold border-t-gray-500 border-r-gray-500 border-b-gray-500 border-[2px] rounded-lg w-full' placeholder='Nível' value={level} onChangeText={(text) => setLevel(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" />
                            <Input className='border-l-gold border-t-gray-500 border-r-gray-500 border-b-gray-500 border-[2px] rounded-lg w-full' placeholder='Pontos de XP' value={experience} onChangeText={(text) => setExperience(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" />
                        </View>

                    </ScrollView>
                    <View className='flex-row gap-4 items-center justify-center w-full'>
                        <Pressable
                            className='bg-gold-light rounded-[40px] px-4 py-2 w-[120px] items-center justify-center'
                            onPress={handleSaveData}
                        >
                            <Text className='text-gold-dark'>Salvar</Text>
                        </Pressable>
                        <Pressable
                            className='bg-gold-dark rounded-[40px] px-4 py-2 w-[120px] items-center justify-center'
                            onPress={handleClose}>
                            <Text className='text-textColor-primary'>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}