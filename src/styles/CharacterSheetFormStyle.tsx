import { StyleSheet } from 'react-native';

export const CharacterSheetFormStyle = StyleSheet.create({
    keyboardAvoidingContainer: {
        width: '100%',
        margin: 0
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,

    },
    checkboxLabel: {
        color: '#fff',
        marginLeft: 8,
        flex: 1
    },
    formContainer: {
        width: "100%",
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    placeholderItem: {
        color: '#999',
    },
    sectionContainer: {
        marginBottom: 20,
    },

    listContainer: {
        width: '100%',
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
    },
    emptyListContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    pickerContainer: {
        height: 50,
        width: '48%',
        backgroundColor: '#333',
        borderRadius: 5,
        marginBottom: 20,
        justifyContent: 'center',
    },
    picker: {
        color: '#fff',
    },
    newSheetButton: {
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    newSheetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    inputDouble: {
        backgroundColor: '#333',
        color: '#fff',
        width: "48%",
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    inputQuad: {
        backgroundColor: '#333',
        color: '#fff',
        width: "16%",
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    }
})