import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase/firebase';
import { ref, onValue } from 'firebase/database';

const windowWidth = Dimensions.get('window').width;

export default function ServiceHomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from Firebase
    const catRef = ref(db, 'serviceCategories');
    const unsubscribeCat = onValue(catRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        setCategories(parsed);
      }
    });

    // Fetch services from Firebase
    const servicesRef = ref(db, 'services');
    const unsubscribeServices = onValue(servicesRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        setServices(parsed);
      }
    });

    return () => {
      unsubscribeCat();
      unsubscribeServices();
    };
  }, []);

  const handleCategoryPress = (category) => {
    navigation.navigate('ServiceListScreen', { category });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for services"
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons name="mic-outline" size={20} color="#007bff" />
      </View>

      {/* Categories Grid */}
      <View style={styles.categoryGrid}>
        {categories.map((item, index) => (
          <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategoryPress(item.name)}>
            <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Banner */}
      <Image
        source={{ uri: 'https://example.com/banner.jpg' }} // Replace with your own banner URL
        style={styles.banner}
      />

      {/* Quick Access Apps */}
      <View style={styles.quickLinks}>
        {['https://example.com/jiomart.png', 'https://example.com/ajio.png', 'https://example.com/tira.png'].map((icon, i) => (
          <Image key={i} source={{ uri: icon }} style={styles.quickIcon} />
        ))}
      </View>

      {/* Horizontal Services List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <FlatList
          data={services.slice(0, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.serviceCard}>
              <Image source={{ uri: item.image }} style={styles.serviceImage} />
              <Text numberOfLines={1} style={styles.serviceName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
  },
  banner: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  quickIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceCard: {
    width: 100,
    marginRight: 10,
    alignItems: 'center',
  },
  serviceImage: {
    width: 100,
    height: 70,
    borderRadius: 10,
    marginBottom: 5,
  },
  serviceName: {
    fontSize: 12,
    textAlign: 'center',
  },
});
