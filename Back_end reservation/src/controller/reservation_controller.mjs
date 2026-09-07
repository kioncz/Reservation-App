import { getAllReservations, getReservationsByUserId } from "../models/reservation_model.mjs";
import { reserveTickets } from '../services/reservationServices.mjs';

export const getAllReservationsHandler = async (req, res) => {
    try {
        const reservations = await getAllReservations();  
        res.json(reservations);
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
};

export const getReservationsByUserIdHandler = async (req, res) => {
    const userId = req.params.userId;
    try {
        const reservations = await getReservationsByUserId(userId);  
        res.json(reservations);
    }   
    catch (error) {         
        console.error('Error al obtener las reservas por ID de usuario:', error);   
        res.status(500).json({ error: 'Error al obtener las reservas por ID de usuario' });
    }
};

export const createReservationHandler = async (req, res) => {
    try {
        const { id_event, date_reserv, amount } = req.body;
        const newReservation = await reserveTickets({
            id_user: req.user.id,
            id_event,
            date_reserv,
            amount
        });
        res.status(201).json({ message: 'Reserva creada exitosamente', reservation: newReservation });
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        if (error.code === 'INVALID_EVENT' || error.code === 'INVALID_AMOUNT') {
            return res.status(400).json({ error: error.message });
        }
        if (error.code === 'EVENT_NOT_FOUND') {
            return res.status(404).json({ error: error.message });
        }
        if (error.code === 'INSUFFICIENT_TICKETS') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error al crear la reserva' });
    }       
};

