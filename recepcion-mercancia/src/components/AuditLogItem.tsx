import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { MaterialIcons } from '@expo/vector-icons';
import { AuditEntry } from '../types/AuditEntry';

interface Props {
    entry: AuditEntry;
}

export function AuditLogItem({ entry }: Props) {
    // 1. Inicializamos el reproductor
    const player = useAudioPlayer(entry.audioNoteUrl ? { uri: entry.audioNoteUrl } : null);

    // 2. Escuchamos el estado reactivo para que la UI se actualice sola
    const status = useAudioPlayerStatus(player);

    // 3. Aseguramos que el bucle esté apagado en cuanto el reproductor esté listo
    useEffect(() => {
        if (player) {
            player.loop = false;
        }
    }, [player]);

    const toggleAudio = () => {
        if (!player) return;

        if (status.playing) {
            player.pause();
        } else {
            // Si el audio terminó (el tiempo actual alcanzó la duración total), regresamos al inicio
            if (status.currentTime >= status.duration && status.duration > 0) {
                player.seekTo(0);
            }
            player.play();
        }
    };

    const formatearFecha = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('es-ES', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.title} numberOfLines={1}>{entry.productTitle}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>RECIBIDO</Text>
                </View>
            </View>

            <Text style={styles.date}>🕒 {formatearFecha(entry.timestamp)}</Text>

            <View style={styles.gpsContainer}>
                <MaterialIcons name="gps-fixed" size={14} color="#5a6a7e" />
                <Text style={styles.gpsText}>
                    Lat: {entry.location.latitude.toFixed(5)}, Lng: {entry.location.longitude.toFixed(5)}
                </Text>
            </View>

            {entry.audioNoteUrl && (
                <TouchableOpacity
                    style={[styles.audioBtn, status.playing && styles.audioBtnPlaying]}
                    onPress={toggleAudio}
                >
                    <MaterialIcons
                        name={status.playing ? "stop-circle" : "play-circle-fill"}
                        size={20}
                        color={status.playing ? "#fff" : "#001f3f"}
                    />
                    <Text style={[styles.audioText, status.playing && styles.audioTextPlaying]}>
                        {status.playing ? 'Detener Observación' : 'Reproducir Observación'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#10B981', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    title: { fontSize: 15, fontWeight: 'bold', color: '#003f7f', flex: 1, marginRight: 8 },
    badge: { backgroundColor: '#e6f8f3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 10, fontWeight: 'bold', color: '#10B981' },
    date: { fontSize: 12, color: '#5a6a7e', marginBottom: 8 },
    gpsContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F6F9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 10 },
    gpsText: { fontSize: 11, color: '#5a6a7e', marginLeft: 4 },
    audioBtn: { backgroundColor: '#fdb913', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8, marginTop: 4 },
    audioBtnPlaying: { backgroundColor: '#c0392b' },
    audioText: { color: '#001f3f', fontWeight: 'bold', fontSize: 13, marginLeft: 6 },
    audioTextPlaying: { color: '#fff' }
});