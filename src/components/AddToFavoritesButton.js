// src/components/AddToFavoritesButton.js
import React, { useState, useContext } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFavorites } from '../contexts/FavoritesContext';
import { AuthContext } from '../contexts/AuthContext';

export default function AddToFavoritesButton({ item }) {

  const { user } = useContext(AuthContext);
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [scale] = useState(new Animated.Value(1));

 if (user?.isAnonymous) {
    return null;
  }

  const isFav = favorites.some(f => f.id === item.id);

  const handlePress = () => {
    // efecto “pop”
    Animated.sequence([
    Animated.timing(scale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
    Animated.timing(scale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
    ]).start();

    // toggle favorito
    if (isFav) removeFromFavorites(item.id);
    else addToFavorites(item);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
        <MaterialIcons
          name={isFav ? 'favorite' : 'favorite-border'}
          size={20}
          color={isFav ? '#e57373' : '#888'}  // rojo claro / gris
        />
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
});
