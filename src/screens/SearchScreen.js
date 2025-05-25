import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';

const SUGGESTIONS = [
  'Mesas',
  'Lámparas',
  'Bancos',
  'Piezas artísticas',
  'Accesorios',
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
  
      <StatusBar barStyle="dark-content" />

      {/* Barra de búsqueda- futura mejora*/}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Busca mesas, lámparas, bancos…"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sugerencias: chips horizontales */}
      <View style={styles.chipsWrapper}>
        <FlatList
          data={SUGGESTIONS}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chip}
              onPress={() => setQuery(item)}
            >
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Zona de resultados vacía */}
      <View style={styles.results}>
        <Text style={styles.hint}>
          Escribe algo arriba o pulsa una sugerencia
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight, 
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    marginHorizontal: 16,
    marginTop: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clear: {
    fontSize: 18,
    color: '#999',
    padding: 4,
  },
  chipsWrapper: {
    marginTop: 16,
    height: 48,               
  },
  chipsContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#EFEFEF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,           
  },
  chipText: {
    color: '#555',
    fontSize: 14,
  },
  results: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    color: '#AAA',
    fontSize: 14,
  },
});

