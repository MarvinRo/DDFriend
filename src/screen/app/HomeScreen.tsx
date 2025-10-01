/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text } from 'react-native';
import NaviBar from '../../components/NaviBar';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  return (
    <View style={GlobalStyles.container}>
      <SafeAreaView>
        <NaviBar />
      </SafeAreaView>
      <View style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", }}>
        <View style={{ height: 150, justifyContent: "space-between" }}>
          <Text style={{ fontSize: 40, color: "#fff" }}>Bem vindo </Text>
          <Text style={{ fontSize: 20, color: "#fff" }}>Este aplicativo esta sendo criado para ajudar e facilitar os jogadores em suas fichas. </Text>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;