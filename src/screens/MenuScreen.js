// Pantalla principal para gestionar el menú de platillos
// Los vendedores pueden agregar, editar, ver y eliminar sus platillos aquí

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  RefreshControl
} from 'react-native';
import {
  crearPlatillo,
  obtenerMisPlatillos,
  actualizarPlatillo,
  eliminarPlatillo,
  cerrarSesion,
  obtenerUsuarioActual
} from '../services/firebase';
import {
  validarFormularioPlatillo,
  sanitizarTexto
} from '../utils/validators';

const MenuScreen = ({ navigation }) => {
  // Lista de platillos y estados de la pantalla
  const [platillos, setPlatillos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [platilloEditando, setPlatilloEditando] = useState(null);

  // Datos del formulario de platillos
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'General',
    disponible: true
  });

  // Errores del formulario
  const [errores, setErrores] = useState({});

  // Datos del vendedor actual
  const [usuario, setUsuario] = useState(null);

  // Cargar los datos cuando se abre la pantalla
  useEffect(() => {
    cargarDatos();
  }, []);

  // Cargar información del usuario y sus platillos
  const cargarDatos = async () => {
    try {
      const user = obtenerUsuarioActual();
      // Verificamos que haya un usuario conectado
      if (!user) {
        Alert.alert('Sesión Expirada', 'Por favor inicia sesión nuevamente.', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Auth')
          }
        ]);
        return;
      }

      setUsuario(user);
      await cargarPlatillos();
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos.');
    } finally {
      setCargando(false);
    }
  };

  // Obtener los platillos del vendedor desde Firebase
  const cargarPlatillos = async () => {
    try {
      const resultado = await obtenerMisPlatillos();
      if (resultado.success) {
        setPlatillos(resultado.platillos);
      } else {
        Alert.alert('Error', resultado.error);
      }
    } catch (error) {
      console.error('Error al cargar platillos:', error);
      Alert.alert('Error', 'No se pudieron cargar los platillos.');
    }
  };

  // Refrescar la lista cuando el usuario desliza hacia abajo
  const handleRefresh = async () => {
    setRefrescando(true);
    await cargarPlatillos();
    setRefrescando(false);
  };

  // Actualizar los datos cuando el usuario escribe en el formulario
  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));

    // Limpiar error del campo
    if (errores[campo]) {
      setErrores(prev => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[campo];
        return nuevosErrores;
      });
    }
  };

  // Abrir el formulario para crear un nuevo platillo
  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setPlatilloEditando(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: 'General',
      disponible: true
    });
    setErrores({});
    setModalVisible(true);
  };

  // Abrir el formulario con los datos del platillo a editar
  const abrirModalEditar = (platillo) => {
    setModoEdicion(true);
    setPlatilloEditando(platillo);
    setFormData({
      nombre: platillo.nombre,
      descripcion: platillo.descripcion,
      precio: platillo.precio.toString(),
      categoria: platillo.categoria || 'General',
      disponible: platillo.disponible !== undefined ? platillo.disponible : true
    });
    setErrores({});
    setModalVisible(true);
  };

  // Guardar el platillo (crear nuevo o actualizar existente)
  const guardarPlatillo = async () => {
    try {
      // Primero validamos los datos
      const validacion = validarFormularioPlatillo({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio
      });

      if (!validacion.valido) {
        setErrores(validacion.errores);
        Alert.alert('Error de Validación', validacion.mensaje);
        return;
      }

      setCargando(true);

      // Limpiamos y preparamos los datos
      const datosLimpios = {
        nombre: sanitizarTexto(formData.nombre),
        descripcion: sanitizarTexto(formData.descripcion),
        precio: parseFloat(formData.precio),
        categoria: sanitizarTexto(formData.categoria),
        disponible: formData.disponible
      };

      let resultado;
      if (modoEdicion && platilloEditando) {
        // Si estamos editando, actualizamos
        resultado = await actualizarPlatillo(platilloEditando.id, datosLimpios);
      } else {
        // Si es nuevo, lo creamos
        resultado = await crearPlatillo(datosLimpios);
      }

      if (resultado.success) {
        Alert.alert(
          'Éxito',
          modoEdicion
            ? 'Platillo actualizado correctamente'
            : 'Platillo agregado correctamente'
        );
        setModalVisible(false);
        await cargarPlatillos();
      } else {
        Alert.alert('Error', resultado.error);
      }
    } catch (error) {
      console.error('Error al guardar platillo:', error);
      Alert.alert('Error', 'No se pudo guardar el platillo. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  // Mostrar confirmación antes de eliminar
  const confirmarEliminar = (platillo) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de eliminar "${platillo.nombre}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleEliminar(platillo.id)
        }
      ]
    );
  };

  // Eliminar el platillo de Firebase
  const handleEliminar = async (platilloId) => {
    try {
      setCargando(true);
      const resultado = await eliminarPlatillo(platilloId);

      if (resultado.success) {
        Alert.alert('Éxito', 'Platillo eliminado correctamente');
        await cargarPlatillos();
      } else {
        Alert.alert('Error', resultado.error);
      }
    } catch (error) {
      console.error('Error al eliminar platillo:', error);
      Alert.alert('Error', 'No se pudo eliminar el platillo.');
    } finally {
      setCargando(false);
    }
  };

  // Cerrar sesión y volver al login
  const handleCerrarSesion = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de cerrar sesión?', [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          const resultado = await cerrarSesion();
          if (resultado.success) {
            navigation.replace('Auth');
          }
        }
      }
    ]);
  };

  // Cómo se ve cada platillo en la lista
  const renderPlatillo = ({ item }) => (
    <View style={styles.platilloCard}>
      <View style={styles.platilloInfo}>
        <Text style={styles.platilloNombre}>{item.nombre}</Text>
        <Text style={styles.platilloDescripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>
        <View style={styles.platilloFooter}>
          <Text style={styles.platilloPrecio}>${item.precio.toFixed(2)}</Text>
          <Text
            style={[
              styles.platilloEstado,
              item.disponible ? styles.disponible : styles.noDisponible
            ]}
          >
            {item.disponible ? '● Disponible' : '● No disponible'}
          </Text>
        </View>
      </View>
      <View style={styles.platilloAcciones}>
        <TouchableOpacity
          style={styles.botonEditar}
          onPress={() => abrirModalEditar(item)}
        >
          <Text style={styles.botonTexto}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botonEliminar}
          onPress={() => confirmarEliminar(item)}
        >
          <Text style={styles.botonTexto}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cargando && !refrescando) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.cargandoText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mis Platillos</Text>
          <Text style={styles.headerSubtitle}>
            {usuario?.email || 'Vendedor'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleCerrarSesion}
        >
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Platillos */}
      <FlatList
        data={platillos}
        renderItem={renderPlatillo}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={handleRefresh}
            colors={['#FF6B35']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              📝 Aún no tienes platillos registrados
            </Text>
            <Text style={styles.emptySubtext}>
              Presiona el botón "+" para agregar tu primer platillo
            </Text>
          </View>
        }
      />

      {/* Botón Flotante para Agregar */}
      <TouchableOpacity style={styles.fab} onPress={abrirModalNuevo}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal para Agregar/Editar Platillo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {/* Header del Modal */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {modoEdicion ? 'Editar Platillo' : 'Nuevo Platillo'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Formulario */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nombre del Platillo *</Text>
                <TextInput
                  style={[styles.input, errores.nombre && styles.inputError]}
                  placeholder="Ej: Tacos al Pastor"
                  value={formData.nombre}
                  onChangeText={(text) => handleInputChange('nombre', text)}
                />
                {errores.nombre && (
                  <Text style={styles.errorText}>{errores.nombre}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Descripción *</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    errores.descripcion && styles.inputError
                  ]}
                  placeholder="Describe tu platillo..."
                  value={formData.descripcion}
                  onChangeText={(text) => handleInputChange('descripcion', text)}
                  multiline
                  numberOfLines={4}
                />
                {errores.descripcion && (
                  <Text style={styles.errorText}>{errores.descripcion}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Precio ($) *</Text>
                <TextInput
                  style={[styles.input, errores.precio && styles.inputError]}
                  placeholder="0.00"
                  value={formData.precio}
                  onChangeText={(text) => handleInputChange('precio', text)}
                  keyboardType="decimal-pad"
                />
                {errores.precio && (
                  <Text style={styles.errorText}>{errores.precio}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Categoría</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Desayunos, Comidas, Postres"
                  value={formData.categoria}
                  onChangeText={(text) => handleInputChange('categoria', text)}
                />
              </View>

              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Disponible</Text>
                  <TouchableOpacity
                    style={[
                      styles.switch,
                      formData.disponible && styles.switchActive
                    ]}
                    onPress={() =>
                      handleInputChange('disponible', !formData.disponible)
                    }
                  >
                    <Text style={styles.switchText}>
                      {formData.disponible ? 'Sí' : 'No'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Botones de Acción */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.buttonSecondary}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonSecondaryText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={guardarPlatillo}
                >
                  <Text style={styles.buttonPrimaryText}>
                    {modoEdicion ? 'Actualizar' : 'Guardar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  cargandoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600'
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80
  },
  platilloCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  platilloInfo: {
    flex: 1,
    marginRight: 12
  },
  platilloNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6
  },
  platilloDescripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  platilloFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  platilloPrecio: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35'
  },
  platilloEstado: {
    fontSize: 12,
    fontWeight: '600'
  },
  disponible: {
    color: '#4CAF50'
  },
  noDisponible: {
    color: '#999'
  },
  platilloAcciones: {
    justifyContent: 'center'
  },
  botonEditar: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  botonEliminar: {
    backgroundColor: '#ff4444',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonTexto: {
    fontSize: 18
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  modalClose: {
    fontSize: 28,
    color: '#666'
  },
  formGroup: {
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
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5'
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  switch: {
    backgroundColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20
  },
  switchActive: {
    backgroundColor: '#4CAF50'
  },
  switchText: {
    color: '#fff',
    fontWeight: '600'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center'
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center'
  },
  buttonSecondaryText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default MenuScreen;

