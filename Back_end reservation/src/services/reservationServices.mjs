import { createReservation } from '../models/reservation_model.mjs';

export const reserveTickets = async ({ id_user, id_event, date_reserv, amount }) => {
	const eventId = Number(id_event);
	const ticketAmount = Number(amount);

	if (!Number.isInteger(eventId) || eventId <= 0) {
		const error = new Error('El evento indicado no es válido');
		error.code = 'INVALID_EVENT';
		throw error;
	}

	if (!Number.isInteger(ticketAmount) || ticketAmount <= 0) {
		const error = new Error('La cantidad de boletos debe ser un entero mayor que cero');
		error.code = 'INVALID_AMOUNT';
		throw error;
	}

	return createReservation({
		id_user,
		id_event: eventId,
		date_reserv,
		amount: ticketAmount
	});
};

