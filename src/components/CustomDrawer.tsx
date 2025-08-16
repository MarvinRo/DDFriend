import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import { GlobalStyles } from '../styles/GlobalStyles';
import { SvgXml } from 'react-native-svg';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuStyle } from '../styles/MenuStyle';

// import Icon from 'react-native-vector-icons/Feather';
const logoutIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-door-open-icon lucide-door-open"><path d="M11 20H2"/><path d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z"/><path d="M11 4H8a2 2 0 0 0-2 2v14"/><path d="M14 12h.01"/><path d="M22 20h-3"/></svg>`;

const CustomDrawer = (props) => {
    const user = auth().currentUser;

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
        <SafeAreaView style={MenuStyle.container}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                <View style={MenuStyle.avatarArea}>
                    <Image
                        source={{ uri: user?.photoURL || 'https://i.pravatar.cc/150' }}
                        style={MenuStyle.avatar}
                    />
                    <View style={{}}>
                        <Text style={GlobalStyles.text}>{user?.displayName || 'Usuário'}</Text>
                        <Text style={GlobalStyles.text}>{user?.email}</Text>
                    </View>
                </View>
                <View style={MenuStyle.drawerItemsContainer}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={MenuStyle.footer}>
                <TouchableOpacity onPress={handleLogout}>
                    <View style={MenuStyle.exitButtom}>
                        <Text style={GlobalStyles.text}>Sair</Text>
                        <SvgXml style={MenuStyle.IconExit} xml={logoutIconXml} />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Aqui você pode colocar os estilos que desejar


export default CustomDrawer;