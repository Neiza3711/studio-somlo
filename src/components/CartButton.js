import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../contexts/CartContext';

export default function CartButton() {
  const navigation = useNavigation();
  const { items } = useCart();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('CartScreen')}
    >
      <Text style={styles.icon}>🛒</Text>
      {items.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{items.length}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { 
    marginRight: 16 
  },
  icon: { 
    fontSize: 24 
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
});
