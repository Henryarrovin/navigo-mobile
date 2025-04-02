import React from "react";
import { 
  ActivityIndicator, 
  FlatList, 
  StyleSheet, 
  Text, 
  View 
} from "react-native";
import useProductsByCategory from "../hooks/UseProductsByCategory";
import ProductCard from "../components/home/ProductCard";
import { useLocalSearchParams } from "expo-router";
import { IProduct } from "../types/types";
import ProductModal from "../modal/ProductModal";

const CategoryScreen = () => {
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();
  
  const { 
    products, 
    loading, 
    error 
  } = useProductsByCategory(categoryId as string);
  
  const [selectedProduct, setSelectedProduct] = React.useState<IProduct | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleProductPress = (product: IProduct) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  if (loading && !products.length) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.categoryTitle}>{categoryName}</Text> */}
      
      {products.length === 0 ? (
        <Text style={styles.noProductsText}>
          No products available in this category.
        </Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              onPress={() => handleProductPress(item)} 
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
        />
      )}

      <ProductModal
        visible={Boolean(selectedProduct)}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default CategoryScreen;
