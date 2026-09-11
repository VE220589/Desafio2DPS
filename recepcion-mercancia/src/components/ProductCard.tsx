import { View, Text, Image, StyleSheet } from 'react-native';
import { Product } from '../types/Product';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.subtitle}>Cód: {product.barcode} | {product.category}</Text>
        
        <View style={styles.stockContainer}>
          <Text style={styles.stockText}>
            Esperados: <Text style={{ fontWeight: 'bold', color: product.expectedStock > 0 ? '#fdb913' : '#10B981' }}>
              {product.expectedStock}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 15,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 110,
    height: 110,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#003f7f',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  stockContainer: {
    marginTop: 10,
    backgroundColor: '#F4F6F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 12,
    color: '#003f7f',
  }
});