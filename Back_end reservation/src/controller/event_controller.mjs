import { getAllEvents, getEventById, filterEvent, createEvent, updateEvent, deleteEvent } from '../models/event_model.mjs';

const requiredEventFields = ['name', 'description', 'location', 'date', 'hour', 'total_tickets', 'available_tickets'];

const getMissingEventFields = (eventData) => requiredEventFields.filter((field) => {
    const value = eventData?.[field];
    return value === undefined || value === null || value === '';
});

export const getAllEventsHandler = async (req, res) => {
    try {
        const events = await getAllEvents(); 
        res.json(events);
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        res.status(500).json({ error: 'Error al obtener los eventos' });
    }       
}

export const getEventByIdHandler = async (req, res) => {
    //params es un objeto que contiene los parámetros de la ruta, en este caso el id del evento
    const { id } = req.params;
    try {
        const event = await getEventById(id);    
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ error: 'Evento no encontrado' });
        }   
    } catch (error) {
        console.error('Error al obtener el evento:', error);
        res.status(500).json({ error: 'Error al obtener el evento' });
    }   
}

export const filterEventHandler = async (req, res) => {
    const { date, hour, location } = req.query;
    try {
        const events = await filterEvent(date, hour, location);
        res.json(events);
    } catch (error) {
        console.error('Error al filtrar los eventos:', error);
        res.status(500).json({ error: 'Error al filtrar los eventos' });
    }
};

export const createEventHandler = async (req, res) => {
    try {
        const adminUser = req.user;
        const missingFields = getMissingEventFields(req.body);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios para crear el evento',
                fields: missingFields
            });
        }

        const eventData = await createEvent(req.body);
        res.status(201).json({ message: 'Evento creado exitosamente', event: eventData });
    }
    catch (error) {
        console.error('Error al crear el evento:', error);
        res.status(500).json({ error: 'Error al crear el evento' });
    }

}

 export const updateEventHandler = async (req, res) => {
    try {
        const adminUser = req.user;
        const eventId = req.params.id;
        const eventData = req.body;
        const missingFields = getMissingEventFields(eventData);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios para actualizar el evento',
                fields: missingFields
            });
        }

        const updated = await updateEvent(eventId, eventData);  
        if (updated) {
            res.json({ message: 'Evento actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Evento no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el evento:', error);
        res.status(500).json({ error: 'Error al actualizar el evento' });
    }
};

export const deleteEventHandler = async (req, res) => {
    try {
        const adminUser = req.user; 
        const eventId = req.params.id;
        const deleted = await deleteEvent(eventId); 
        if (deleted) {
            res.json({ message: 'Evento eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Evento no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        res.status(500).json({ error: 'Error al eliminar el evento' });
    }   
};
