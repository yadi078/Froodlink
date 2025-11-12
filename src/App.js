// Configuración principal de la app
// Aquí definimos las pantallas y la navegación

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './screens/AuthScreen';
import MenuScreen from './screens/MenuScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f5f5f5' }
        }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'Autenticación' }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: 'Mis Platillos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

