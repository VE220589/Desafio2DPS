import { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useAudit } from '../../context/AuditContext';
import { ProductCard } from '../../components/ProductCard';
import { SearchBar } from '../../components/SearchBar';

export default function OrdenesScreen() {
  // Consumimos los productos desde nuestro estado global
  const { products } = useAudit();
  
  // Estado para el buscador
  const [search, setSearch] = useState("");

  // Filtramos los productos en tiempo real dependiendo de lo que el usuario escriba
  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.barcode.includes(search)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Órdenes de Recepción</Text>
         <Text style={styles.headerSubtitle}>Valida la mercancía esperada en andén</Text>
      </View>

      <SearchBar value={search} onChange={setSearch} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay productos que coincidan con la búsqueda.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F6F9' 
  },
  header: { 
    backgroundColor: '#003f7f', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  headerSubtitle: { 
    color: '#A0AEC0', 
    fontSize: 14, 
    marginTop: 4 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 40, 
    color: '#6B7280', 
    fontSize: 15 
  }
});