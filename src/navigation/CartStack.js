import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CartScreen     from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

export default function CartStack() {
  return (
    <Stack.Navigator>
      {/* Tu carrito */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }} 
      />
      {/* Pantalla de checkout */}
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: 'Finalizar compra',
          headerBackTitle: 'Atrás'
        }}
      />
    </Stack.Navigator>
  );
}
