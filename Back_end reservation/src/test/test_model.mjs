import { getAllEvents } from '../models/event_model.mjs';
import pool from '../config/db_reserv.js';

async function probarModel() {
  try {
    const events = await getAllEvents();
    console.log('✅ Datos obtenidos de MySQL:', events);
  } catch (error) {
    console.error('❌ Error al consultar el modelo:', error.message);
  } finally {
    await pool.end(); // Cierra el pool para que Node termine la ejecución
  }
}

probarModel();
