import { StyleSheet } from "react-native";

export const SpellAndAbilitiesFormStyles = StyleSheet.create({
   keyboardAvoidingContainer: {
        width: "90%",
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 20,
        alignSelf: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    formContainer: { width: "90%", backgroundColor: '#2a2a2a', borderRadius: 10, padding: 20, alignSelf: 'center' },
    formTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5, textAlign: 'center' },
    characterName: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 20 },
    label: { fontSize: 14, color: '#aaa', marginBottom: 5, marginLeft: 5 },
    textArea: {
        backgroundColor: '#333', color: '#fff', borderRadius: 5, paddingHorizontal: 15,
        paddingVertical: 10, marginBottom: 15, fontSize: 16, height: 120, textAlignVertical: 'top',
    },
    formButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
})