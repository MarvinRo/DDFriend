import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const SheetDetailScreen = ({ route, navigation }) => {
  // Estado para guardar os dados da ficha e o carregamento
  const [sheetData, setSheetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pega o ID da ficha passado como parâmetro na navegação
  const { sheetId } = route.params;

  // Busca os dados da ficha no Firestore quando a tela abre
  useEffect(() => {
    const subscriber = firestore()
      .collection('characterSheets')
      .doc(sheetId)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setSheetData(documentSnapshot.data());
        } else {
          Alert.alert("Erro", "Ficha não encontrada.");
        }
        setIsLoading(false);
      }, error => {
        console.error("Erro ao buscar ficha:", error);
        setIsLoading(false);
      });

    // Limpa o "ouvinte" ao sair da tela
    return () => subscriber();
  }, [sheetId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{sheetData?.name}</Text>
        <Text style={styles.detail}>Raça: {sheetData?.race}</Text>
        <Text style={styles.detail}>Classe: {sheetData?.characterClass}</Text>
        <Text style={styles.detail}>Tendência: {sheetData?.trend}</Text>
        
        <Text style={styles.sectionTitle}>Atributos</Text>
        <Text style={styles.detail}>Força: {sheetData?.strength}</Text>
        <Text style={styles.detail}>Destreza: {sheetData?.dexterity}</Text>
        <Text style={styles.detail}>Destreza: {sheetData?.constitution}</Text>
        <Text style={styles.detail}>Destreza: {sheetData?.wisdom}</Text>
        <Text style={styles.detail}>Destreza: {sheetData?.intelligence}</Text>
        <Text style={styles.detail}>Destreza: {sheetData?.charisma}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  detail: { fontSize: 18, color: '#ccc', marginBottom: 8 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 20, marginBottom: 10 },
});

export default SheetDetailScreen;