import React, { useContext } from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useCart } from '../contexts/CartContext'; 
import AddToCartButton from '../components/AddToCartButton';
import AddToFavoritesButton  from '../components/AddToFavoritesButton';



const gap = 10;
const { width: screenWidth } = Dimensions.get('window');
const halfWidth = (screenWidth - gap * 3) / 2;
const fullWidth = screenWidth - gap * 2;

  {/* Información de los producto */}
const PRODUCTS = [
  
  {
    id: '1',
    title: 'Lámparas minimalistas',
    price: '2600€',
    span: 'half',
    // array de imágenes para el detalle
    images: [
      require('../../assets/Lampara.png'),
      require('../../assets/Lampara2.png'),
      require('../../assets/Lampara1.png'),
    ],
    description: 'Lámparas de diseño minimalista, juego de dos unidades.',
    dimensions: '51cm de Diámetro x 31cm de fondo x 55cm de altura ',
  },
  {
    id: '2',
    title: 'Banco artístico',
    price: '7000€',
    span: 'half',
    images: [
      require('../../assets/Varios1.png'),
      require('../../assets/Varios.png'),
      require('../../assets/Varios2.png'),
      require('../../assets/Varios3.png'),
    ],
    description: 'Banco artístico con diferentes texturas y tonalidades.',
    dimensions: '43 cm de alto × 30cm de ancho × 150cm de largo',
  },
  {
    id: '3',
    title: 'Pieza artística',
    price: '6000€',
    span: 'full',
    images: [
      require('../../assets/Balance.png'),
      require('../../assets/Balance1.png'),
    ],
    description: 'Escultura con texturas diversas.',
    dimensions: '74 cm de alto × 43cm de ancho × 88cm de largo',
  },
  {
    id: '4',
    title: 'Lámpara Dipisa',
    price: '2950€',
    span: 'half',
    images: [
      require('../../assets/LamparaInclinada.png'),  
    ],
    description: 'Lámpara con inclinación con pantalla texturada de metacrilato.',
    dimensions: '66 cm de alto × 39cm de ancho × 53cm de largo',
  },
  {
    id: '5',
    title: 'Lámpara Coral',
    price: '2200€',
    span: 'half',
    images: [
      require('../../assets/LamparaCircular.png'),
      require('../../assets/LamparaCircular1.png'),
      require('../../assets/LamparaCircular2.png'),
    ],
    description: 'Lámpara inspirada en la estructura marina.',
    dimensions: '43 cm de alto × 36cm de diámetro',
  },
  {
    id: '6',
    title: 'Mesa Stone',
    price: '3500€',
    span: 'full',
    images: [
      require('../../assets/MesaStone.png'),
      require('../../assets/MesaStone2.png'),
      require('../../assets/MesaStone1.png'),
      require('../../assets/MesaStone3.png'),
    ],
    description: 'Mesa de salón circular',
    dimensions: '100cm de Diámetro x 33 cm de altura',
  },
  {
    id: '7',
    title: 'Mesa rectangular',
    price: '8000€',
    span: 'full',
    images: [
      require('../../assets/MesaGrande.png'),
    ],
    description: 'Mesa moderna rectangular para exterior techado.',
    dimensions: '77 cm de alto × 120cm de ancho × 380cm de largo',
  },
  {
    id: '8',
    title: 'Mesa Circular',
    price: '5000€',
    span: 'full',
    images: [
      require('../../assets/MesaRedonda.png'),
    ],
    description: 'Mesa redonda con base metálica y tapa de mármol.',
    dimensions: '180cm de Diámetro x 77 cm de altura',
  },
  {
    id: '9',
    title: 'Mesa rectangular',
    price: '6000€',
    span: 'full',
    images: [
      require('../../assets/MesaGrande2.png'),
    ],
    description: 'Mesa rectangular de comedor o exterior techado.',
    dimensions: '77 cm de alto × 100cm de ancho × 300cm de largo',
  },
  {
    id: '10',
    title: 'Pequeño banco',
    price: '900€',
    span: 'half',
    images: [
      require('../../assets/banco.png'),
      require('../../assets/banco1.png'),
      require('../../assets/banco2.png'),
    ],
    description: 'Banco pequeño color bronce.',
    dimensions: '30 cm de alto × 30cm de ancho × 30cm de largo',
  },
];

export default function CatalogoScreen({ navigation }) {
   const { addToCart } = useCart();

  // Agrupa
  const rows = [];
  let buffer = [];
  PRODUCTS.forEach(item => {
    if (item.span === 'half') {
      buffer.push(item);
      if (buffer.length === 2) {
        rows.push({ type: 'half', items: buffer });
        buffer = [];
      }
    } else {
      if (buffer.length) {
        rows.push({ type: 'half', items: buffer });
        buffer = [];
      }
      rows.push({ type: 'full', items: [item] });
    }
  });
  if (buffer.length) rows.push({ type: 'half', items: buffer });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo arriba */}
      <Text style={styles.logo}>
        <Text style={styles.studioLogo}>studio</Text>{' '}
        <Text style={styles.somloLogo}>SØMLO</Text>
      </Text>

      {rows.map((row, rowIndex) => {
        if (row.type === 'half') {
          return (
            <View style={styles.halfRow} key={`half-${rowIndex}`}>
              {row.items.map(item => (
                <View key={item.id} style={[styles.cardHalf, { width: halfWidth }]}>                  
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ProductDetail', { item })}
                  >
                    <Image
                      source={item.images[0]}
                      style={styles.imageHalf}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  <View style={styles.infoRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <AddToFavoritesButton item={item} />
                    <AddToCartButton item={item} />
                  </View>
                  <Text style={styles.price}>{item.price}</Text>
                </View>
                
              ))}
            </View>
          );
        }
          const item = row.items[0];
          return (
            <View key={item.id} style={styles.cardFull}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProductDetail', { item })}
              >
                <Image
                  source={item.images[0]}
                  style={styles.tinyLogo}
                  resizeMode="cover"
                />
              </TouchableOpacity>
  
              <View style={styles.infoRow}>
              <Text style={styles.title}>{item.title}</Text>
               <AddToFavoritesButton item={item}/>
               <AddToCartButton item={item}/>
              </View>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            
          );
        })}
      </ScrollView>
    );
  }
const styles = StyleSheet.create({
  container: {
    padding: gap,
    paddingTop: gap * 2,
    backgroundColor: '#f9f9f9',
  },
  logo: {
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 30,
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

  halfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: gap,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex',
  },
  inlineCart: {
    padding: 4,
  },  
  cardHalf: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: gap,
  },
  imageHalf: {
    width: halfWidth,
    height: halfWidth,
  },
  cardFull: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: gap,
    position: 'relative',
  },
  tinyLogo: {
    width: 380,
    height: 400,
    marginTop: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: gap,
    marginBottom: gap / 2,
  },
  inlineCart: {
    padding: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: gap / 2,
    marginHorizontal: 20,
    flex: 1,
    marginBottom: 0,
    marginLeft: gap / 2
  },
  price: {
    fontSize: 12,
    color: '#666',
    marginBottom: gap,
    marginHorizontal:15,
  },
});