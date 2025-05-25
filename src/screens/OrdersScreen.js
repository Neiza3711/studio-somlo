import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function OrdersScreen() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.isAnonymous) return;
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(list);
      setLoading(false);
    }, err => {
      console.error('Error fetching orders:', err);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.uid]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No tienes pedidos aún.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.orderId}>Pedido n.º {item.orderNumber}</Text>
      <Text style={styles.date}>
        {item.createdAt?.toDate().toLocaleString()}
      </Text>
      <FlatList
        data={item.items}
        keyExtractor={i => i.id}
        renderItem={({ item: prod }) => (
          <View style={styles.prodRow}>
            <Text style={styles.prodName}>{prod.name}</Text>
            <Text style={styles.prodQty}>x{prod.quantity}</Text>
          </View>
        )}
      />
      <Text style={styles.total}>Total: {item.total}€</Text>
    </View>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={o => o.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: { 
    flex:1, 
    justifyContent:'center', 
    alignItems:'center' 
  },
  emptyText: { 
    fontSize:16, 
    color:'#666' 
  },
  list: { 
    padding:16 
  },
  card: { 
    backgroundColor:'#fff', 
    padding:12, 
    marginBottom:12, 
    borderRadius:8, 
    elevation:2 
  },
  orderId: { 
    fontSize:14, 
    fontWeight:'bold', 
    marginBottom:4 
  },
  date: { 
    fontSize:12, 
    color:'#888', 
    marginBottom:8 
  },
  prodRow: { 
    flexDirection:'row', 
    justifyContent:'space-between' 
  },
  prodName: { 
    fontSize:14 
  },
  prodQty: { 
    fontSize:14, 
    color:'#888' 
  },
  total: { 
    marginTop:8, 
    fontSize:16, 
    fontWeight:'600' 
  },
});