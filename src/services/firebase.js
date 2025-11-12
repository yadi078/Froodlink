// Servicio principal de Firebase para FoodLink
// Aquí manejamos todo lo relacionado con autenticación y base de datos
// Usamos variables de entorno para mantener las credenciales seguras

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Configuración de Firebase
// Las credenciales vienen del archivo .env para mayor seguridad
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Inicializamos Firebase con la configuración
// Firebase usa HTTPS automáticamente para todas las comunicaciones
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Función para registrar un nuevo vendedor en la plataforma
export const registrarUsuario = async (email, password, nombre) => {
  try {
    // Creamos el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardamos la información adicional del vendedor en Firestore
    await addDoc(collection(db, 'usuarios'), {
      uid: user.uid,
      email: user.email,
      nombre: nombre,
      rol: 'vendedor',
      fechaCreacion: serverTimestamp()
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        nombre: nombre
      }
    };
  } catch (error) {
    // Si algo sale mal, mostramos un mensaje amigable al usuario
    console.error('Error en registro:', error.code);
    
    let mensajeUsuario = 'Error al registrar usuario. Intenta nuevamente.';
    
    // Traducimos los errores técnicos a mensajes que el usuario pueda entender
    switch (error.code) {
      case 'auth/email-already-in-use':
        mensajeUsuario = 'Este correo electrónico ya está registrado.';
        break;
      case 'auth/invalid-email':
        mensajeUsuario = 'El formato del correo electrónico no es válido.';
        break;
      case 'auth/operation-not-allowed':
        mensajeUsuario = 'El registro no está disponible en este momento.';
        break;
      case 'auth/weak-password':
        mensajeUsuario = 'La contraseña debe tener al menos 6 caracteres.';
        break;
      case 'auth/network-request-failed':
        mensajeUsuario = 'Error de conexión. Verifica tu internet.';
        break;
      default:
        mensajeUsuario = 'Error al registrar. Por favor intenta más tarde.';
    }
    
    return {
      success: false,
      error: mensajeUsuario
    };
  }
};

// Función para que un vendedor inicie sesión
export const iniciarSesion = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Buscamos la información adicional del vendedor en Firestore
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    let userData = { nombre: 'Usuario', rol: 'vendedor' };
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        nombre: userData.nombre,
        rol: userData.rol
      }
    };
  } catch (error) {
    console.error('Error en login:', error.code);
    
    let mensajeUsuario = 'Error al iniciar sesión. Intenta nuevamente.';
    
    // Mensajes de error amigables
    switch (error.code) {
      case 'auth/invalid-email':
        mensajeUsuario = 'El formato del correo electrónico no es válido.';
        break;
      case 'auth/user-disabled':
        mensajeUsuario = 'Esta cuenta ha sido deshabilitada.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        // Mismo mensaje para ambos casos por seguridad
        mensajeUsuario = 'Usuario o contraseña incorrectos.';
        break;
      case 'auth/too-many-requests':
        mensajeUsuario = 'Demasiados intentos. Intenta más tarde.';
        break;
      case 'auth/network-request-failed':
        mensajeUsuario = 'Error de conexión. Verifica tu internet.';
        break;
      default:
        mensajeUsuario = 'Error al iniciar sesión. Por favor intenta más tarde.';
    }
    
    return {
      success: false,
      error: mensajeUsuario
    };
  }
};

// Cerrar sesión del vendedor actual
export const cerrarSesion = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Sesión cerrada correctamente'
    };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return {
      success: false,
      error: 'Error al cerrar sesión. Intenta nuevamente.'
    };
  }
};

// Esta función nos permite estar atentos a cambios en la sesión del usuario
export const observarEstadoAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Obtener el usuario que está actualmente conectado
export const obtenerUsuarioActual = () => {
  return auth.currentUser;
};

// Función para crear un nuevo platillo en el menú del vendedor
export const crearPlatillo = async (platilloData) => {
  try {
    const user = auth.currentUser;
    
    // Verificamos que haya un usuario conectado
    if (!user) {
      return {
        success: false,
        error: 'Debes iniciar sesión para crear un platillo.'
      };
    }

    // Preparamos los datos del platillo
    const platillo = {
      nombre: platilloData.nombre,
      descripcion: platilloData.descripcion,
      precio: parseFloat(platilloData.precio),
      categoria: platilloData.categoria || 'General',
      disponible: platilloData.disponible !== undefined ? platilloData.disponible : true,
      userId: user.uid, // Asociamos el platillo con el vendedor actual
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    };

    // Guardamos el platillo en Firestore
    const docRef = await addDoc(collection(db, 'platillos'), platillo);

    return {
      success: true,
      platilloId: docRef.id,
      message: 'Platillo creado exitosamente.'
    };
  } catch (error) {
    console.error('Error al crear platillo:', error);
    return {
      success: false,
      error: 'Error al crear el platillo. Verifica los datos e intenta nuevamente.'
    };
  }
};

// Obtener todos los platillos que pertenecen al vendedor actual
export const obtenerMisPlatillos = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'Debes iniciar sesión para ver tus platillos.'
      };
    }

    // Consultamos solo los platillos que pertenecen a este vendedor
    const platillosRef = collection(db, 'platillos');
    const q = query(platillosRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);

    const platillos = [];
    querySnapshot.forEach((doc) => {
      platillos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      platillos: platillos
    };
  } catch (error) {
    console.error('Error al obtener platillos:', error);
    return {
      success: false,
      error: 'Error al cargar los platillos. Intenta nuevamente.',
      platillos: []
    };
  }
};

// Actualizar la información de un platillo existente
export const actualizarPlatillo = async (platilloId, datosActualizados) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'Debes iniciar sesión para actualizar platillos.'
      };
    }

    // Preparamos los datos nuevos del platillo
    const datosLimpios = {
      ...datosActualizados,
      precio: parseFloat(datosActualizados.precio),
      fechaActualizacion: serverTimestamp()
    };

    // Actualizamos el platillo en Firestore
    const platilloRef = doc(db, 'platillos', platilloId);
    await updateDoc(platilloRef, datosLimpios);

    return {
      success: true,
      message: 'Platillo actualizado exitosamente.'
    };
  } catch (error) {
    console.error('Error al actualizar platillo:', error);
    return {
      success: false,
      error: 'Error al actualizar el platillo. Verifica los datos e intenta nuevamente.'
    };
  }
};

// Eliminar un platillo del menú
export const eliminarPlatillo = async (platilloId) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'Debes iniciar sesión para eliminar platillos.'
      };
    }

    // Borramos el platillo de Firestore
    const platilloRef = doc(db, 'platillos', platilloId);
    await deleteDoc(platilloRef);

    return {
      success: true,
      message: 'Platillo eliminado exitosamente.'
    };
  } catch (error) {
    console.error('Error al eliminar platillo:', error);
    return {
      success: false,
      error: 'Error al eliminar el platillo. Intenta nuevamente.'
    };
  }
};

// Exportamos las instancias de auth y db por si se necesitan en otro lugar
export { auth, db };

