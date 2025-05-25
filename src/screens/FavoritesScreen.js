import React, { useContext, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart }      from '../contexts/CartContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const isGuest = user?.isAnonymous;

  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  // Si es invitado, alert y redirige a catálogo
  useEffect(() => {
    if (isGuest) {
      Alert.alert(
        'Acceso denegado',
        'Necesitas registrarte para usar favoritos.',
        [{ text: 'OK', onPress: () => navigation.replace('Catalog') }]
      );
    }
  }, [isGuest]);

  // Navegar siempre al catálogo
  const handleBack = () => navigation.navigate('Catalog');

  // Cabecera con flecha y título centrado
  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Mis Favoritos</Text>
      {/* placeholder para equilibrar */}
      <View style={styles.backButton} />
    </View>
  );

  if (isGuest) {
    // mientras se dispara el alert, evitamos renderizar la lista
    return null;
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aún no tienes favoritos.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => {
    // toma la primera imagen si existe un array, o fallback a item.image
    const thumbnail = Array.isArray(item.images)
      ? item.images[0]
      : item.image;

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetail', { item })}
        >
          <Image source={thumbnail} style={styles.image} />
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>

        <View style={styles.actions}>
          {/* Añadir al carrito y quitar de favoritos */}
          <TouchableOpacity
            onPress={() => {
              addToCart(item);
              removeFromFavorites(item.id);
              Alert.alert('Añadido', 'Se ha movido al carrito.');
            }}
            style={styles.cartButton}
          >
            <MaterialIcons name="add-shopping-cart" size={20} color="#2196F3" />
          </TouchableOpacity>

          {/* Eliminar favorito */}
          <TouchableOpacity
            onPress={() => removeFromFavorites(item.id)}
            style={styles.deleteButton}
          >
            <MaterialIcons name="delete" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  backButton: { width: 28 /* ancho del icono, para placeholder */ },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },

  list: { padding: 16 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 8,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },

  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '500' },
  price: { fontSize: 14, color: '#888' },

  actions: { flexDirection: 'row' },
  cartButton: { marginRight: 12 },
  deleteButton: {},
});
