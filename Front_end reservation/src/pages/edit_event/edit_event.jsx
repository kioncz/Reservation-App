import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import Bar_inic from '../../components/Bar_inc/Bar_inic.jsx'
import EventFormFields from '../../components/EventFormFields/EventFormFields.jsx'
import { getEventById, updateEvent } from '../../api/eventapi.js'

function EditEvent() {
    const navigate = useNavigate()
    const { eventId } = useParams()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',   
        hour: '',
        location: '',
        total_tickets: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const event = await getEventById(eventId)
                setFormData({
                    name: event.name_event ?? '',
                    description: event.description ?? '',
                    date: event.date_events?.slice(0, 10) ?? '',
                    hour: event.hour_event ?? '',
                    location: event.location ?? '',
                    total_tickets: event.total_tickets ?? '',
                })
            } catch {
                setError('No se pudo cargar el evento.')
            } finally {
                setLoading(false)
            }
        }

        loadEvent()
    }, [eventId])

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            await updateEvent(eventId, {
                ...formData,
                total_tickets: Number(formData.total_tickets),
                available_tickets: Number(formData.total_tickets),
            })
            navigate('/menu_user')
        } catch {
            setError('No se pudo editar el evento. Inténtalo nuevamente.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
            <div className="create-event-page">
                <Bar_inic />
                <main className="create-event-content">
                    <div className="create-event-heading">
                        <p className="event-eyebrow">Administración</p>
                        <h1>Editar evento</h1>
                        <p>Actualiza los datos del evento seleccionado.</p>
                    </div>

                    {loading ? (
                        <p className="event-status">Cargando evento...</p>
                    ) : (
                        <form className="create-event-form" onSubmit={handleSubmit}>
                            <EventFormFields formData={formData} handleChange={handleChange} />
                            {error && <p className="create-event-error" role="alert">{error}</p>}
                            <div className="create-event-actions">
                                <button type="submit" disabled={submitting}>
                                    {submitting ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                                <button type="button" className="create-event-cancel" onClick={() => navigate('/menu_user')}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}
                </main>
            </div>
    )
}

export default EditEvent
