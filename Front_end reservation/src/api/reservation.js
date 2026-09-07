import api from './axiosapis.js';

//reservacion por usaurio id
export const getReservationsByUserId = async (userId) => {
    try {
        const response = await api.get(`/reservations/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener reservas por usuario:', error);
        throw error;
    }   
};

export const createReservation = async (reservationData) => {
    try {
        const response = await api.post('/reservations', reservationData);
        return response.data;
    } catch (error) {
        console.error('Error al crear reserva:', error);
        throw error;
    }
};
