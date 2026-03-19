import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Modal,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';



const VisualizadorPdfGoogle = ({ idDoArquivo }: { idDoArquivo: string | null }) => {
    if (!idDoArquivo) {
        return <ActivityIndicator />;
    }
    const urlFinal = `https://drive.google.com/file/d/${idDoArquivo}/preview`;
    return (
        <WebView
            source={{ uri: urlFinal }}
            startInLoadingState={true}
            renderLoading={() => <ActivityIndicator color="#C49A4A" size="large" style={{ flex: 1, backgroundColor: '#0f172a' }} />}
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
    {
        id: '19mxe0fbWaZCDCrwRxJIckwP3jsAjdnJN',
        titulo: 'Costa da Espada',
    },
];

export default function Books() {
    const arrowLeftXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C49A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`
    const bookIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C49A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>`

    const navigation = useNavigation<any>();

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
        <SafeAreaView className='flex-1 bg-background p-4'>
            <TouchableOpacity
                className="absolute top-6 left-4 z-50 bg-card p-2 rounded-full border border-gold mt-8"
                onPress={() => navigation.goBack()}
            >
                <SvgXml xml={arrowLeftXml} width="24" height="24" />
            </TouchableOpacity>

            <View className="flex-1 items-center mt-20 w-full">
                <Text className='text-gold text-2xl font-bold mb-8'>Documentos Disponíveis</Text>
                <ScrollView className="flex-1 w-full px-2" contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                    {listaDeDocumentos.map((doc) => (
                        <TouchableOpacity
                            key={doc.id}
                            className="bg-card w-[48%] flex-col items-center p-4 rounded-lg border border-gold mb-4"
                            onPress={() => abrirModalComPdf(doc.id)}
                        >
                            <View className="bg-background w-full h-56 items-center justify-center rounded border border-gold-light mb-3 overflow-hidden">
                                <Image
                                    source={{ uri: `https://drive.google.com/thumbnail?id=${doc.id}&sz=w300` }}
                                    style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                                />
                            </View>
                            <Text className="text-textColor-primary text-[16px] font-bold text-center">{doc.titulo}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <Modal
                visible={isModalVisible}
                style={{ margin: 0, marginTop: 60 }}
                onRequestClose={fecharModal}
            >
                <View className="flex-1 bg-background overflow-hidden border-t border-gold border-x">
                    <View className="flex-row justify-between items-center p-4 border-b border-gold bg-card mt-6">
                        <Text className="text-gold font-bold text-lg">Visualizador</Text>
                        <TouchableOpacity onPress={fecharModal} className="bg-destructive px-4 py-2 rounded-lg">
                            <Text className="text-white font-bold">Fechar</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        <VisualizadorPdfGoogle idDoArquivo={selectedPdfId} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}