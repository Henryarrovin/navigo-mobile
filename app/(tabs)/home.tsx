import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import ProductCard from "../components/home/ProductCard";
import { useContext } from "react";
import useProductsAndCategories from "../hooks/useProductsAndCategories";

const HomeScreen = () => {
    const {
      products,
      categories,
      productsLoading,
      categoriesLoading,
      productsError,
      categoriesError,
    } = useProductsAndCategories();

    if (productsLoading || categoriesLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
  
    if (productsError || categoriesError) {
      return <Text>Error loading data.</Text>;
    }

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
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
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
});

export default HomeScreen;
