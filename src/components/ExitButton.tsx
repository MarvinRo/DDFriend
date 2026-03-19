import { View, Text, TouchableOpacity, Image } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { Alert } from "react-native";


export default function ExitButton() {
    const handleLogout = async () => {
            try {
                await auth().signOut();
                await GoogleSignin.signOut();
            } catch (error) {
                console.error(error);
                Alert.alert("Erro", "Não foi possível fazer o logout.");
            }
        };
    return (
        <View className='absolute top-12 right-6'>
            <TouchableOpacity onPress={handleLogout}>
                <View className="flex-row justify-center items-center">
                    <Text className="text-textColor-primary">Sair</Text>
                    <Image source={require('@/assets/images/exit.png')} className='w-[50px] h-[50px] rounded-lg' />
                    
                </View>
            </TouchableOpacity>
        </View>
    );
}