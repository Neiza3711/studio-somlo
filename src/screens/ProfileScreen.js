import React, { useContext, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';
import { auth, db, storage } from '../firebase/config';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


export default function ProfileScreen({ navigation: navProp }) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
 

    // Carga datos de Firestore
    useEffect(() => {
      let isMounted = true;
      (async () => {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists() && isMounted) setUserData(snap.data());
        } catch (e) {
          console.error('Error fetching userData:', e);
          Alert.alert('Error', 'No se pudo cargar tus datos.');
        } finally {
          if (isMounted) setLoading(false);
        }
      })();
      return () => { isMounted = false; };
    }, [user.uid]);
      // Subir nueva imagen
    const pickAndUploadImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería.');
        return;
      }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (result.canceled || !result.assets?.length) {
        Alert.alert('No se seleccionó ninguna imagen.');
        return;
      }

        try {
        setUploading(true);
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();

        const avatarRef = storageRef(storage, `avatars/${user.uid}.png`);
        // Eliminar anterior si existe
        if (userData?.photoURL) {
          try { await deleteObject(avatarRef); } catch {};
        }
        await uploadBytes(avatarRef, blob);
        const downloadURL = await getDownloadURL(avatarRef);
        await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });
        setUserData(prev => ({ ...prev, photoURL: downloadURL }));
        Alert.alert('¡Listo!', 'Foto de perfil actualizada.');
      } catch (e) {
        console.error('Error subiendo avatar:', e);
        Alert.alert('Error', 'No se pudo guardar la imagen.');
      } finally {
        setUploading(false);
      }
    };

  // Eliminar imagen
    const deleteProfileImage = async () => {
      if (!userData?.photoURL) {
        Alert.alert('No hay imagen para eliminar.');
        return;
      }
      try {
        const avatarRef = storageRef(storage, `avatars/${user.uid}.png`);
        await deleteObject(avatarRef);
        await updateDoc(doc(db, 'users', user.uid), { photoURL: null });
        setUserData(prev => ({ ...prev, photoURL: null }));
        Alert.alert('¡Listo!', 'Foto de perfil eliminada.');
      } catch (e) {
        console.error('Error eliminando avatar:', e);
        Alert.alert('Error', 'No se pudo eliminar la imagen.');
      }
    };

    const handleLogout = async () => {
      await signOut(auth);
      navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
    };

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      );
    }
    
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickAndUploadImage}>
           <Image
            source={
              userData?.photoURL
                ? { uri: userData.photoURL }
                : require('../../assets/Profile.png')
            }
            style={styles.avatar}
          />
          {uploading && (
            <ActivityIndicator
              style={styles.uploadIndicator}
              size="small"
              color="#2196F3"
            />
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={deleteProfileImage}>
        <Text style={styles.deleteText}>Eliminar foto</Text>
      </TouchableOpacity>

      {/* Datos */}
      <View style={styles.infoContainer}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Nombre completo</Text>
          <Text style={styles.cardValue}>{userData.fullName ?? '—'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Usuario</Text>
          <Text style={styles.cardValue}>{userData.username ?? '—'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Email</Text>
          <Text style={styles.cardValue}>{user.email ?? '—'}</Text>
        </View>
       <TouchableOpacity
        style={styles.nextButton} 
        onPress={() => navigation.navigate('Orders')}>
        <Text style={styles.nextText}>Mis Pedidos</Text>
        </TouchableOpacity>
      </View>
      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
       
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9f9f9' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginLeft: 12 
  },

  avatarContainer: { 
    alignItems: 'center',
    marginTop: 10 
  },
  avatar: {
    width: 120, 
    height: 120, 
    borderRadius: 60,
    borderWidth: 2, 
    borderColor: '#2196F3',
  },
  uploadIndicator: {
    position: 'absolute', 
    top: 44,
    left: 44,
  },

  infoContainer: { 
    marginTop: 30, 
    paddingHorizontal: 20 
  },
  card: {
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3,
  },
  cardLabel: { 
    fontSize: 12, 
    color: '#888', 
    marginBottom: 4 
  },
  cardValue: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333' 
  },
  logoutButton: {
    backgroundColor: '#E0E0E0', 
    margin: 20, 
    paddingVertical: 14,
    borderRadius: 8, 
    alignItems: 'center',
  },
  logoutText: { 
    fontSize: 16, 
    color: '#000' 
  },
  nextButton: {
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#90CAF9',
    borderRadius: 8, 
    padding: 16, 
    marginBottom: 16,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    paddingVertical: 14,
    shadowRadius: 4, 
    elevation: 3,
  },
  nextText: {
    fontSize: 16,
    color: '#000' 
  },
   deleteButton: { 
    marginTop: 20, 
    paddingVertical: 5, 
    paddingHorizontal: 20,
    backgroundColor: '#fff', 
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',  
   shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3,
  },
});