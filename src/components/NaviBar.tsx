import React from 'react';
import { View, TouchableOpacity, Image} from 'react-native';
import { SvgXml } from 'react-native-svg';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from '../styles/GlobalStyles';
import { NaviBarStyles } from '../styles/NaviBarStyles';

// Ícones como constantes
const menuIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu-icon lucide-menu"><path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/></svg>`;



const NaviBar = () => {
  const navigation = useNavigation();
  const user = auth().currentUser;

  const handleMenuPress = () => {
    (navigation as any).openDrawer();
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={NaviBarStyles.navibar}>
        <TouchableOpacity onPress={handleMenuPress}>
          <SvgXml style={NaviBarStyles.Icon} xml={menuIconXml} />
        </TouchableOpacity>

        {user?.photoURL ? (
        <Image source={{ uri: user.photoURL }} />
      ) : (
        <View />
      )}
      </View>
    </View>
  );
};
export default NaviBar;