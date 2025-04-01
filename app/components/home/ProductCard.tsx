import { IProduct } from '@/app/types/types';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  if (!product || !product.name || !product.category) {
    console.error("Invalid product data:", product);
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {product.image && (
          <Image source={{ uri: product.image }} style={styles.image} />
        )}
        <Text style={styles.title}>{product.name}</Text>
        {/* category name */}
        {/* <Text style={styles.category}>Category: {categoryName}</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    margin: 8,
    width: '45%',
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#555',
  },
});

export default ProductCard;
