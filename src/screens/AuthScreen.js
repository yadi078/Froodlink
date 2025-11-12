// Pantalla de autenticación para vendedores
// Aquí los usuarios pueden registrarse o iniciar sesión

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { registrarUsuario, iniciarSesion } from '../services/firebase';
import {
  validarFormularioLogin,
  validarFormularioRegistro,
  sanitizarTexto
} from '../utils/validators';

const AuthScreen = ({ navigation }) => {
  // Estado para saber si estamos en modo registro o login
  const [esRegistro, setEsRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Mensajes de error para cada campo
  const [errores, setErrores] = useState({});

  // Actualizar los valores cuando el usuario escribe
  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Si el usuario empieza a corregir, quitamos el error
    if (errores[campo]) {
      setErrores(prev => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[campo];
        return nuevosErrores;
      });
    }
  };

  // Función para iniciar sesión
  const handleLogin = async () => {
    try {
      // Primero validamos que los datos estén bien
      const validacion = validarFormularioLogin({
        email: formData.email,
        password: formData.password
      });

      if (!validacion.valido) {
        setErrores(validacion.errores);
        Alert.alert('Error de Validación', validacion.mensaje);
        return;
      }

      setCargando(true);

      // Intentamos iniciar sesión con Firebase
      const resultado = await iniciarSesion(
        sanitizarTexto(formData.email),
        formData.password
      );

      if (resultado.success) {
        // Si todo salió bien, vamos a la pantalla de menús
        Alert.alert(
          'Bienvenido',
          `Hola ${resultado.user.nombre}!`,
          [
            {
              text: 'Continuar',
              onPress: () => navigation.replace('Menu')
            }
          ]
        );
      } else {
        // Si hubo un error, lo mostramos
        Alert.alert('Error de Acceso', resultado.error);
      }
    } catch (error) {
      // Si ocurre algo inesperado
      console.error('Error en login:', error);
      Alert.alert(
        'Error',
        'Ocurrió un error inesperado. Por favor intenta nuevamente.'
      );
    } finally {
      setCargando(false);
    }
  };

  // Función para registrar un nuevo vendedor
  const handleRegistro = async () => {
    try {
      // Validar formulario completo
      const validacion = validarFormularioRegistro({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (!validacion.valido) {
        setErrores(validacion.errores);
        Alert.alert('Error de Validación', validacion.mensaje);
        return;
      }

      setCargando(true);

      // Intentamos crear la cuenta
      const resultado = await registrarUsuario(
        sanitizarTexto(formData.email),
        formData.password,
        sanitizarTexto(formData.nombre)
      );

      if (resultado.success) {
        // Si se registró correctamente
        Alert.alert(
          'Registro Exitoso',
          `¡Bienvenido a FoodLink, ${resultado.user.nombre}!`,
          [
            {
              text: 'Comenzar',
              onPress: () => navigation.replace('Menu')
            }
          ]
        );
      } else {
        // Mostrar error amigable
        Alert.alert('Error de Registro', resultado.error);
      }
    } catch (error) {
      // Error inesperado
      console.error('Error en registro:', error);
      Alert.alert(
        'Error',
        'Ocurrió un error al crear tu cuenta. Por favor intenta nuevamente.'
      );
    } finally {
      setCargando(false);
    }
  };

  // Cambiar entre pantalla de login y registro
  const toggleModo = () => {
    setEsRegistro(!esRegistro);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrores({});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🍽️ FoodLink</Text>
          <Text style={styles.subtitle}>
            {esRegistro ? 'Registra tu Negocio' : 'Panel de Vendedor'}
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          {/* Campo Nombre (solo en Registro) */}
          {esRegistro && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput
                style={[styles.input, errores.nombre && styles.inputError]}
                placeholder="Tu nombre"
                value={formData.nombre}
                onChangeText={(text) => handleInputChange('nombre', text)}
                autoCapitalize="words"
                editable={!cargando}
              />
              {errores.nombre && (
                <Text style={styles.errorText}>{errores.nombre}</Text>
              )}
            </View>
          )}

          {/* Campo Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={[styles.input, errores.email && styles.inputError]}
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!cargando}
            />
            {errores.email && (
              <Text style={styles.errorText}>{errores.email}</Text>
            )}
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={[styles.input, errores.password && styles.inputError]}
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry
              autoCapitalize="none"
              editable={!cargando}
            />
            {errores.password && (
              <Text style={styles.errorText}>{errores.password}</Text>
            )}
          </View>

          {/* Campo Confirmar Contraseña (solo en Registro) */}
          {esRegistro && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Contraseña</Text>
              <TextInput
                style={[
                  styles.input,
                  errores.confirmPassword && styles.inputError
                ]}
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  handleInputChange('confirmPassword', text)
                }
                secureTextEntry
                autoCapitalize="none"
                editable={!cargando}
              />
              {errores.confirmPassword && (
                <Text style={styles.errorText}>{errores.confirmPassword}</Text>
              )}
            </View>
          )}

          {/* Botón Principal */}
          <TouchableOpacity
            style={[styles.button, cargando && styles.buttonDisabled]}
            onPress={esRegistro ? handleRegistro : handleLogin}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {esRegistro ? 'Registrarse' : 'Iniciar Sesión'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle entre Login/Registro */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleModo}
            disabled={cargando}
          >
            <Text style={styles.toggleText}>
              {esRegistro
                ? '¿Ya tienes cuenta? Inicia Sesión'
                : '¿No tienes cuenta? Regístrate'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Información de Seguridad */}
        <View style={styles.securityInfo}>
          <Text style={styles.securityText}>
            🔒 Tu información está protegida con cifrado HTTPS
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500'
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333'
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5'
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500'
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  buttonDisabled: {
    backgroundColor: '#ffab91',
    shadowOpacity: 0.1
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center'
  },
  toggleText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600'
  },
  securityInfo: {
    marginTop: 24,
    alignItems: 'center'
  },
  securityText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center'
  }
});

export default AuthScreen;

