import React, { useEffect } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  ScrollView,
  RefreshControl
} from 'react-native';
import ProductCard from '../components/home/ProductCard';
import useProductsAndCategories from '../hooks/useProductsAndCategories';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../features/productsSlice';
import { AppDispatch } from '../features/store';
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();
  const router = useRouter();
  
  const {
    products,
    categories,
    productsLoading,
    categoriesLoading,
    productsError,
    categoriesError,
    pagination,
  } = useProductsAndCategories();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (isFocused) {
      loadProducts();
    }
  }, [isFocused, pagination.page]);

  const loadProducts = () => {
    dispatch(fetchProducts({ 
      page: pagination.page, 
      limit: pagination.limit 
    }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchProducts({ page: 1, limit: pagination.limit }))
      .finally(() => setRefreshing(false));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      dispatch(fetchProducts({ page, limit: pagination.limit }));
    }
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    router.push({ 
      pathname: `/category/[categoryId]`, 
      params: { categoryId, categoryName } 
    });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    const maxVisiblePages = 5;

    // show first page
    if (totalPages > 1) {
      pages.push(
        <TouchableOpacity
          key={1}
          style={[
            styles.pageButton,
            currentPage === 1 && styles.activePageButton
          ]}
          onPress={() => handlePageChange(1)}
        >
          <Text style={[
            styles.pageButtonText,
            currentPage === 1 && styles.activePageButtonText
          ]}>
            1
          </Text>
        </TouchableOpacity>
      );
    }

    // Show ellipsis if current page is far from start
    if (currentPage > 3 && totalPages > maxVisiblePages) {
      pages.push(
        <Text key="left-ellipsis" style={styles.pageEllipsis}>...</Text>
      );
    }

    // Calculate middle pages
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if we're near the start or end
    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 3, 2);
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            currentPage === i && styles.activePageButton
          ]}
          onPress={() => handlePageChange(i)}
        >
          <Text style={[
            styles.pageButtonText,
            currentPage === i && styles.activePageButtonText
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    // Show ellipsis if current page is far from end
    if (currentPage < totalPages - 2 && totalPages > maxVisiblePages) {
      pages.push(
        <Text key="right-ellipsis" style={styles.pageEllipsis}>...</Text>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(
        <TouchableOpacity
          key={totalPages}
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.activePageButton
          ]}
          onPress={() => handlePageChange(totalPages)}
        >
          <Text style={[
            styles.pageButtonText,
            currentPage === totalPages && styles.activePageButtonText
          ]}>
            {totalPages}
          </Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  if ((productsLoading && products.length === 0) || categoriesLoading) {
    return (
      <View style={styles.fullScreenLoader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (productsError || categoriesError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {productsError || categoriesError || 'Error loading data'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchProducts({ page: 1, limit: pagination.limit }))}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ProductCard product={item} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListFooterComponent={
          <>
            {products.length > 0 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[styles.pageButton, !pagination.hasPrevPage && styles.disabledButton]}
                  onPress={() => handlePageChange(1)}
                  disabled={!pagination.hasPrevPage}
                >
                  <Text style={styles.pageButtonText}>«</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.pageButton, !pagination.hasPrevPage && styles.disabledButton]}
                  onPress={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  <Text style={styles.pageButtonText}>‹</Text>
                </TouchableOpacity>

                {renderPageNumbers()}
                
                <TouchableOpacity
                  style={[styles.pageButton, !pagination.hasNextPage && styles.disabledButton]}
                  onPress={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  <Text style={styles.pageButtonText}>›</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.pageButton, !pagination.hasNextPage && styles.disabledButton]}
                  onPress={() => handlePageChange(pagination.totalPages)}
                  disabled={!pagination.hasNextPage}
                >
                  <Text style={styles.pageButtonText}>»</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category._id}
                    style={styles.categoryCard}
                    onPress={() => handleCategoryClick(category._id, category.name)}
                  >
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {productsLoading && products.length > 0 && (
              <ActivityIndicator size="small" color="#0000ff" style={styles.loadMoreIndicator} />
            )}
          </>
        }
        ListEmptyComponent={
          !productsLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.noProductsText}>No products found</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={onRefresh}
              >
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        contentContainerStyle={[
          styles.listContent,
          products.length === 0 && styles.emptyListContent
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4D4D4',
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 5,
    flexWrap: 'wrap',
  },
  pageButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activePageButton: {
    backgroundColor: '#007bff',
  },
  pageButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activePageButtonText: {
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageEllipsis: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    color: '#333',
  },
  categoriesSection: {
    marginTop: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryCard: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProductsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  refreshText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadMoreIndicator: {
    marginVertical: 16,
  },
});

export default HomeScreen;
