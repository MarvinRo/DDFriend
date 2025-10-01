import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView // Adicionado para permitir rolagem se a lista for grande
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'
import NaviBar from '../../components/NaviBar';
import { GlobalStyles } from '../../styles/GlobalStyles';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

// --- Componente do Visualizador (sem alterações) ---
const VisualizadorPdfGoogle = ({ idDoArquivo }: { idDoArquivo: string | null }) => {
    if (!idDoArquivo) {
        return <ActivityIndicator />;
    }
    const urlFinal = `https://drive.google.com/file/d/${idDoArquivo}/preview`;
    return (
        <WebView
            source={{ uri: urlFinal }}
            startInLoadingState={true}
            renderLoading={() => <ActivityIndicator color="#007bff" size="large" />}
            originWhitelist={['*']}
            style={{ flex: 1 }}
        />
    );
};
const listaDeDocumentos = [
    {
        id: '19k8MgxwF5ltTIRpZMhmM8x8ZEFd5Fq33',
        titulo: 'Livro do Jogador',
    },
    {
        id: '1yC0vJ7NcZ3BH-l4yXbNeuSmYOvCW7FLH',
        titulo: 'Guia de xanathar',
    },
    {
        id: '19nFBQfAigZM98Ul5D_8ApOY2f6P1ZdFX',
        titulo: 'Regras básicas',
    },
];

const Books = ({ navigation }: any) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null);

    const abrirModalComPdf = (pdfId: string) => {
        setSelectedPdfId(pdfId);
        setModalVisible(true);
    };

    const fecharModal = () => {
        setModalVisible(false);
        setSelectedPdfId(null);
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <NaviBar
                onMenuPress={() => navigation.openDrawer()}
                onLogoutPress={async () => await auth().signOut()}
            />
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Documentos Disponíveis</Text>
                {listaDeDocumentos.map((doc) => (
                    <TouchableOpacity
                        key={doc.id}
                        style={styles.linkButton}
                        onPress={() => abrirModalComPdf(doc.id)}
                    >
                        <Text style={styles.linkText}>{doc.titulo}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Modal
                isVisible={isModalVisible}
                style={styles.modal}
                onBackdropPress={fecharModal}
            >
                <View style={styles.modalContent}>
                    <VisualizadorPdfGoogle idDoArquivo={selectedPdfId} />
                    <TouchableOpacity style={styles.closeButton} onPress={fecharModal}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    linkButton: {
        backgroundColor: '#495057',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    linkText: {
        color: '#fff',
        fontSize: 16,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        height: '90%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    closeButton: {
        backgroundColor: '#007bff',
        padding: 15,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Books;