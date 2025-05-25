// src/components/AddToCartButton.js
import React, { useState } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';

export default function AddToCartButton({ item }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const scale = useState(new Animated.Value(1))[0];

  const handlePress = () => {
    addToCart({
      id:    item.id,
      name:  item.title,
      price: item.price,
      image: item.images[0],
    });

    Animated.sequence([
      Animated.timing(scale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
    ]).start();

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
        {added
          ? <Text style={styles.check}>✅</Text>
          : <MaterialIcons name="add-shopping-cart" size={16} color="#80C1FF" />
        }
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: 16,
  },
});
