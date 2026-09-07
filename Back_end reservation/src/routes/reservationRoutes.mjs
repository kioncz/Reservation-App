import { Router } from "express";
import {getAllReservationsHandler, getReservationsByUserIdHandler,createReservationHandler} from "../controller/reservation_controller.mjs";
import { authMiddleware } from '../middlewares/authMiddleware.mjs';

const routes = Router();

// Endpoint para obtener todas las reservas
routes.get('/reservations', getAllReservationsHandler);

// Endpoint para obtener reservas por ID de usuario
routes.get('/reservations/:userId', getReservationsByUserIdHandler);

// Endpoint para crear una nueva reserva
routes.post('/reservations', authMiddleware, createReservationHandler);

export default routes;
