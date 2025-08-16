/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Importe suas telas
import HomeScreen from '../screen/app/HomeScreen';
/* import ProfileScreen from '../screen/app/ProfileScreen'; // Crie esta tela
import Icon from 'react-native-vector-icons/Feather'; */

// 1. IMPORTE SEU NOVO COMPONENTE DE ESTILO
import CustomDrawer from './CustomDrawer';
import { SvgXml } from 'react-native-svg';
import { MenuStyle } from '../styles/MenuStyle';
import CharacterSheet from '../screen/app/CharacterSheet';


const CharacterSheetIconXml =`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-user-icon lucide-file-user"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 18a3 3 0 1 0-6 0"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><circle cx="12" cy="13" r="2"/></svg>`
const HomeIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-castle-icon lucide-castle"><path d="M10 5V3"/><path d="M14 5V3"/><path d="M15 21v-3a3 3 0 0 0-6 0v3"/><path d="M18 3v8"/><path d="M18 5H6"/><path d="M22 11H2"/><path d="M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9"/><path d="M6 3v8"/></svg>`;

const Drawer = createDrawerNavigator();

const MenuBar = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#f5f5f5',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#f5f5f5',
        drawerLabelStyle: {
          marginLeft: 0,
          fontSize: 15,
        }
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Início',
          drawerIcon: ({ color, size }) => (
            <SvgXml style={MenuStyle.Icon} xml={HomeIconXml} color={color} width={size} height={size} />
          )
         
        }} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={CharacterSheet} 
        options={{ 
          title: 'Ficha de personagem',
          drawerIcon: ({ color, size }) => (
            <SvgXml style={MenuStyle.Icon} xml={CharacterSheetIconXml} color={color} width={size} height={size}/>
          )
        }} 
      />
    </Drawer.Navigator>
  );
};

export default MenuBar;