function EventFormFields({ formData, handleChange }) {
    return (
        <>
            <label htmlFor="event-name">Nombre del evento:</label>
            <input
                type="text"
                id="event-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <label htmlFor="event-description">Descripción del evento:</label>
            <textarea
                id="event-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
            />

            <label htmlFor="event-date">Fecha del evento:</label>
            <input
                type="date"
                id="event-date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
            />

            <label htmlFor="event-hour">Hora del evento:</label>
            <input
                type="time"
                id="event-hour"
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                required
            />

            <label htmlFor="event-location">Ubicación del evento:</label>
            <input
                type="text"
                id="event-location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
            />

            <label htmlFor="event-tickets">Número de entradas disponibles:</label>
            <input
                type="number"
                id="event-tickets"
                name="total_tickets"
                value={formData.total_tickets}
                onChange={handleChange}
                min="1"
                required
            />
        </>
    )
}

export default EventFormFields
