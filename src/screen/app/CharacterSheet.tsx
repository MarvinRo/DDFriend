/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    FlatList
} from 'react-native';
import NaviBar from '../../components/NaviBar';
import { GlobalStyles } from '../../styles/GlobalStyles';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import CharacterCard from '../../components/CharacterCards';
import CharacterSheetForm from '../../components/CharacterSheetForm'
import LevelEditForm from '../../components/LevelEditForm';
import ItemsBagPack from '../../components/ItemsBagPack';
import SpellsAndAbilitiesForm from '../../components/SpellsAndAbilitiesForm';
import ViewSheet from '../../components/ViewSheet';


const CharacterSheetScreen = ({ navigation }: any) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [sheets, setSheets] = useState([]);
    const [ownerName, setOwnerName] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingSheet, setEditingSheet] = useState(null);
    const [isLevelFormVisible, setIsLevelFormVisible] = useState(false);
    const [sheetForLevelEdit, setSheetForLevelEdit] = useState(null);
    const [isItemsBackPackFormVisible, setIsItemsBackPackvFormVisible] = useState(false);
    const [isSpellsFormVisible, setIsSpellsFormVisible] = useState(false);
    const [viewSheet, setViewSheet] = useState(false);
    const [viewSheetVisible, setViewSheetVisible] = useState(null)
    const [sheetForBag, setSheetForBag] = useState(null);
    const [bagDataForView, setBagDataForView] = useState(null);

    const [sheetForSpellsEdit, setSheetForSpellsEdit] = useState<CharacterSheetForm | null>(null);


    const handleOpenEditForm = (sheet: React.SetStateAction<null>) => {
        setEditingSheet(sheet);
        setIsFormVisible(true);
    };

    const handleOpenLevelForm = (sheet: React.SetStateAction<null>) => {
        setSheetForLevelEdit(sheet);
        setIsLevelFormVisible(true);
    };

    const handleOpenItemsBackPackForm = (sheet: React.SetStateAction<null>) => {
        setSheetForBag(sheet);
        setIsItemsBackPackvFormVisible(true);
    };

    const handleOpenSpellsForm = (sheet: React.SetStateAction<null>) => {
        setSheetForSpellsEdit(sheet);
        setIsSpellsFormVisible(true);
    };
    /* const handleOpensetViewSheet = (sheet: React.SetStateAction<null>) => {
        setViewSheet(true);
        setViewSheetVisible(sheet);
    }; */
    const handleOpensetViewSheet = async (sheet: any) => {
        try {
            // Mostra um loading enquanto busca os dados da mochila
            setIsLoading(true);

            // Busca os dados da subcoleção 'bagpack'
            const bagpackQuery = await firestore()
                .collection('characterSheets')
                .doc(sheet.id)
                .collection('bagpack')
                .limit(1)
                .get();

            if (!bagpackQuery.empty) {
                const bagData = bagpackQuery.docs[0].data();
                setBagDataForView(bagData); // Armazena os dados da mochila no novo estado
            } else {
                // Se não encontrar, define como um objeto vazio para não dar erro
                setBagDataForView({});
            }

            // Agora que temos os dados, podemos abrir a ficha
            setViewSheetVisible(sheet);
            setViewSheet(true);

        } catch (error) {
            console.error("Erro ao buscar dados da mochila para visualização:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados da mochila.");
        } finally {
            // Para de mostrar o loading, independentemente do resultado
            setIsLoading(false);
        }
    };

    const handleCloseForms = () => {
        setIsFormVisible(false);
        setIsLevelFormVisible(false);
        setIsItemsBackPackvFormVisible(false);
        setEditingSheet(null);
        setSheetForLevelEdit(null);
        setSheetForBag(null);
        setIsSpellsFormVisible(false);
        setSheetForSpellsEdit(null);
        setViewSheet(false);
        setViewSheetVisible(null);
    };
    useEffect(() => {
        const user = auth().currentUser;
        if (!user) {
            setIsLoading(false);
            return;
        }

        setOwnerName(user)
        const subscriber = firestore()
            .collection('characterSheets')
            .where('ownerId', '==', user.uid)
            .orderBy('createdAt', 'asc')
            .onSnapshot(querySnapshot => {
                const userSheets: ((prevState: never[]) => never[]) | { id: string; }[] = [];
                querySnapshot.forEach(documentSnapshot => {
                    userSheets.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setSheets(userSheets);
                setIsLoading(false);
            }, error => {
                console.error("Erro ao buscar fichas: ", error);
                setIsLoading(false);
            });

        return () => subscriber();
    }, []);
    const handleDeleteSheet = (sheetId: string) => {
        Alert.alert(
            "Confirmar Exclusão",
            "Você tem certeza que quer apagar esta ficha e todos os seus dados (mochila, magias, etc.)? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar Tudo",
                    style: "destructive",
                    onPress: async () => {

                        try {
                            const sheetRef = firestore().collection('characterSheets').doc(sheetId);
                            const deleteSubcollection = async (subcollectionName: string) => {
                                const subcollectionRef = sheetRef.collection(subcollectionName);
                                const snapshot = await subcollectionRef.get();

                                if (snapshot.empty) {
                                    return;
                                }
                                const batch = firestore().batch();
                                snapshot.docs.forEach(doc => {
                                    batch.delete(doc.ref);
                                });
                                await batch.commit();
                            };
                            await Promise.all([
                                deleteSubcollection('bagpack'),
                                deleteSubcollection('spellsAndAbilities')
                            ]);
                            await sheetRef.delete();

                            Alert.alert("Sucesso!", "Ficha e todos os dados relacionados foram apagados.");

                        } catch (error) {
                            console.error("Erro na exclusão completa da ficha:", error);
                            Alert.alert("Erro", "Não foi possível apagar todos os dados da ficha.");
                        }
                    }
                }
            ]
        );
    };
    const handleSaveCharacter = async (sheetData: any) => {
        const user = auth().currentUser;
        if (!user) return;

        setIsSaving(true);
        try {
            if (editingSheet) {
                const sheetRef = await firestore().collection('characterSheets').doc(editingSheet.id);
                await sheetRef.update(sheetData);
                Alert.alert('Sucesso!', 'Ficha atualizada.');
            }
            else {
                const newSheetRef = await firestore().collection('characterSheets').add({
                    ...sheetData,
                    level: 1,
                    experience: 0,
                    ownerId: user.uid,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
                await newSheetRef.collection('bagpack').add({
                    platina: 0,
                    gold: 0,
                    silver: 0,
                    electrum: 0,
                    copper: 0,
                    armor: 0,
                    items: ''
                })
                await newSheetRef.collection('spellsAndAbilities').add({
                    talents: '',
                    abilities: '',
                    spells: '',
                });
                Alert.alert('Sucesso!', 'Sua nova ficha foi salva.');
            }
            setIsFormVisible(false);
            setEditingSheet(null);
            handleCloseForms();
        } catch (error) {
            console.error(error);

        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateLevel = async (level: { level: number, experience: number }) => {

        if (!sheetForLevelEdit) return;
        setIsSaving(true);
        try {
            const sheetRef = firestore().collection('characterSheets').doc(sheetForLevelEdit.id);
            await sheetRef.update(level);
            Alert.alert('Sucesso!', 'Nível e XP atualizados.');
            handleCloseForms();
        } catch (error) {
            console.error("Erro ao atualizar o nível:", error);
            Alert.alert("Erro", "Não foi possível atualizar o nível.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateItemsBackPack = async (bagpackData: any, bagpackDocId: string) => {
        if (!sheetForBag || !bagpackDocId) return;

        setIsSaving(true);
        try {
            const itemsBackPackRef = firestore()
                .collection('characterSheets')
                .doc(sheetForBag.id)
                .collection('bagpack')
                .doc(bagpackDocId);

            await itemsBackPackRef.update(bagpackData);
            Alert.alert('Sucesso!', 'Mochila atualizada.');
            handleCloseForms();
        } catch (error) {
            console.error("Erro ao atualizar a mochila:", error);
            Alert.alert("Erro", "Não foi possível atualizar a mochila.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateSpells = async (spellsData: any, docId: string) => {
        if (!sheetForSpellsEdit || !docId) return;
        setIsSaving(true);
        try {
            const docRef = firestore()
                .collection('characterSheets')
                .doc(sheetForSpellsEdit.id)
                .collection('spellsAndAbilities')
                .doc(docId);

            await docRef.update(spellsData);
            Alert.alert('Sucesso!', 'Magias e Habilidades atualizadas.');
            handleCloseForms();
        } catch (error) {
            console.error("Erro ao atualizar magias:", error);
            Alert.alert("Erro", "Não foi possível atualizar as magias.");
        } finally {
            setIsSaving(false);
        }
    };



    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#fff" />;
        }

        if (isLevelFormVisible) {
            return (
                <LevelEditForm
                    onClose={handleCloseForms}
                    onSave={handleUpdateLevel}
                    isSaving={isSaving}
                    initialData={sheetForLevelEdit}
                />
            );
        } else if (isItemsBackPackFormVisible) { // CONDIÇÃO CORRIGIDA
            return (
                <ItemsBagPack
                    onSave={handleUpdateItemsBackPack}
                    isSaving={isSaving}
                    initialData={sheetForBag}
                    onClose={handleCloseForms}
                />
            );
        } else if (isFormVisible) {
            return (
                <CharacterSheetForm
                    onSave={handleSaveCharacter}
                    isSaving={isSaving}
                    initialData={editingSheet}
                    onClose={handleCloseForms}
                />
            );
        } else if (isSpellsFormVisible) {
            return (
                <SpellsAndAbilitiesForm
                    onSave={handleUpdateSpells}
                    isSaving={isSaving}
                    initialData={sheetForSpellsEdit}
                    onClose={handleCloseForms}
                />
            );
        }
        /* else if (viewSheet) {
            return (
                <ViewSheet
                    initialData={viewSheetVisible}
                    userInfo={ownerName}
                    initialBag={itemsBackPack}
                    onClose={handleCloseForms}
                />
            );
        } */
        else if (viewSheet) {
            return (
                <ViewSheet
                    initialData={viewSheetVisible}
                    userInfo={ownerName}
                    initialBag={bagDataForView} // <<-- CORRIGIDO
                    onClose={handleCloseForms}
                />
            );
        }

        return (
            <View style={styles.listContainer}>
                <View >
                    <FlatList
                        data={sheets}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        style={{ width: "100%" }}
                        renderItem={({ item }: any) => (
                            <CharacterCard
                                name={item.characterName}
                                level={item.level}
                                race={item.characterRace}
                                characterClass={item.characterClass}
                                onPress={() => handleOpensetViewSheet(item)}
                                onEdit={() => handleOpenEditForm(item)}
                                onDelete={() => handleDeleteSheet(item.id)}
                                onPressLevel={() => handleOpenLevelForm(item)}
                                onPressBagItens={() => handleOpenItemsBackPackForm(item)}
                                onPressSpells={() => handleOpenSpellsForm(item)}
                            />
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyListContainer}>
                                <Text style={GlobalStyles.text}>Nenhuma ficha encontrada.</Text>
                            </View>
                        } contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 10 }} // Adiciona padding nas laterais da lista
                        columnWrapperStyle={{ justifyContent: 'space-around' }}
                    />
                    <TouchableOpacity onPress={() => setIsFormVisible(true)} style={styles.newSheetButton}>
                        <Text style={styles.newSheetButtonText}>+ Nova Ficha</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    return (
        <View style={GlobalStyles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <NaviBar
                    onMenuPress={() => navigation.openDrawer()}
                    onLogoutPress={async () => await auth().signOut()}
                />
                <View style={{ flex: 1 }}>
                    {renderContent()}
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo preto semitransparente
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
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

    formContainer: {
        width: "auto",
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 20,
        alignSelf: 'center',
        marginTop: 20,
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
        width: 120,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default CharacterSheetScreen;