/**
 * shared/config/db.js
 * Conexión a MongoDB con reintentos y manejo de eventos.
 */

import mongoose from 'mongoose';
import { env }  from './env.js';
import { logger } from '../utils/logger.js';

let isConnected = false;

const RETRY_DELAY = 5000;  // ms entre reintentos
const MAX_RETRIES = 3;

export const connectDB = async (retries = 0) => {
  if (isConnected) {
    logger.debug('MongoDB ya conectado, reutilizando conexión.');
    return;
  }

  if (!env.MONGODB_URI) {
    logger.warn('MONGODB_URI no definida — omitiendo conexión a base de datos.');
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS:          45000,
    });

    isConnected = true;
    logger.success('MongoDB conectado correctamente.');

    // Eventos de conexión
    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB desconectado.');
    });
    mongoose.connection.on('error', err => {
      logger.error('Error en conexión MongoDB:', err.message);
    });

  } catch (error) {
    logger.error(`MongoDB error (intento ${retries + 1}/${MAX_RETRIES}):`, error.message);

    if (retries < MAX_RETRIES - 1) {
      logger.info(`Reintentando en ${RETRY_DELAY / 1000}s...`);
      await new Promise(r => setTimeout(r, RETRY_DELAY));
      return connectDB(retries + 1);
    }

    throw new Error(`No se pudo conectar a MongoDB tras ${MAX_RETRIES} intentos.`);
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  logger.info('MongoDB desconectado correctamente.');
};

export const getConnection = () => mongoose.connection;
export const isDBConnected  = () => isConnected;
