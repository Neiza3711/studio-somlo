import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const CartContext = createContext({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  addItem: () => {},
});

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);


  useEffect(() => {
    if (user && !user.isAnonymous) {
      const cartRef = doc(db, 'carts', user.uid);
      getDoc(cartRef).then((snap) => {
        if (snap.exists()) {
          setItems(snap.data().items || []);
        } else {
          setItems([]); 
        }
      });
    } else {
      setItems([]); 
    }
  }, [user?.uid]);
  
    useEffect(() => {
    if (user && !user.isAnonymous) {
      const cartRef = doc(db, 'carts', user.uid);
      setDoc(cartRef, { items }).catch(console.error);
    }
  }, [items, user?.uid]);

  const addToCart = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

   const removeFromCart = (itemId) => {
    setItems((prev) => prev.filter((p) => p.id !== itemId));
  };

  const clearCart = () => {
  setItems([]);
  }; 
  
   return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
 // Hook helper
 export const useCart = () => useContext(CartContext);