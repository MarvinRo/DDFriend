import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import GoogleButton from '@/components/googleButtom';
type GoogleUser = {
  idToken: string | null;
};
const LoginPage = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLoginSuccess = async (googleUser: GoogleUser) => {
    if (!googleUser) return;

    setIsAuthenticating(true);

    try {
      const { idToken } = googleUser;
      if (!idToken) {
        throw new Error('Token do Google não encontrado');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const firebaseUserCredential = await auth().signInWithCredential(googleCredential);
      const { user } = firebaseUserCredential;

      if (user) {
        const userDocument = firestore().collection('users').doc(user.uid);
        await userDocument.set({
          nome: user.displayName,
          email: user.email,
          fotoURL: user.photoURL,
          uid: user.uid,
          ultimoLogin: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    } catch (error) {
      console.error("Erro na sincronização com o Firebase:", error);
      Alert.alert("Erro de Sincronização", "Não foi possível conectar ao servidor.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <SafeAreaView className='bg-background flex-1 justify-between'>
      <View className='flex-1 justify-center items-center px-20,'>
        {/* Anel dourado com glow ao redor do logo */}
        <View
          className="
            w-[220] 
            h-[220] 
            rounded-[110] 
            bg-transparent 
            border-4 
            border-gold 
            justify-center
            items-center 
            mb-6"
        style={{ 
            shadowColor: "#C49A4A",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 25,
            elevation: 15 }}>
          <View className="
            w-[200]
            h-[200]
            rounded-[100]
            bg-card
            justify-center
            items-center
            overflow-hidden
          ">
            <Image source={require('@/assets/images/Logo.png')} 
            className="w-[265] h-[265] resize-contain rounded-[90]"
            />
          </View>
        </View>
        <Text className='text-[34px] font-bold text-gold mb-4 tracking-1'>D&D Friends</Text>
        <Text className='text-[16px] text-textColor-secondary text-center tracking-[0.05em]'>Sua ficha, seus itens, sua aventura.</Text>
        {/* Divisor ornamental com losango */}
        <View className=' flex-row items-center mt-6 mb-2 px-2'>
          <View className='flex-1 h-0.5 bg-gold-dark'/>
          <View className='w-2 h-2 bg-gold mx-3 origin-center rotate-45'/>
          <View className='flex-1 h-0.5 bg-gold-dark'/>
        </View>
      </View>
      <View className ='px-6 pb-[50px]'>
        {isAuthenticating ? (
          <ActivityIndicator className='color-gold' size="large" />
        ) : (
          <GoogleButton onLoginSuccess={handleLoginSuccess} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
