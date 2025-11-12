// Punto de entrada de la aplicación

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './package.json';

// Registramos la app en React Native
AppRegistry.registerComponent(appName, () => App);

