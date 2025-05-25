// src/contexts/FavoritesContext.js
import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';
import { AuthContext } from './AuthContext';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const FavoritesContext = createContext({
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  clearFavorites: () => {},
});

export function FavoritesProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  // 🎯 Al cambiar de usuario (login/logout), carga sus favoritos
  useEffect(() => {
    if (!user?.uid) {
      setFavorites([]);
      return;
    }
    (async () => {
      const snap = await getDoc(doc(db, 'favorites', user.uid));
      setFavorites(snap.exists() ? snap.data().items || [] : []);
    })();
  }, [user?.uid]);

  // 🎯 Cada vez que cambian los favoritos, los guardo en Firestore
  useEffect(() => {
    if (!user?.uid) return;
    setDoc(
      doc(db, 'favorites', user.uid),
      { items: favorites },
      { merge: true }
    ).catch(console.error);
  }, [favorites, user?.uid]);

  const addToFavorites = item => {
    setFavorites(prev => prev.some(f => f.id === item.id) ? prev : [...prev, item]);
  };
  const removeFromFavorites = id => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };
  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
