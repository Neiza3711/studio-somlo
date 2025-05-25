import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Debes completar ambos campos');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert('Error al iniciar sesión', error.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      Alert.alert('Error al entrar como invitado', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Selector de idioma - Para mejora futura (los idiomas) */}
      <TouchableOpacity style={styles.languageContainer}>
        <Text style={styles.languageText}>español (España)</Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#B0B0B0" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        {/* Logo */}
        <Text style={styles.logo}>
          <Text style={styles.studioLogo}>studio</Text>{' '}
          <Text style={styles.somloLogo}>SØMLO</Text>
        </Text>

        {/* Formulario de Login */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico o usuario"
            placeholderTextColor="#B0B0B0"
            value={email}
            onChangeText={setEmail}
          />

          {/* Contenedor de contraseña con ícono eye */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña"
              placeholderTextColor="#B0B0B0"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeTouchable}
              onPress={() => setShowPassword(prev => !prev)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#B0B0B0"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Acceder</Text>
          </TouchableOpacity>

          <Pressable style={styles.linkWrapper} onPress={handleGuestLogin}>
            <Text style={styles.link}>Entrar como invitado</Text>
          </Pressable>

          <Pressable
            style={styles.linkWrapper}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={styles.link}>¿Has olvidado la contraseña?</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Pie de página */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>
            ¿No tienes cuenta? <Text style={styles.signup}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  languageContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  languageText: {
    color: '#B0B0B0',
    fontSize: 14,
    marginRight: 4,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    textAlign: 'center',
    marginBottom: 40,
  },
  studioLogo: {
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  somloLogo: {
    fontSize: 24,
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  form: {
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeTouchable: {
    padding: 5,
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#90CAF9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#2196F3',
  },
  linkWrapper: {
    marginBottom: 10,
  },
  link: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  signup: {
    color: '#000000',
    fontWeight: 'bold',
  },
});
