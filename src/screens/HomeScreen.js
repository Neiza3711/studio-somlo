import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';


export default function HomeScreen({ navigation }) {
    return (
      <View style={styles.container}>
        {/* Logo anidado*/}
               <Text style={styles.logo}>
                 <Text style={styles.studioLogo}>studio</Text>
                 { ' ' }
                 <Text style={styles.somloLogo}>SØMLO</Text>
               </Text>
  
        {/* Imagen de cabecera */}
        <Image
          source={require('../../assets/Conjunto.png')} 
          style={styles.tinyLogo}
          resizeMode="cover"
        />

        {/* Texto de bienvenida */}
        <Text style={styles.title}>Bienvenidos</Text>
        <Text style={styles.subtitle}>
          Arte y diseño funcional que transforma espacios en experiencias.
        </Text>

        <View style={styles.buttonsColumn}>
           {/* Botón "Sobre mí-Artista David Somlo' */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Artist')} >
          <Text style={styles.buttonText}>Sobre mí</Text>
        </TouchableOpacity>

         {/* Botón "Tienda' */}
         <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Catalog')}
        >
          <Text style={styles.buttonText}>Tienda</Text>
        </TouchableOpacity>
      </View>
      </View>
    );
  }

    const styles = StyleSheet.create({
      container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,       
    },
    logo: {
      textAlign: 'center',
      flexDirection: 'row',
      marginBottom: 20,
      marginTop: 20,
    },      
    studioLogo: {
      fontSize: 16,
      letterSpacing: 1,
      textTransform: 'lowercase',
    },
    somloLogo: {
      fontSize: 18,
      letterSpacing: 6,
      textTransform: 'uppercase',
    },
    tinyLogo: {
      width: 395,
      height: 300,
      marginTop: 20,
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      color: '#666',
      marginBottom: 20,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
    },
    buttonsColumn: {
      width: '100%',
      flexDirection: 'column',  
      alignItems: 'center',     
      gap: 10,                  
    },
    button: {
      width: '70%',
      backgroundColor: '#E0E0E0',
      paddingVertical: 12,
      borderRadius: 8,
      marginVertical: 5,  
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      color: '#000',
    },
  });