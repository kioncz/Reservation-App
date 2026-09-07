import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './src/routes/eventsroutes.mjs';
import authRouter from './src/routes/authRoutes.mjs';
import reservationRoutes from './src/routes/reservationRoutes.mjs';
import './src/config/db_reserv.js'; // Ejecuta la prueba de conexión a la BD
import { swaggerDocument } from './src/config/swagger.mjs'; // Documentación Swagger

const app = express();
const port = process.env.PORT || 3000;

//swagger para documentar la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares globales
app.use(express.json());
app.use(cors());

// Rutas de la API
app.use('/api', routes); // Se recomienda agregar el prefijo /api para mantener un orden REST
app.use('/api/auth', authRouter); // Login y registro
app.use('/api', reservationRoutes); // Rutas de reservaciones

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de reservas');
});

// Exportar la app (para poder testearla) y escuchar solo si se ejecuta directamente
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
  });
}

export default app;  

