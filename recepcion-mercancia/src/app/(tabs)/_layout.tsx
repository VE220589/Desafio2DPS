import { Tabs } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#10B981', 
      tabBarInactiveTintColor: '#A0AEC0', 
      tabBarStyle: { backgroundColor: '#003f7f', paddingBottom: 5, height: 60 }, 
      headerStyle: { backgroundColor: '#003f7f' },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Órdenes',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="list-alt" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Escanear',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="qr-code-scanner" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="audit-log"
        options={{
          title: 'Bitácora',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="history" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="map-marked-alt" size={size} color={color} />
        }}
      />
    </Tabs>
  );
}