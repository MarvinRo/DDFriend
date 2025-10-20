import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  User
} from '@react-native-google-signin/google-signin';
import { SvgUri } from 'react-native-svg';
import "../styles/LoginStyles"
import { styles } from '../styles/LoginStyles';
import { NativeModules } from 'react-native';
const { GOOGLE_WEB_CLIENT_ID } = NativeModules.EnvModule;

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
      const userInfo = await GoogleSignin.signIn();

      onLoginSuccess(userInfo.data);

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
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.googleButton} onPress={signIn}>
        <GoogleIcon />
        <Text style={styles.googleButtonText}>Entrar com Google</Text>
      </TouchableOpacity>
    </View>

  );
};

export default GoogleButton;