// src/screens/CartScreen.js
import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase/config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';



export default function CartScreen() {
  const navigation = useNavigation();
  const { items, removeFromCart, clearCart } = useCart();
  const { user } = useContext(AuthContext);  
  const isGuest = user?.isAnonymous;  

  // Vuelve siempre al 'catálogo'
   const handleBack = () => {
    navigation.navigate('Catalog', {
    });
  }

  // Gestiona el pago
    const handleCheckout = async () => {
    if (items.length === 0) {
      return Alert.alert('Carrito vacío', 'Añade algún producto antes de pagar.');
    }
    if (isGuest) {
      return Alert.alert(
        'Regístrate para finalizar la compra',
        'Necesitas una cuenta para comprar',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Registrarme', onPress: () => navigation.navigate('Auth', { screen: 'Register' })
        },
        ]
      );
    }
    /// Usuario registrado: creamos orderId propio y guardamos
      try {
      const now = Date.now();
      const orderId = `${user.uid}-${now}`; 
      const orderNumber = new Date(now).toLocaleString();       
      const orderData = { 
        orderId,
        orderNumber,
        userId:    user.uid,
        items:     items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total:     items.reduce((sum, i) => sum + (parseFloat(i.price.replace('€',''))||0)*i.quantity, 0),
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'orders', orderId), orderData);
      clearCart();
      Alert.alert('¡Pedido creado!', `Número de pedido: ${orderNumber}`);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo procesar la orden.');
      }
    }
   
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}{item.quantity > 1 ? ` ×${item.quantity}` : ''}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tu Carrito</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
            <Text style={styles.clearText}>Vaciar</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {items.length > 0 && (
        <TouchableOpacity
         style={styles.checkoutButton}
         onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutText}>Pagar</Text>
          </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  backButton: { 
    marginRight: 16 
  },
  headerTitle: { 
    position: 'absolute',
    left: 0,
    right: 0,
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center',
    pointerEvents: 'none', 
  },
  clearButton: { 
    marginLeft: 'auto', 
  },
  clearText: { 
    color: 'red', 
    fontSize: 14 },
  content: { 
    flex: 1, 
    padding: 20 
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center',
     alignItems: 'center' 
    },
  emptyText: { 
    color: '#999', 
    textAlign: 'center', 
    fontSize: 16 
  },
  list: { 
    padding: 16 
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  image: { 
    width: 60, 
    height: 60, 
    borderRadius: 8,
    marginRight: 12 
  },
  info: { 
    flex: 1 
  },
  name: { 
    fontSize: 16, 
    fontWeight: '500'
  },
  price: { 
    fontSize: 14,
    color: '#888' 
  },
  checkoutButton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20
  },
  checkoutText: {
    color: '#fff', 
    fontSize: 16 
  }
});
