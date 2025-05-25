// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import AppTabs from '../navigation/AppTabs';
const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
      <Stack.Navigator
        initialRouteName="Login"
       screenOptions={{ headerShown: false }}
     >
       <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
    name="ResetPassword"
    component={ResetPasswordScreen}
    options={{
      headerShown: true,               
      title: 'Recuperar contraseña',   
      headerBackTitleVisible: false,   
      headerTintColor: '#333',
      headerStyle: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
      },
    }}
  />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* 3) Una vez hecho login, reemplaza a “Home” */}
      <Stack.Screen
        name="Home"
        component={AppTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
