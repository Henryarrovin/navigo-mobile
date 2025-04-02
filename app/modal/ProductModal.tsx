import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';
import { IProduct } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type RootTabParamList = {
  Home: undefined;
  Map: { 
    x: number;
    y: number;
    title: string;
  };
};

interface ProductModalProps {
  visible: boolean;
  product: IProduct | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ visible, product, onClose }) => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  if (!product) return null;

  const hasLocation = Boolean(
    product.location?.coordinates?.x && 
    product.location?.coordinates?.y
  );

  const handleViewOnMap = () => {
    if (!hasLocation) return;
    
    navigation.navigate('Map', {
      x: product.location.coordinates.x,
      y: product.location.coordinates.y,
      title: product.name
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Image 
            source={{ uri: product.image }} 
            style={styles.productImage}
            resizeMode="cover"
          />
          
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            
            {hasLocation && (
              <View style={styles.coordinateInfo}>
                <Text style={styles.coordinateTitle}>Location Coordinates</Text>
                <Text style={styles.coordinateText}>X: {product.location.coordinates.x}</Text>
                <Text style={styles.coordinateText}>Y: {product.location.coordinates.y}</Text>
                <Text style={styles.coordinateText}>Zone: {product.location.zone}</Text>
              </View>
            )}
            
            {!hasLocation && (
              <Text style={styles.locationUnavailable}>
                Location not available
              </Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.locationButton,
              !hasLocation && styles.disabledButton
            ]}
            onPress={handleViewOnMap}
            disabled={!hasLocation}
          >
            <Text style={styles.locationButtonText}>
              {hasLocation ? 'View on Map' : 'No Location Data'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productDetails: {
    padding: 20,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 20,
    color: '#007bff',
    fontWeight: '600',
    marginBottom: 15,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: '#007bff',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  locationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationUnavailable: {
    color: '#ff4444',
    fontStyle: 'italic',
    marginTop: 5,
  },
  coordinateInfo: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    marginTop: 15,
  },
  coordinateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0288d1',
    marginBottom: 5,
  },
  coordinateText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
});

export default ProductModal;
