import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Bar_inic from '../../components/Bar_inc/Bar_inic.jsx'
import { createEvent } from '../../api/eventapi.js'
import EventFormFields from '../../components/EventFormFields/EventFormFields.jsx'

function Create_event() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        hour: '',
        location: '',
        total_tickets: '',
    })
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            await createEvent({
                ...formData,
                total_tickets: Number(formData.total_tickets),
                available_tickets: Number(formData.total_tickets),
            })
            navigate('/menu_user')
        } catch {
            setError('No se pudo crear el evento. Inténtalo nuevamente.')
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
                    <h1>Crear un nuevo evento</h1>
                    <p>Completa los datos para publicar una nueva experiencia.</p>
                </div>
            <form className="create-event-form" onSubmit={handleSubmit}>
                    <EventFormFields formData={formData} handleChange={handleChange} />

                {error && <p className="create-event-error" role="alert">{error}</p>}

                <div className="create-event-actions">
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Creando...' : 'Crear evento'}
                    </button>
                    <button type="button" className="create-event-cancel" onClick={() => navigate('/menu_user')}>
                        Cancelar
                    </button>
                </div>
            </form>
            </main>
        </div>
    )
}

export default Create_event