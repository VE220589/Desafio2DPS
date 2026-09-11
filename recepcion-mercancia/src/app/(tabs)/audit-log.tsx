import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAudit } from '../../context/AuditContext';
import { AuditLogItem } from '../../components/AuditLogItem';

export default function AuditLogScreen() {
  const { auditLogs } = useAudit();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bitácora de Recepción</Text>
        <Text style={styles.headerSubtitle}>
          {auditLogs.length} {auditLogs.length === 1 ? 'registro' : 'registros'} en el historial
        </Text>
      </View>

      <FlatList
        data={auditLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
        renderItem={({ item }) => <AuditLogItem entry={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay recepciones registradas.</Text>
            <Text style={styles.emptySubtext}>Los productos escaneados aparecerán aquí.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  header: { backgroundColor: '#003f7f', paddingHorizontal: 20, paddingVertical: 15, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: '#A0AEC0', fontSize: 14, marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: '#5a6a7e' },
  emptySubtext: { fontSize: 13, color: '#A0AEC0', marginTop: 8 }
});