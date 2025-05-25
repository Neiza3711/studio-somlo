import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !fullName || !username || !password) {
      Alert.alert('Error', 'Rellena todos los campos');
      return;
    }
    try {
      //Creamos una cuenta en Firebase Auth
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      //Guardamos los datos extra en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        username,
        email,
        createdAt: new Date(),
      });
       Alert.alert('Registro exitoso', '¡Usuario registrado con éxito!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Este correo ya está registrado. Usa otro o inicia sesión.');
      } else {
        Alert.alert('Error al registrar', error.message);
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <Text style={styles.logo}>
          <Text style={styles.studioLogo}>studio</Text>{' '}
          <Text style={styles.somloLogo}>SØMLO</Text>
        </Text>

        {/* Título y subtítulo */}
        <Text style={styles.title}>Registro de Usuario</Text>
        <Text style={styles.subtitle}>Regístrate para comprar tus piezas favoritas</Text>

        {/* Campos de registro */}
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#B0B0B0"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre Completo"
          placeholderTextColor="#B0B0B0"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#B0B0B0"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {/* Botón Registrar */}
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleRegister}
        >
        {/* Siguiente */}
        <Text style={styles.nextText}>Siguiente</Text>
       </TouchableOpacity>

        {/* Términos que faltan implementar*/}
         <Text style={styles.terms}>
          Al pulsar Siguiente aceptarás los Términos y Condiciones
        </Text>

        {/* Link a Login */}
        <Text
            style={styles.loginText}
            onPress={() => navigation.navigate('Login')}>
            Inicia sesión
          </Text>
      </ScrollView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 40,
  },
  studioLogo: {
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  somloLogo: {
    marginTop: 20,
    fontSize: 24,
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    color: '#2196F3',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 5,
  },
  separatorText: {
    marginHorizontal: 20,
    color: '#B0B0B0',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  nextButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  nextText: {
    fontSize: 16,
    color: '#2196F3',
  },
  terms: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 10,
  },
  loginLink: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});