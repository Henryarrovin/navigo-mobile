import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import useProductsByCategory from "../hooks/UseProductsByCategory";
import ProductCard from "../components/home/ProductCard";
import { useLocalSearchParams } from "expo-router/build/hooks";

const CategoryScreen = () => {
  //   const { categoryId, categoryName }: any = route.params;
  const { categoryId, categoryName }: any = useLocalSearchParams();
  const { products, loading, error } = useProductsByCategory(categoryId);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.categoryTitle}>{categoryName}</Text> */}
        {error ? (
            <Text style={styles.errorText}>{error}</Text>
        ) : products.length === 0 ? (
            <Text style={styles.noObjectsText}>No products available in this category.</Text>
        ) : (
            <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <ProductCard product={item} />}
            numColumns={2}
            columnWrapperStyle={styles.row}
            />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  noObjectsText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CategoryScreen;
