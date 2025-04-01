import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProductCard from "../components/home/ProductCard";
import { useEffect } from "react";
import useProductsAndCategories from "../hooks/useProductsAndCategories";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../features/productsSlice";
import { AppDispatch } from "../features/store";
import { useIsFocused } from "@react-navigation/native";

const HomeScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isFocused = useIsFocused(); 
    const {
      products,
      categories,
      productsLoading,
      categoriesLoading,
      productsError,
      categoriesError,
    } = useProductsAndCategories();

    useEffect(() => {
      // Refetch products when the screen is focused
      if (isFocused) {
        dispatch(fetchProducts());
      }
    }, [dispatch, isFocused]);

    // const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const router = useRouter();

    if (productsLoading || categoriesLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
  
    if (productsError || categoriesError) {
      return <Text>Error loading data.</Text>;
    }

    const handleCategoryClick = (categoryId: string, categoryName: string) => {
      // navigation.navigate('CategoryScreen', { categoryId, categoryName });
      router.push({ 
        pathname: `/category/[categoryId]`, 
        params: { categoryId, categoryName } 
      });
    };

    return (
      <View style={styles.container}>
      {products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <Text style={styles.noObjectsText}>No objects available.</Text>
      )}

      <View style={styles.carouselContainer}>
        <Text style={styles.carouselTitle}>Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => handleCategoryClick(item._id, item.name)}
            >
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center'
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  noObjectsText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  carouselContainer: {
    marginTop: 20,
    width: '100%',
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
