import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import GoogleButton from '../../components/googleButtom';
import { styles } from '../../styles/LoginStyles';
type GoogleUser = {
  idToken: string | null;
};
const LoginScreen = () => {
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/Logo.jpeg')} style={styles.logo} />
        <Text style={styles.title}>D&D Friends</Text>
        <Text style={styles.subtitle}>Sua ficha, seus itens, sua aventura.</Text>
      </View>
      <View style={styles.buttonContainer}>
        {isAuthenticating ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : (
          <GoogleButton onLoginSuccess={handleLoginSuccess} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
