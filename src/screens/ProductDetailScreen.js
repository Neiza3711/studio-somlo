// screens//ProductDetails.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import AddToCartButton from '../components/AddToCartButton';
import AddToFavoritesButton from '../components/AddToFavoritesButton';


export default function ProductDetailScreen({ route, navigation }) {
  const { addToCart } = useCart();
  const { item } = route.params;
  const { width: screenWidth } = Dimensions.get('window');
  const gap = 10;
  const imageWidth = screenWidth - gap * 2;
  const imageHeight = (imageWidth * 300) / 395;

  // Para el FlatList auto-scroll
  const flatListRef = useRef(null);
  const slideIndex = useRef(0);
  

  useEffect(() => {
    if (item.images.length <= 1) return;
    const timer = setInterval(() => {
      slideIndex.current = (slideIndex.current + 1) % item.images.length;
      flatListRef.current?.scrollToOffset({
        offset: slideIndex.current * imageWidth,
        animated: true,
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [item.images.length, imageWidth]);


    {/* Carrusel horizontal de imágenes */}
  return (
    <ScrollView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={item.images}
        keyExtractor={(_, i) => `${item.id}-${i}`}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: gap }}
        renderItem={({ item: uri }) => (
          <Image
            source={uri}
            style={[styles.tinyLogo, { width: imageWidth, height: imageHeight }]}
            resizeMode="cover"
          />
        )}
      />
       {/* Información del producto */}
      <View style={styles.info}>
        {/* Título + icono azul inline */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          <AddToFavoritesButton item={item} />
          <AddToCartButton item={item} />
        </View>
        
      
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.dimensions}>Medidas: {item.dimensions}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    
  },
  tinyLogo: {
    marginVertical: 0,   
    marginHorizontal: 0,
  },
  info: { 
    padding: 16,
    paddingTop: 10, 
    
  },
   titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700',
     marginBottom: 8 
  },
  price: { 
    fontSize: 18,
    color: '#666',
    marginBottom: 12 
  },
  description: { 
    fontSize: 16,
    marginBottom: 12,
    color: '#444' 
  },
  dimensions: { 
    fontSize: 14, 
    color: '#666' 
  },
   addButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inlineCart: {
  padding: 4,
  marginLeft: 3,
},
});