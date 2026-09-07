import { Router } from 'express';
import { getAllEventsHandler, getEventByIdHandler, filterEventHandler, createEventHandler , updateEventHandler, deleteEventHandler} from '../controller/event_controller.mjs';
import { authMiddleware, verifyadmin } from '../middlewares/authMiddleware.mjs';

const routes = Router();

// Resumen de reservas
routes.get('/reservas', (req, res) => {
    res.json({ mensaje: 'Lista de reservas' });
});

// Endpoint para obtener todos los eventos (basado en el modelo event)
routes.get('/events', getAllEventsHandler);

// Endpoint para filtrar eventos por fecha, hora y ubicación
routes.get('/events/filter', filterEventHandler);

// Endpoint para obtener un evento por su ID
routes.get('/events/:id', getEventByIdHandler);

// Endpoint para actualizar un evento existente (solo admin, con verificación de token y rol)
routes.put('/events/:id', authMiddleware, verifyadmin, updateEventHandler);
// Endpoint para eliminar un evento existente (solo admin, con verificación de token y rol)
routes.delete('/events/:id', authMiddleware, verifyadmin, deleteEventHandler);
// Endpoint para crear un nuevo evento (solo admin, con verificación de token y rol)
routes.post('/events', authMiddleware, verifyadmin, createEventHandler);

export default routes;  