import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ManufacturerScreen() {
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const manufacturersRef = ref(db, 'manufacturers/products');
    const unsubscribe = onValue(manufacturersRef, (snapshot) => {
      const data = snapshot.val();
      setManufacturers(data ? Object.values(data) : []);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const categoriesRef = ref(db, 'manufacturers/categories');
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      setCategories(data ? Object.values(data) : []);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const bannersRef = ref(db, 'manufacturers/banners');
    const unsubscribe = onValue(bannersRef, (snapshot) => {
      const data = snapshot.val();
      setBanners(data ? Object.values(data) : []);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (banners.length === 0) return;
      const nextIndex = (currentIndex + 1) % banners.length;
      setCurrentIndex(nextIndex);
      if (carouselRef.current) {
        carouselRef.current.scrollTo({ x: width * nextIndex, animated: true });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, banners]);

  const filteredManufacturers = manufacturers.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const openWhatsApp = (number) => {
    const url = `https://wa.me/${number}`;
    Linking.openURL(url);
  };

  const makeCall = (number) => {
    const url = `tel:${number}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search for manufacturers"
          value={search}
          onChangeText={setSearch}
        />

        {/* Banner Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          ref={carouselRef}
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / width);
            setCurrentIndex(index);
          }}
        >
          {banners.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: currentIndex === index ? '#007bff' : '#ccc' },
              ]}
            />
          ))}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
          style={styles.categoriesContainer}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryItem}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('ManufacturerList', { category: item.title })
              }
            >
              <View style={styles.iconWrapper}>
                <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
              </View>
              <Text style={styles.categoryText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Manufacturers */}
        <Text style={styles.sectionTitle}>Popular Manufacturers</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <View style={styles.productList}>
            {filteredManufacturers.length > 0 ? (
              filteredManufacturers.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.category}>{item.category}</Text>

                    {/* Rating */}
                    {item.rating && (
                      <View style={styles.ratingRow}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < item.rating ? 'star' : 'star-outline'}
                            size={16}
                            color="#f5a623"
                          />
                        ))}
                      </View>
                    )}

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => openWhatsApp(item.phone)}
                      >
                        <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                        <Text style={styles.btnText}>WhatsApp</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => makeCall(item.phone)}
                      >
                        <Ionicons name="call-outline" size={18} color="#007bff" />
                        <Text style={styles.btnText}>Call</Text>
                      </TouchableOpacity>
                    </View>

                    {/* View Details */}
                    <TouchableOpacity
                      style={styles.detailsBtn}
                      onPress={() => navigation.navigate('ManufacturerDetails', { item })}
                    >
                      <Text style={styles.detailsText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ padding: 10, color: '#999' }}>No manufacturers found.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchInput: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  carousel: { height: 180 },
  bannerImage: { width: width, height: 180 },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  categoriesContainer: { marginVertical: 11 },
  categoriesScroll: { paddingHorizontal: 9 },
  categoryItem: {
    alignItems: 'center',
    width: 70,
    marginRight: 9,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    elevation: 4,
  },
  categoryIcon: { width: 40, height: 40, borderRadius: 20 },
  categoryText: { fontSize: 12, textAlign: 'center', color: '#333' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#333',
  },
  productList: { paddingHorizontal: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  name: { fontSize: 16, fontWeight: '600' },
  category: { fontSize: 14, color: '#666', marginTop: 2 },
  ratingRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9e9e9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  btnText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#333',
  },
  detailsBtn: {
    marginTop: 8,
    paddingVertical: 6,
    backgroundColor: '#007bff',
    borderRadius: 6,
    alignItems: 'center',
    width: 120,
  },
  detailsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
