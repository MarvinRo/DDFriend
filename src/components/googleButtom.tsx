import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  User
} from '@react-native-google-signin/google-signin';
import { SvgUri } from 'react-native-svg';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
});

const GoogleIcon = () => (
  <SvgUri
    width="24"
    height="24"
    uri="https://www.svgrepo.com/show/475656/google-color.svg"
    style={{ marginRight: 12 }}
  />
);
type GoogleButtonProps = {
  onLoginSuccess: (user: User) => void;
};
const GoogleButton = ({ onLoginSuccess }: GoogleButtonProps) => {

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      // Compatibilidade: v13+ retorna { data: {...} }, versões antigas retornam o objeto direto.
      const userInfo = response.data ? response.data : response;
      
      if (userInfo && userInfo.idToken) {
        onLoginSuccess(userInfo);
      }

    } catch (error:any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Login cancelado pelo usuário');
      } else {
        console.error(error.message);
        Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer o login.');
      }
    }
  };

  return (
    <View className='px-6 pb-12'>
      <TouchableOpacity className='flex-row items-center justify-center rounded-[30px] py-4 border-1 border-gold-light bg-buttonGoogle-background'onPress={signIn}>
        <GoogleIcon />
        <Text className=' text-[17px] font-[700px] items-center'>Entrar com Google</Text>
      </TouchableOpacity>
    </View>

  );
};

export default GoogleButton;