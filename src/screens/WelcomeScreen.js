// src/screens/WelcomeScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';
console.log('Firebase Auth ready:', auth);


export default function WelcomeScreen({ }) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.studio}>studio </Text>
        <Text style={styles.somlo}>SØMLO</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  title: {
    flexDirection: 'row',
  },
  studio: {
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  somlo: {
    fontSize: 26,
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
});