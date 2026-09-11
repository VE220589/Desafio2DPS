import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAudit } from '../../context/AuditContext';
import { AuditEntry } from '../../types/AuditEntry';
import { MaterialIcons } from '@expo/vector-icons';

const INITIAL_REGION = {
  latitude: 13.6929,
  longitude: -89.2182,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const { auditLogs } = useAudit();
  const mapRef = useRef<MapView>(null);
  const [selectedLog, setSelectedLog] = useState<AuditEntry | null>(null);

  // Efecto para animar el mapa hacia el último punto y seleccionarlo por defecto
  useEffect(() => {
    if (auditLogs.length > 0 && mapRef.current) {
      const latestLog = auditLogs[0];
      setSelectedLog(latestLog);
      mapRef.current.animateToRegion({
        latitude: latestLog.location.latitude,
        longitude: latestLog.location.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 1000);
    }
  }, [auditLogs]);

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={() => setSelectedLog(null)} // Oculta la tarjeta si se toca el fondo del mapa
      >
        {auditLogs.map((log) => (
          <Marker
            key={log.id}
            coordinate={{
              latitude: log.location.latitude,
              longitude: log.location.longitude,
            }}
            pinColor="#10B981" 
            onPress={(e) => {
              e.stopPropagation(); // Evita que el evento se propague al mapa
              setSelectedLog(log);
            }}
          />
        ))}
      </MapView>

      {/* Indicador superior con el total de ubicaciones */}
      <View style={styles.overlayCounter}>
        <Text style={styles.overlayText}>
          {auditLogs.length} {auditLogs.length === 1 ? 'Ubicación registrada' : 'Ubicaciones registradas'}
        </Text>
      </View>

      {/* Tarjeta de información flotante inferior */}
      {selectedLog && (
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{selectedLog.productTitle}</Text>
            <TouchableOpacity onPress={() => setSelectedLog(null)}>
              <MaterialIcons name="close" size={20} color="#5a6a7e" />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardText}>
            🕒 Recibido: {new Date(selectedLog.timestamp).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.cardText}>
            📍 Lat: {selectedLog.location.latitude.toFixed(5)}, Lng: {selectedLog.location.longitude.toFixed(5)}
          </Text>
          {selectedLog.audioNoteUrl && (
            <Text style={styles.cardAudio}>🎙️ Nota de voz adjunta en bitácora</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  map: { flex: 1 },
  overlayCounter: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 63, 127, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  overlayText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  infoCard: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#003f7f', flex: 1, marginRight: 8 },
  cardText: { fontSize: 13, color: '#5a6a7e', marginTop: 3 },
  cardAudio: { fontSize: 12, color: '#10B981', fontWeight: '600', marginTop: 8 },
});