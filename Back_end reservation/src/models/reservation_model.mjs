import pool from '../config/db_reserv.js';


export const getAllReservations = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM reservation');
        return rows;
    }
    catch (error) {
        console.error('Error al obtener las reservas:', error);
        throw error;
    }       

};
//hacer las reservaciones por id de usuario
export const getReservationsByUserId = async (userId) => {
    try {   
        const [rows] = await pool.query(
            `SELECT
                r.id_reser,
                r.id_user,
                r.id_event,
                r.amount,
                e.name_event,
                e.description,
                e.location,
                e.date_events,
                e.hour_event
            FROM reservation r
            INNER JOIN events e ON r.id_event = e.id_event
            WHERE r.id_user = ?`,
            [userId]
        );
        return rows;
    }   
    catch (error) {
        console.error('Error al obtener las reservas por ID de usuario:', error);
        throw error;
    }   
};


//crea las reservaciones para cada usuario y evento
export const createReservation = async (reservationData) => {
    const connection = await pool.getConnection();

    try {
        const { id_user, id_event, date_reserv, amount } = reservationData;

        await connection.beginTransaction();

        const [events] = await connection.query(
            'SELECT available_tickets FROM events WHERE id_event = ? FOR UPDATE',
            [id_event]
        );

        if (events.length === 0) {
            const error = new Error('Evento no encontrado');
            error.code = 'EVENT_NOT_FOUND';
            throw error;
        }

        if (events[0].available_tickets < amount) {
            const error = new Error('No hay suficientes boletos disponibles');
            error.code = 'INSUFFICIENT_TICKETS';
            throw error;
        }

        await connection.query(
            'UPDATE events SET available_tickets = available_tickets - ? WHERE id_event = ?',
            [amount, id_event]
        );

        const [result] = await connection.query(
            'INSERT INTO reservation (id_user, id_event, date_reserv, amount) VALUES (?, ?, ?, ?)',
            [id_user, id_event, date_reserv, amount]
        );

        await connection.commit();
        return { id_reser: result.insertId, id_user, id_event, date_reserv, amount };
    }
    catch (error) {
        await connection.rollback();
        console.error('Error al crear la reserva:', error);
        throw error;
    } finally {
        connection.release();
    }
};