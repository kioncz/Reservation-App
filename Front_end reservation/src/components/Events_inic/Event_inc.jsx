import { deleteEvent, getEvents } from "../../api/eventapi.js";
import {createReservation} from "../../api/reservation.js";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth.jsx";



function Event_inc({ filteredEvents = null }) {
    const { isAdmin } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    // Estados para controlar la selección, cantidad y resultado de una reserva.
    const [reservationError, setReservationError] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [ticketsCount, setTicketsCount] = useState(1);
    const [reservationSuccess, setReservationSuccess] = useState("");
    const [reservationSuccessEventId, setReservationSuccessEventId] = useState(null);

    useEffect(() => {
        if (!reservationSuccess) return undefined;

        const timeoutId = setTimeout(() => {
            setReservationSuccess("");
            setReservationSuccessEventId(null);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [reservationSuccess]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (filteredEvents !== null) {
                setEvents(filteredEvents);
                setLoading(false);
                return;
            }

            try {
                const data = await getEvents();
                setEvents(data);
            } catch (error) {
                setError("Error al obtener los eventos. Por favor, inténtelo de nuevo.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [filteredEvents]);

    const handleReservation = async (eventId) => {
        // Abrimos el selector de cantidad para el evento elegido.
        setReservationError(null);
        setReservationSuccess("");
        setReservationSuccessEventId(null);
        setSelectedEventId(eventId);
    };

    const handleReservationConfirm = async (eventId, amount) => {
        // Validamos localmente antes de enviar la reserva al backend.
        setReservationError(null);
        try {
            const event = events.find((e) => e.id_event === eventId);
            if (!event) {
                setReservationError("Evento no encontrado.");
                return;
            }
            const quantity = Number(amount);
            if (!Number.isInteger(quantity) || quantity < 1 || event.available_tickets < quantity) {
                setReservationError("No hay suficientes entradas disponibles para este evento.");
                return;
            }
            const reservationData = {
                id_event: eventId,
                amount: quantity,
                date_reserv: new Date().toISOString().slice(0, 10),
            };
            // El backend valida nuevamente los tickets y los descuenta de forma segura.
            await createReservation(reservationData);
            setReservationSuccess("Reserva realizada correctamente.");
            setReservationSuccessEventId(eventId);
            setSelectedEventId(null);
            setTicketsCount(1);
            // Actualizamos la disponibilidad visible sin tener que recargar la página.
            setEvents((prevEvents) =>
                prevEvents.map((e) =>
                    e.id_event === eventId
                        ? { ...e, available_tickets: e.available_tickets - quantity }
                        : e
                )
            );
        } catch (err) {
            setReservationError(err.response?.data?.error || "Error al realizar la reserva.");
        }
    };


    const handleDelete = async (eventId) => {
        if (!window.confirm("¿Seguro que quieres eliminar este evento?")) {
            return;
        }

        try {
            await deleteEvent(eventId);
            setEvents((currentEvents) => currentEvents.filter((event) => event.id_event !== eventId));
        } catch {
            setError("No se pudo eliminar el evento. Por favor, inténtelo de nuevo.");
        }
    };

    return (
        <div className="event-container">
            <div className="event-heading">
                <p className="event-eyebrow">Agenda</p>
                <h1>Próximos eventos</h1>
                <p className="event-subtitle">Encuentra una experiencia y reserva tu lugar.</p>
            </div>
            {loading ? (
                <p className="event-status">Cargando eventos...</p>
            ) : error ? (
                <p className="event-status event-status-error" role="alert">{error}</p>
            ) : (
                <ul className="event-list">
                    {events.map((event) => (
                        <li key={event.id_event} className="event-item">
                            <div className="event-card-topline">
                                <span className="event-date">
                                    {new Date(event.date_events).toLocaleDateString()}
                                </span>
                                <span className="event-tickets">
                                    {event.available_tickets} disponibles
                                </span>
                            </div>
                            <h2>{event.name_event}</h2>
                            <p className="event-description">{event.description}</p>
                            <div className="event-details">
                                <p><strong>Ubicación</strong>{event.location}</p>
                                <p><strong>Hora</strong>{event.hour_event}</p>
                            </div>
                            <div className="event-card-bottomline">
                                {!isAdmin && (
                                    // Los usuarios normales pueden reservar; los administradores gestionan eventos.
                                    <button type="button" className="event-reserve-button" onClick={() => handleReservation(event.id_event)}>
                                        Reservar
                                    </button>
                                )}
                                {!isAdmin && selectedEventId === event.id_event && (
                                    <div className="mt-3 grid gap-2">
                                        {/* Este control determina cuántas entradas se solicitan. */}
                                        <label className="text-sm font-bold text-slate-600" htmlFor={`tickets-${event.id_event}`}>
                                            Cantidad de entradas
                                        </label>
                                        <input
                                            id={`tickets-${event.id_event}`}
                                            type="number"
                                            min="1"
                                            max={event.available_tickets}
                                            value={ticketsCount}
                                            onChange={(e) => setTicketsCount(Number(e.target.value))}
                                            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none focus:border-orange-700 focus:ring-2 focus:ring-orange-200"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className="reservation-confirm-button"
                                                onClick={() => handleReservationConfirm(event.id_event, ticketsCount)}
                                            >
                                                Confirmar reserva
                                            </button>
                                            <button
                                                type="button"
                                                className="reservation-cancel-button"
                                                onClick={() => setSelectedEventId(null)}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                        {reservationSuccess && <p className="text-sm font-bold text-green-700">{reservationSuccess}</p>}
                                        {reservationError && <p className="text-sm font-bold text-red-700" role="alert">{reservationError}</p>}
                                    </div>
                                )}
                                {isAdmin && (
                                    <div className="event-admin-actions">
                                        <button type="button" className="event-edit-button" onClick={() => window.location.href = `/edit_event/${event.id_event}`}>
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="event-delete-button"
                                            onClick={() => handleDelete(event.id_event)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                                {reservationSuccess && reservationSuccessEventId === event.id_event && (
                                    <div className="reservation-success-toast" role="status" aria-live="polite">
                                        <span>{reservationSuccess}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReservationSuccess("");
                                                setReservationSuccessEventId(null);
                                            }}
                                            aria-label="Cerrar mensaje"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}

export default Event_inc;