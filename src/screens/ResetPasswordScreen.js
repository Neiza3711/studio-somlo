import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function ResetPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
  
    const handlePasswordReset = async () => {
      if (!email) return Alert.alert('Error', 'Introduce tu correo');
      try {
        await sendPasswordResetEmail(auth, email);
        Alert.alert('Correo enviado', 
            'Te hemos enviado un email para restablecer tu contraseña'
        );
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };
  return (
    <SafeAreaView style={styles.container}>
       <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <Text style={styles.title}>Recuperar contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePasswordReset}
      >
        <Text style={styles.buttonText}>Enviar enlace</Text>
      </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    padding: 20,             
    justifyContent: 'flex-start',
    alignItems: 'center', 
    paddingTop: 80       
  },
  title: { 
    fontSize: 20, 
    fontWeight: '600',
    flexDirection: 'row',
     marginBottom: 20,
    },
  input: {
    width: '100%',
    height: 48,
    alignSelf: 'strech',
    borderWidth: 1.2,
    alignItems: 'center',
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    flewDirection: 'row'
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16 
    
  }
   
});
