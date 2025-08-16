import React from 'react';

import Routes from './src/navigation/routes'; 

const App = () => {
  
  return <Routes />;
};

export default App;

/* import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Verifique se estes caminhos estão corretos a partir da nova localização
import LoginScreen from './src/screen/auth/LoginScreen';
import HomeScreen from './src/screen/app/HomeScreen';

const Stack = createNativeStackNavigator();

// Criamos um componente que será o nosso sistema de rotas
const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged retorna uma função para 'desinscrever' o ouvinte
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
      if (isLoading) {
        setIsLoading(false);
      }
    });
    return subscriber;
  }, []);

  // Enquanto verifica o usuário, podemos mostrar uma tela de loading
  if (isLoading) {
    // Você pode criar um componente de SplashScreen aqui
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Telas para usuários logados
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // Telas para usuários deslogados
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App; */