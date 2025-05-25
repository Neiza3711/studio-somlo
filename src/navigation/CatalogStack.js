// navigation//CatalogStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CatalogScreen from '../screens/CatalogScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function CatalogStack() {
  return (
      <Stack.Navigator
      screenOptions={{
        headerTintColor: '#333',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,      // Android
          shadowOpacity: 0,  // iOS
        },
        headerBackTitleVisible: false,  
        headerBackTitle: '',           
      }}
    >
        <Stack.Screen
        name="CatalogHome"
        component={CatalogScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: true,
          title: '',         
        }}
      />
    </Stack.Navigator>
  );
}