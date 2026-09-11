import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import { useAudit } from '../../context/AuditContext';
import { CameraScanner } from '../../components/CameraScanner';
import { AudioRecorder } from '../../components/AudioRecorder';
import { Product } from '../../types/Product';

export default function ScannerScreen() {
  const { products, addAuditEntry } = useAudit();
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [audioUri, setAudioUri] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBarcodeScanned = (barcode: string) => {
    setIsScanning(false);
    const matched = products.find((p) => p.barcode === barcode);

    if (matched) {
      setScannedProduct(matched);
    } else {
      Alert.alert(
        'Código no encontrado',
        `El código ${barcode} no coincide con ninguna orden esperada.`,
        [{ text: 'Escanear de nuevo', onPress: () => setIsScanning(true) }]
      );
    }
  };

  const handleConfirmReceipt = async () => {
    if (!scannedProduct) return;
    setIsSubmitting(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let latitude = 13.6929;
      let longitude = -89.2182;

      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        latitude = currentLocation.coords.latitude;
        longitude = currentLocation.coords.longitude;
      }

      addAuditEntry({
        id: `REC-${Date.now()}`,
        productId: scannedProduct.id,
        productTitle: scannedProduct.title,
        timestamp: new Date().toISOString(),
        actionType: 'STOCK_RECEIPT',
        audioNoteUrl: audioUri,
        location: { latitude, longitude },
      });

      Alert.alert('Éxito', `Mercancía "${scannedProduct.title}" registrada con éxito.`);
      setScannedProduct(null);
      setAudioUri(undefined);
      setIsScanning(true);
    } catch {
      Alert.alert('Error', 'No se pudo guardar la recepción del paquete.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <CameraScanner onBarcodeScanned={handleBarcodeScanned} isScanning={isScanning} />

      {scannedProduct ? (
        <View style={styles.card}>
          <Text style={styles.tag}>ORDEN ENCONTRADA</Text>
          <View style={styles.productRow}>
            <Image source={{ uri: scannedProduct.imageUrl }} style={styles.productImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.productTitle}>{scannedProduct.title}</Text>
              <Text style={styles.productDetail}>Cód: {scannedProduct.barcode}</Text>
              <Text style={styles.productDetail}>Pendientes: {scannedProduct.expectedStock}</Text>
            </View>
          </View>

          <AudioRecorder onRecordingComplete={(uri) => setAudioUri(uri)} />

          <TouchableOpacity
            style={[styles.confirmBtn, isSubmitting && { opacity: 0.7 }]}
            onPress={handleConfirmReceipt}
            disabled={isSubmitting}
          >
            <Text style={styles.confirmBtnText}>
              {isSubmitting ? 'Registrando...' : 'Confirmar Entrada al Almacén'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => { setScannedProduct(null); setIsScanning(true); }}>
            <Text style={styles.cancelBtnText}>Cancelar / Escanear otro</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.idleMessage}>
          <Text style={styles.idleText}>Apunta la cámara a una etiqueta para validar la orden.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  card: { backgroundColor: '#fff', margin: 15, padding: 18, borderRadius: 14, elevation: 4 },
  tag: { backgroundColor: '#10B981', color: '#fff', fontWeight: 'bold', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontSize: 11, marginBottom: 10 },
  productRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  productImage: { width: 70, height: 70, borderRadius: 8 },
  productTitle: { fontSize: 16, fontWeight: 'bold', color: '#001f3f' },
  productDetail: { fontSize: 12, color: '#5a6a7e', marginTop: 2 },
  confirmBtn: { backgroundColor: '#003f7f', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cancelBtn: { paddingVertical: 10, alignItems: 'center', marginTop: 6 },
  cancelBtnText: { color: '#c0392b', fontSize: 13, fontWeight: '600' },
  idleMessage: { padding: 25, alignItems: 'center' },
  idleText: { color: '#5a6a7e', textAlign: 'center', fontSize: 14 }
});