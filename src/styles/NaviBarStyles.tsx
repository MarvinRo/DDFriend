import { StyleSheet } from 'react-native';

export const NaviBarStyles = StyleSheet.create({
    container: {
        backgroundColor: '#121212', 
        justifyContent: 'space-between',
    },
    navibar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 15,
        backgroundColor: '#1f1e1e',
        borderBottomWidth: 1,
        borderBottomColor: '#1f1e1e',
    },
    buttonExitNaviBar: {
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
    },
    Icon: {
        minHeight:30,
        minWidth:30,
        color:"#f5f5f5"
    }
});
