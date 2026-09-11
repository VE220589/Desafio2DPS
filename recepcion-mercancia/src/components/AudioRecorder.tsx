import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AudioModule, RecordingPresets, useAudioRecorder, useAudioRecorderState } from 'expo-audio';

interface Props {
    onRecordingComplete: (uri: string | undefined) => void;
}

export function AudioRecorder({ onRecordingComplete }: Props) {
    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(recorder);

    const toggleRecording = async () => {
        if (!recorderState.isRecording) {
            const { granted } = await AudioModule.requestRecordingPermissionsAsync();
            if (!granted) {
                alert('Permiso de micrófono denegado');
                return;
            }
            await recorder.prepareToRecordAsync();
            recorder.record();
        } else {
            await recorder.stop();
            onRecordingComplete(recorder.uri ?? undefined);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nota de Voz / Observación de Carga</Text>
            <TouchableOpacity
                style={[styles.recordBtn, recorderState.isRecording ? styles.recording : styles.idle]}
                onPress={toggleRecording}
            >
                <Text style={styles.btnText}>
                    {recorderState.isRecording ? '⏹ Detener Grabación' : '🎙 Grabar Nota de Voz'}
                </Text>
            </TouchableOpacity>
            {recorderState.isRecording && (
                <Text style={styles.statusText}>Grabando audio para el reporte...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: 12, alignItems: 'center' },
    title: { fontSize: 13, color: '#5a6a7e', marginBottom: 8, fontWeight: '600' },
    recordBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 25, width: '100%', alignItems: 'center' },
    idle: { backgroundColor: '#fdb913' },
    recording: { backgroundColor: '#c0392b' },
    btnText: { color: '#001f3f', fontWeight: '800', fontSize: 14 },
    statusText: { color: '#c0392b', fontSize: 12, marginTop: 6, fontWeight: '600' }
});