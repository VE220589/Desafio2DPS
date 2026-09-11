import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

interface Props {
    onBarcodeScanned: (data: string) => void;
    isScanning: boolean;
}

export function CameraScanner({ onBarcodeScanned, isScanning }: Props) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View style={styles.center}><Text>Cargando permisos...</Text></View>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Se requiere acceso a la cámara para escanear paquetes en andén.</Text>
                <Button onPress={requestPermission} title="Conceder Permiso" color="#003f7f" />
            </View>
        );
    }

    const handleBarCodeScanned = (result: BarcodeScanningResult) => {
        if (isScanning) {
            onBarcodeScanned(result.data);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'upc_a'],
                }}
                onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanTarget} />
                    <Text style={styles.scanHint}>Alinea el código de barras dentro del recuadro</Text>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.flipBtn}
                        onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                    >
                        <Text style={styles.flipText}>Rotar Cámara</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { height: 320, borderRadius: 16, overflow: 'hidden', marginHorizontal: 15, marginVertical: 10 },
    center: { height: 320, justifyContent: 'center', alignItems: 'center' },
    camera: { flex: 1 },
    permissionContainer: { height: 220, backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 3 },
    permissionText: { textAlign: 'center', color: '#5a6a7e', marginBottom: 15, fontSize: 14 },
    overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    scanTarget: { width: 220, height: 140, borderWidth: 2, borderColor: '#10B981', borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.08)' },
    scanHint: { color: '#fff', marginTop: 10, fontSize: 12, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    controls: { position: 'absolute', bottom: 12, width: '100%', alignItems: 'center' },
    flipBtn: { backgroundColor: 'rgba(0, 63, 127, 0.85)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    flipText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});