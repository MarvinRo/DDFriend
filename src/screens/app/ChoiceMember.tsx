import { View, Text, TouchableOpacity, Image,Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ExitButton from "@/components/ExitButton";


export default function ChoiceMember() {
    const navigation = useNavigation<any>();
    
    return (
        <View className='flex-1 bg-background justify-center items-center'>
            <Text className='text-textColor-primary text-2xl font-bold mb-8'>Quem será vc nessa aventura?</Text>
            <View className="justify-center items-center">
                <TouchableOpacity className='w-[300px] h-[180px] bg-card justify-center items-center rounded-lg px-4 py-2 mb-4 border-[1px] border-gold' style={{
                    shadowColor: "#C49A4A",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.9,
                    shadowRadius: 25,
                    elevation: 15
                }} onPress={() => Alert.alert("Área em desenvolvimento", "Infelizmente essa área ainda não está disponível.")}>
                    <Image source={require('@/assets/images/DM.png')} className='w-[100px] h-[100px] rounded-lg' />
                    <Text className='text-foreground text-lg'>Mestre</Text>
                    <View className=' flex-row items-center mt-6 mb-2 px-2'>
                        <View className='flex-1 h-0.5 bg-gold-dark' />
                        <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                        <View className='flex-1 h-0.5 bg-gold-dark' />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className='w-[300px] h-[180px] bg-card justify-center items-center rounded-lg px-4 py-2 mb-4 border-[1px] border-gold' style={{
                    shadowColor: "#C49A4A",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.9,
                    shadowRadius: 25,
                    elevation: 15
                }} onPress={() => navigation.navigate('HomePlayer')}>
                    <Image source={require('@/assets/images/players.png')} className='w-[100px] h-[100px] rounded-lg' />
                    <Text className='text-foreground text-lg'>Jogador</Text>
                    <View className=' flex-row items-center mt-6 mb-2 px-2'>
                        <View className='flex-1 h-0.5 bg-gold-dark' />
                        <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45' />
                        <View className='flex-1 h-0.5 bg-gold-dark' />
                    </View>
                </TouchableOpacity>
            </View>
            <ExitButton />
        </View>
    );
}