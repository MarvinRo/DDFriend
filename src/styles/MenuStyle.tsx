import { StyleSheet } from 'react-native';

export const MenuStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1f1e1e',
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
    exitButtom:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center"
    },
    footer: {
        alignItems:"flex-end",
        justifyContent:"center",
        marginRight:20,
        marginBottom:10
    },
    Icon: {
        minHeight:30,
        minWidth:30,
    },
    IconExit: {
        minHeight:30,
        minWidth:30,
        color:"#f5f5f5"
    },
    avatarArea: {
        display:"flex",
        flexDirection:"row",
        alignItems:"center"
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 40,
        marginTop:10,
        marginBottom: 10,
        marginRight:20,
        alignItems:"center"
    },
    drawerItemsContainer: {
        flex: 1,
        paddingTop: 10,
    },
});
