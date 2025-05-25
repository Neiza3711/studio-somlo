// App.js
import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from './src/contexts/CartContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import AppTabs from './src/navigation/AppTabs';
import AuthStack from './src/navigation/AuthStack';
import { FavoritesProvider } from './src/contexts/FavoritesContext';

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
      {/* SafeAreaView garantiza fondo blanco detrás del notch/status bar */}
      <SafeAreaView style={styles.safe}>
        {/* StatusBar con fondo blanco y estilo oscuro */}
        <StatusBar style="dark" backgroundColor="#fff" />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaView>
      </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user, initializing } = useContext(AuthContext);
    // Mostrará siempre la pantalla de WelcomeScreen
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (showWelcome) {
    return <WelcomeScreen />;
  }
   if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }
   if (!user) {
    return <AuthStack />;
  }

  return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* MAIN: tu TabNavigator */}
      <RootStack.Screen name="Main" component={AppTabs} />
      {/* AUTH: tu flujo de login/register en modal */}
       <RootStack.Screen
        name="Auth"
        component={AuthStack}
        options={{ presentation: 'modal' }}
      />
     </RootStack.Navigator>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
});