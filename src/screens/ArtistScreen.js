import React from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const gap = 16;
const imageWidth = screenWidth - gap * 2;

// Datos del artista
const ARTIST_IMAGES = [
  {
    id: 'a1',
    src: require('../../assets/ArtistImagen/David.png'),
    description: 'Mi nombre es David Somlo.',
  },
  {
    id: 'a2',
    src: require('../../assets/ArtistImagen/David1.png'),
    description: 'Disfruto creando arte funcional que vista espacios en los que se cree armonía visual relajante.',
  },
  {
    id: 'a3',
    src: require('../../assets/ArtistImagen/ZonaTrabajo.png'),
    description: 'Mi proceso creativo y de diseño es variado e incluye un cien por cien de proceso artesanal; la que a veces combino con tecnología.',
  },
  {
    id: 'a4',
    src: require('../../assets/ArtistImagen/ZonaTrabajo3.png'),
    description: '',
  },
  {
    id: 'a5',
    src: require('../../assets/ArtistImagen/ZonaTrabajo1.png'),
    description: 'Todos los materiales con los que trabajo, son el resultado de años de desarrollo e investigación aditiva propia, pudiendo conseguir con estos, piezas con infinidad de diseños, tamaños, texturas y excelente resistencias.',
  },
  {
    id: 'a6',
    src: require('../../assets/ArtistImagen/ZonaTrabajo2.png'),
    description: 'Mi espacio de trabajo es modesto en cuanto a tamaño, pero me permite desarrollar todo mi proceso creativo.',
  },
  
  
];

export default function ArtistScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sobre mí</Text>
      {ARTIST_IMAGES.map((img) => (
        <View key={img.id} style={styles.block}>
          <Image
            source={img.src}
            style={styles.tinyLogo}
            resizeMode="cover"
          />
          <Text style={styles.description}>{img.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: gap,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
    marginTop: 40,
  },
  block: {
    marginBottom: gap * 1.5,
  },
  tinyLogo: {
    alignSelf: 'center',
    width: 440,
    height: 500,
    marginTop: 20,
    marginBottom: 20,

  },
  description: {
    marginTop: gap / 2,
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
});











