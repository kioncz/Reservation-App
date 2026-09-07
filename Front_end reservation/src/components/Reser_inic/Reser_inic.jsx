import { getReservationsByUserId } from '../../api/reservation.js'
import { getEventById } from '../../api/eventapi.js'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";

const normalizeReservations = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.reservations)) return data.reservations;
    if (Array.isArray(data?.data)) return data.data;
    if (data?.reservation) return [data.reservation];
    if (data?.id_reser) return [data];
    return [];
};

// Agrupa las reservas que pertenecen al mismo evento para mostrar una sola tarjeta.
// Por ejemplo, dos reservas del evento 7 se convierten en un único grupo con su cantidad total.
const groupReservationsByEvent = (reservations) => {
    return Object.values(
        reservations.reduce((groups, reservation) => {
            // id_event es la clave que identifica al evento reservado.
            const eventId = reservation.id_event;

            // Creamos el grupo solo la primera vez que aparece ese evento.
            if (!groups[eventId]) {
                groups[eventId] = {
                    ...reservation,
                    amount: 0,
                };
            }

            // Sumamos las entradas de todas las reservas del mismo evento.
            groups[eventId].amount += Number(reservation.amount ?? 0);
            return groups;
        }, {})
    );
};

//permirita mosntrar las reservas del usuario logueado, para que pueda ver sus reservas
function Reser_inic() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = user?.id_user ?? user?.id;

    useEffect(() => {
        const fetchReservations = async () => {
            if (!userId) {
                setError("No se encontró el usuario autenticado.");
                setLoading(false);
                return;
            }

            try {   
                const data = await getReservationsByUserId(userId);
                // Primero normalizamos la respuesta y después agrupamos por evento.
                const reservationList = groupReservationsByEvent(normalizeReservations(data));
                const reservationsWithEvents = await Promise.all(
                    reservationList.map(async (reservation) => {
                        if (reservation.name_event || !reservation.id_event) {
                            return reservation;
                        }

                        const event = await getEventById(reservation.id_event);
                        return { ...reservation, ...event };
                    })
                );
                setReservations(reservationsWithEvents);
            } catch {
                setError("Error al obtener las reservas. Por favor, inténtelo de nuevo.");
            }
                finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, [userId]);

    if (loading) {
        return <div className="event-container"><p className="event-status">Cargando reservas...</p></div>;
    }

    if (error) {
        return <div className="event-container"><p className="event-status event-status-error" role="alert">{error}</p></div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Fecha no disponible";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    return (
        <div className="event-container">
            <div className="event-heading">
                <p className="event-eyebrow">Agenda</p>
                <h1>Tus eventos reservados</h1>
                <p className="event-subtitle">Aquí puedes ver todos los eventos que has reservado.</p>
            </div>
            {reservations.length === 0 ? (
                <p className="event-status">Todavía no tienes reservas.</p>
            ) : (
                <ul className="event-list">
                    {reservations.map((reservation) => (
                        <li key={reservation.id_event} className="event-item">
                            {/* Después de agrupar, id_event identifica esta tarjeta de evento. */}
                            <div className="event-card-topline">
                                <span className="event-date">
                                    {formatDate(reservation.date_events)}
                                </span>
                                <span className="event-tickets">
                                    {reservation.amount} entradas
                                </span>
                            </div>
                            <h2>Evento reservado</h2>
                            <p className="event-description">
                                {reservation.name_event}
                            </p>
                            <div className="event-details">
                                <p><strong>Ubicación</strong>{reservation.location}</p>
                                <p><strong>Hora</strong>{reservation.hour_event}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <button
                type="button"
                className="reservation-home-button"
                onClick={() => navigate('/menu_user')}
            >
                Volver al inicio
            </button>
        </div>
    );
}

export default Reser_inic