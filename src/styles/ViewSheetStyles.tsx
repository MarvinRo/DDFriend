import { StyleSheet } from "react-native";

export const ViewSheetStyles = StyleSheet.create({
    containerDoBotao: {
        position: 'absolute',
        bottom: 40,
        width: '80%',
        alignSelf: 'center',
        zIndex: 20,
    },
    infoContainer: {
        position: 'absolute',
        padding: 5,
        borderRadius: 5,
    },
    infoText: {
        fontSize: 10,
        color: '#000',
    },
    status: {
        fontSize: 16,
        color: '#000',
    },
    selectedSkillss: {
        fontSize: 28,
        color: '#000',
    },
    modifier: {
        fontSize: 8,
        color: '#000',
    },
    itemsBag: {
        flex:1,
        marginLeft: 4,
        fontSize: 10,
        color: '#000',
        width:"100%",
        maxWidth:"100%",
        height:"auto",
        maxHeight:100,
        backgroundColor:"red"
    },
    modifierStatus: {
        fontSize: 13,
        color: '#000',
    },
})