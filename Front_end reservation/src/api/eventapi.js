import api from './axiosapis.js';


//manejamos las apis de eventos, dentro del crud para usario  ver y admin modificaciones
export const getEvents = async () => {
    try {
        const response = await api.get('/events');  
        return response.data;
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        throw error;
    }   
};
//sirve para obtener un evento por su id, para poder editarlo
export const getEventById = async (eventId) => {
    try {
        const response = await api.get(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener evento:', error);
        throw error;
    }
};

//verificamos si el usuario es admin para poder crear, actualizar y eliminar eventos
export const isAdmin = async () => {
    try {
        const response = await api.get('/users/isAdmin');
        return response.data;
    } catch (error) {
        console.error('Error al verificar si el usuario es admin:', error);
        throw error;
    }
};
//manejamos las apis de eventos, dentro del crud para usario  ver y admin modificaciones
export const createEvent = async (eventData) => {
    try {
        const response = await api.post('/events', eventData);
        return response.data;
    } catch (error) {
        console.error('Error al crear evento:', error);
        throw error;
    }
};

//eliminar evento
export const deleteEvent = async (eventId) => {
    try {   
        const response = await api.delete(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        throw error;
    }   
};

//actualizar evento 
export const updateEvent = async (eventId, eventData) => {
    try {
        const response = await api.put(`/events/${eventId}`, eventData);
        return response.data;
    }
    catch (error) {
        console.error('Error al actualizar evento:', error);
        throw error;
    }       
};

//API para obtener eventos filtrados por fecha, tipo y ubicación
export const getFilteredEvents = async (filters) => {
    try {
        const response = await api.get('/events/filter', { params: filters });
        return response.data;
    }
    catch (error) {
        console.error('Error al obtener eventos filtrados:', error);
        throw error;
    }
};






