// src/navigation/CustomTapBar.js
import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { AuthContext } from '../contexts/AuthContext';

export default function CustomTabBar({ state, descriptors, navigation }) {
  const { user } = useContext(AuthContext);
  const isGuest = user?.isAnonymous;
  const { items } = useCart();
  const { favorites } = useFavorites();
  const catalogIndex = state.routes.findIndex(r => r.name === 'Catalog');


  return (
    <View style={styles.bar}>
    
          {state.routes.map((route, idx) => {
        // 1️⃣ Ocultar el icono de Catalog y Artist siempre
        if (['Catalog', 'Artist'].includes(route.name)) {
          return null;
        }

        // 2️⃣ Ocultar favoritos si es invitado
        if (route.name === 'Favorites' && isGuest) {
          return null;
        }

        // 3️⃣ Ocultar carrito cuando estás en Home si así lo quieres
        if (route.name === 'Cart' && route.name === state.routes[state.index].name) {
          // si la pestaña activa (state.index) es "Home", y route.name es "Cart", lo ocultamos
          if (state.routes[state.index].name === 'Home') {
            return null;
          }
        }
        
        const isFocused = state.index === idx;
        const color = isFocused ? '#2196F3' : '#B0B0B0';
        let iconName = 'question-mark';
        
        
        switch (route.name) {
          case 'Home':     iconName = 'home'; break;
          case 'Search':   iconName = 'search'; break;
          case 'Cart':     iconName = 'shopping-cart'; break;
          case 'Favorites':iconName = 'favorite'; break;
          case 'Profile':  iconName = 'person'; break;
        }

       return (
          <TouchableOpacity
            key={route.key}
            style={styles.button}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}>
               <View>
              <MaterialIcons name={iconName} size={28} color={color} />
              {/* badge para carrito */}
              {route.name === 'Cart' && items.length > 0 && (
                <View style={styles.badgeDot} />
              )}
              {/* badge para favoritos */}
              {route.name === 'Favorites' && favorites.length > 0 && (
                <View style={[styles.badgeDot, styles.favoriteDot]} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: 56,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: { flex: 1, alignItems: 'center' },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34bbe9',
  },
  favoriteDot: {
    backgroundColor: '#ccc',  
  },
});
