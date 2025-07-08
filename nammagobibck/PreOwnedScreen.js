import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const products = [
  {
    id: '1',
    name: 'Smartphone',
    price: '₹19,999',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'Laptop',
    price: '₹49,999',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: 'Wireless Earbuds',
    price: '₹2,999',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '4',
    name: 'Smartwatch',
    price: '₹5,499',
    image: 'https://via.placeholder.com/150',
  },
];

const numColumns = 2;
const { width } = Dimensions.get('window');
const itemWidth = (width - 30) / numColumns;

export default function RetailScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Buy or Sell Products</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 10,
    color: '#007bff',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    margin: 5,
    width: itemWidth,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: itemWidth - 30,
    height: itemWidth - 30,
    borderRadius: 8,
  },
  name: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  price: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 4,
  },
});
