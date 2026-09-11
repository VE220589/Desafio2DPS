import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuditProvider } from '../context/AuditContext';

export default function RootLayout() {
  return (
    <AuditProvider>
      <StatusBar style="light" backgroundColor="#003f7f" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuditProvider>
  );
}