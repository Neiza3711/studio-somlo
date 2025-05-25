// src/screens/CheckoutScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCart } from '../contexts/CartContext';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { parsePrice } from '../utils/format';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase/config';
import { AuthContext } from '../contexts/AuthContext';

export default function CheckoutScreen({ navigation }) {
  const { items, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const isGuest = user?.isAnonymous;
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [country, setCountry] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);  
  const [savedCards, setSavedCards] = useState([]); 
  const [saveCard, setSaveCard] = useState(false); 
  const [selectedCard, setSelectedCard] = useState(null); 
  const [cardModalVisible, setCardModalVisible] = useState(false);

   // Si es invitado => obligar a registro
  useEffect(() => {
    if (isGuest) {
      Alert.alert(
        'Debes registrarte',
        'Solo usuarios registrados pueden finalizar la compra.',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => navigation.goBack() },
          { text: 'Registrarme', onPress: () => navigation.navigate('Auth', { screen: 'Register' }) },
        ]
      );
    }
  }, []);
   // Solo para usuarios registrados
  useEffect(() => {
  const fetchAddresses = async () => {
    if (user && !isGuest) {
      const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'addresses'));
      const addresses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedAddresses(addresses);
    }
  };
   const fetchCards = async () => {
      if (user && !isGuest) {
        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'cards'));
        const cards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSavedCards(cards);
      }
    };
  fetchAddresses();
  fetchCards();
}, [user]);
// Total calculado
  const total = items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0);
  const handleExpiryChange = (text) => {
  // Elimina todo lo que no sea número
  const cleaned = text.replace(/\D/g, '');
  let formatted = cleaned;
  
  if (cleaned.length >= 3) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  setExpiry(formatted);
};

  const handleConfirm = async () => {
  if (isGuest) return;
  if (!firstName || !lastName ||!address || !city || !postalCode || !country || !province || !cardNumber || !expiry || !cvc) {
    return Alert.alert('Error', 'Por favor completa todos los campos.');
  }

  try {
    // Generar número de pedido único 
    const orderNumber = `PED-${Math.floor(100000 + Math.random() * 900000)}`; // ej: PED-245678
    const fullAddress = `${address}${apartment ? ', ' + apartment : ''}, ${postalCode}, ${city}, ${province} ${country}`;
    const orderData = {
      userId: user.uid,
        firstName,
        lastName,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      total,
      address: fullAddress,
      payment: {
        card: `**** **** **** ${cardNumber.slice(-4)}`,
        expiry,
      },
      orderNumber,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    
    if (saveAddress) {
    const addressData = {
      firstName,
      lastName,
      address,
      apartment,
      city,
      postalCode,
      country,
      province,
      createdAt: serverTimestamp(),
    }
    await addDoc(collection(db, 'users', user.uid, 'addresses'), addressData);
    };
    if (saveCard) {
      const cardData = { cardNumber: cardNumber.slice(-4), expiry, createdAt: serverTimestamp() };
      await addDoc(collection(db, 'users', user.uid, 'cards'), cardData);
    };

    clearCart();
    Alert.alert(
      '¡Pago confirmado!',
      `Pedido confirmado con número:\n${orderNumber}\n\nTu pedido fue creado exitosamente.`,
      [{ text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Catalog' }] }) }]
        );
      } catch (err) {
        console.error('Error al crear orden:', err);
        Alert.alert('Error', 'No se pudo procesar el pedido. Intenta de nuevo.');
      }
    };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.heading}>Confirmar Compra</Text>
        <Text style={styles.label}>Dirección de envío</Text>
      {savedAddresses.length > 0 && (
  <>
    <TouchableOpacity
      style={[styles.input, styles.addressSelector]}
      onPress={() => setAddressModalVisible(true)}
    >
      <Text numberOfLines={1}>
        {selectedAddress ? `${selectedAddress.address}, ${selectedAddress.city}` : 'Selecciona una dirección'}
      </Text>
      <Ionicons name="chevron-down" size={20} color="#555" />
    </TouchableOpacity>

    <Modal
      visible={addressModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setAddressModalVisible(false)}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
        <View style={{
          margin: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          padding: 20,
          width: '80%', 
          alignSelf: 'center' 
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}> Selecciona una dirección</Text>
          <Picker
            selectedValue={selectedAddress ? selectedAddress.id : ''}
            onValueChange={(itemValue) => {
              const selected = savedAddresses.find(a => a.id === itemValue);
              setSelectedAddress(selected);
              if (selected) {
                setFirstName(selected.firstName);
                setLastName(selected.lastName);
                setAddress(selected.address);
                setApartment(selected.apartment);
                setCity(selected.city);
                setPostalCode(selected.postalCode);
                setCountry(selected.country);
                setProvince(selected.province);
              }
            }}
          >
            <Picker.Item label="Selecciona una dirección" value="" />
            {savedAddresses.map(a => (
              <Picker.Item key={a.id} label={`${a.address}, ${a.city}`} value={a.id} />
            ))}
          </Picker>
          <Button title="Confirmar" onPress={() => setAddressModalVisible(false)} />
        </View>
      </View>
    </Modal>
  </>
)}
        <TouchableOpacity
          style={[styles.input, styles.countrySelector]}
          onPress={() => setModalVisible(true)}>
          <Text>{country || 'Selecciona un país'}</Text>
          <Ionicons name="chevron-down" size={20} color="#555" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
            <View style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 20
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'black', marginBottom: 10 }}>Selecciona un país</Text>
              <Picker
                selectedValue={country}
                onValueChange={(itemValue) => setCountry(itemValue)}>
                <Picker.Item label="España" value="España" />
                <Picker.Item label="Francia" value="Francia" />
                <Picker.Item label="Italia" value="Italia" />
                <Picker.Item label="Alemania" value="Alemania" />
                <Picker.Item label="Reino Unido" value="Reino Unido" />
              </Picker>
              <Button title="Confirmar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.flex]} placeholder="Nombre" value={firstName} onChangeText={setFirstName}/>
          <TextInput style={[styles.input, styles.flex]} placeholder="Apellidos" value={lastName} onChangeText={setLastName}/>
        </View>
        <TextInput style={styles.input} placeholder="Calle, Avda, Pje nº" value={address} onChangeText={setAddress}/>
        <TextInput style={styles.input} placeholder="Apt, piso, etc. (opcional)" value={apartment} onChangeText={setApartment}/>
        <View style={styles.row}>
        <TextInput style={[styles.input, styles.inputCity]} placeholder="Ciudad" value={city} onChangeText={setCity}/>
         <TextInput style={[styles.input, styles.inputProvince]} placeholder="Provincia" value={province} onChangeText={setProvince}/>
         </View>
        <TextInput style={[styles.input, styles.inputPostal]} placeholder="Código postal" value={postalCode} onChangeText={setPostalCode} keyboardType="numeric" />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom:30 }}>
        <TouchableOpacity style={{ width: 20, height: 20, borderWidth: 1, borderColor: '#555', backgroundColor: saveAddress ? '#2196F3' : 'white', marginRight: 8, justifyContent: 'center',  alignItems: 'center' }} onPress={() => setSaveAddress(!saveAddress)}>
         {saveAddress && (
      <Ionicons name="checkmark" size={14} color="white" /> 
        )}
         </TouchableOpacity>
        <Text>Guardar dirección para futuras compras</Text>
        </View>
        
        
        <Text style={styles.label}>Número de tarjeta</Text>
        <TextInput style={styles.input} placeholder="0000 0000 0000 0000" keyboardType="numeric" value={cardNumber} onChangeText={setCardNumber} />
        <View style={styles.row}>
        <TextInput style={[styles.input, styles.expire]} placeholder="MM/AA" keyboardType="numeric" value={expiry} onChangeText={handleExpiryChange}/>
        <TextInput style={[styles.input, styles.cvc]} placeholder="CVC" keyboardType="numeric" value={cvc} onChangeText={setCvc} />
        </View>
         <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom:10 }}>
        <TouchableOpacity style={{ width: 20, height: 20, borderWidth: 1, borderColor: '#555', backgroundColor: saveCard ? '#2196F3' : 'white', marginRight: 8, justifyContent: 'center',  alignItems: 'center' }} onPress={() => setSaveCard(!saveCard)}>
         {saveCard && (
      <Ionicons name="checkmark" size={14} color="white" /> 
        )}
         </TouchableOpacity>
        <Text>Guardar tarjeta para futuras compras</Text>
        </View>
          {savedCards.length > 0 && (
          <>
            <TouchableOpacity style={[styles.input, styles.countrySelector]} onPress={() => setCardModalVisible(true)}>
              <Text numberOfLines={1}>{selectedCard ? `**** **** **** ${selectedCard.cardNumber}` : 'Selecciona una tarjeta'}</Text>
              <Ionicons name="chevron-down" size={20} color="#555" />
            </TouchableOpacity>
            <Modal visible={cardModalVisible} animationType="slide" transparent onRequestClose={() => setCardModalVisible(false)}>
              <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%', alignSelf: 'center' }}>
                  <Picker selectedValue={selectedCard ? selectedCard.id : ''} onValueChange={(itemValue) => {
                    const selected = savedCards.find(c => c.id === itemValue);
                    setSelectedCard(selected);
                    if (selected) {
                      setCardNumber(`**** **** **** ${selected.cardNumber}`);
                      setExpiry(selected.expiry);
                    }
                  }}>
                    <Picker.Item label="Selecciona una tarjeta" value="" />
                    {savedCards.map(c => (<Picker.Item key={c.id} label={`**** **** **** ${c.cardNumber}`} value={c.id} />))}
                  </Picker>
                  <Button title="Confirmar" onPress={() => setCardModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        )}

         <Text style={styles.total}>Total: {total.toFixed(2)}€</Text>
        <TouchableOpacity style={[styles.button, isGuest && styles.buttonDisabled]} onPress={handleConfirm} disabled={isGuest}>
          <Text style={styles.buttonText}>{isGuest ? 'Regístrate para pagar' : 'Pagar ahora'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex:1, 
    padding:20, 
    backgroundColor:'#fff' 
},
 inner: {
    padding: 20,
 },    
  heading: { 
    fontSize: 22, 
    fontWeight:'700', 
    marginBottom:5 
},
  label: { 
    fontSize:14, 
    color:'black', 
    marginTop:10 
},
  input: {
    borderWidth:1, 
    borderColor:'#ddd', 
    borderRadius:8,
    padding:12, 
    marginTop:10,
    marginBottom: 3,
    backgroundColor: '#fafafa'
  },
   flex: { 
    width: 170,
     marginTop: 3,
   },
  inputCity: { 
    width: 190,
    marginTop: 3,
  },
  inputProvince: {
    width: 155,
    marginTop: 3,

  },
   inputPostal: { 
    width: 150,
    marginBottom: 10
  },
  addressSelector: {
    width: 350,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    color: '#555'
  },
  countrySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 180,
    color: '#555',
    marginBottom: 4
  },
   row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  expire: { 
    marginRight: 8,
    width: 90,
  },
  cvc: { 
    width: 100,
    marginRight: 150,
  },
  total: { 
    fontSize:18, 
    fontWeight:'600', 
    marginTop:15 
},
  button: {
    backgroundColor:'#2196F3', 
    padding:14, 
    borderRadius:8,
    marginTop:10, 
    alignItems:'center'
  },
  buttonText: { 
    color:'#fff', 
    fontSize:16 
},
});
