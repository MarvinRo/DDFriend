
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { View, ActivityIndicator } from 'react-native';

import LoginPage from '@/screens/auth/LoginPage';
import ChoiceMember from '@/screens/app/ChoiceMember';
import HomePlayer from '@/screens/app/HomePlayer';
import CharacterSheet from '@/screens/app/CharacterSheet';
import CharacterBag from '@/screens/app/CharacterBag';
import CharacterMagic from '@/screens/app/CharacterMagic';
import Books from '@/screens/app/Books';



const Stack = createNativeStackNavigator();

const Routes = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
      if (isLoading) setIsLoading(false);
    });
    return subscriber;
  }, []);

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" /></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Group>
            <Stack.Screen name="Home" component={ChoiceMember} />
            <Stack.Screen name="HomePlayer" component={HomePlayer} />
            <Stack.Screen name="CharacterSheet" component={CharacterSheet} />
            <Stack.Screen name="CharacterBag" component={CharacterBag} />
            <Stack.Screen name="CharacterMagic" component={CharacterMagic} />
            <Stack.Screen name="Books" component={Books} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Login" component={LoginPage} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;