import pool from '../config/db_reserv.js';

// Función para obtener todos los eventos
export const getAllEvents = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM events');
        return rows;
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        throw error;
    }
};
// Función para obtener un evento por su ID
export const getEventById = async (eventId) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events WHERE id_event = ?', [eventId]);    
    return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener el evento por ID:', error);
        throw error;
    }   
};
//nomrlaiza la entrada de datos de la fecha 
const normalizeDateFilter = (value) => {
    if (typeof value !== 'string') return null;

    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
    if (!match) return null;

    const [, year, month, day] = match;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    if (date.getUTCFullYear() !== Number(year) ||
        date.getUTCMonth() !== Number(month) - 1 ||
        date.getUTCDate() !== Number(day)) {
        return null;
    }

    return `${year}-${month}-${day}`;
};

// Función para filtrar eventos por fecha, hora y ubicación
export const filterEvent = async (date, hour, location) => {
    try {
        let query = 'SELECT * FROM events WHERE 1=1';
        const params = [];
        if (date) {
            const normalizedDate = normalizeDateFilter(date);
            if (!normalizedDate) return [];
            query += ' AND date_events = ?';
            params.push(normalizedDate);
        }
        if (hour) {
            query += ' AND hour_event = ?';
            params.push(hour);
        }
        if (location) {
            query += ' AND location = ?';
            params.push(location);
        }
        const [rows] = await pool.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error al filtrar los eventos:', error);
        throw error;
    }
};

// Función para crear un nuevo evento
export const createEvent = async (eventData) => {
    try {
        const { name, description, location, date, hour, total_tickets, available_tickets } = eventData;
        const [result] = await pool.query(
            'INSERT INTO events (name_event, description, location, date_events, hour_event, total_tickets, available_tickets) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, location, date, hour, total_tickets, available_tickets]
        );
        return {
            id_event: result.insertId,
            name_event: name,
            description,
            location,
            date_events: date,
            hour_event: hour,
            total_tickets,
            available_tickets
        };
    }
    catch (error) {
        console.error('Error al crear el evento:', error);
        throw error;
    }

};
// Función para actualizar un evento existente
export const updateEvent = async (eventId, eventData) => {
    try {
        const { name, description, location, date, hour, total_tickets, available_tickets } = eventData;
        const [result] = await pool.query(
            'UPDATE events SET name_event = ?, description = ?, location = ?, date_events = ?, hour_event = ?, total_tickets = ?, available_tickets = ? WHERE id_event = ?',
            [name, description, location, date, hour, total_tickets, available_tickets, eventId]
        );
        return result.affectedRows > 0; 
    }   
    catch (error) {
        console.error('Error al actualizar el evento:', error);
        throw error;
    }   
};
// Función para eliminar un evento
export const deleteEvent = async (eventId) => {
    try {
        const [result] = await pool.query('DELETE FROM events WHERE id_event = ?', [eventId]);  
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        throw error;
    }   
};