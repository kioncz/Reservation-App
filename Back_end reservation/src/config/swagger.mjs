// Configuración de Swagger en ES Modules
// Documenta manualmente los endpoints de la API (sin autogen para evitar dependencia circular)
//para ingresar a la documentación de swagger, ir a: http://localhost:3000/api-docs
export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API de Reservas',
        version: '1.0.0',
        description: 'Documentación de la API para la gestión de eventos, usuarios y reservaciones',
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    },
    paths: {
        '/api/auth/register': {
            post: {
                summary: 'Registrar un nuevo usuario',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string', example: 'usuario1' },
                                    password: { type: 'string', example: 'clave123' },
                                    type_user: { type: 'integer', example: 2, description: '1 = admin, 2 = user' },
                                }
                            }
                        }
                    }
                },
                responses: { '201': { description: 'Usuario creado' }, '400': { description: 'Error' } }
            }
        },
        '/api/auth/login': {
            post: {
                summary: 'Iniciar sesión (devuelve token JWT)',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string', example: 'admin_2026' },
                                    password: { type: 'string', example: 'admin2026' },
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: 'Login exitoso con token' }, '401': { description: 'Credenciales inválidas' } }
            }
        },
        '/api/auth/profile': {
            get: {
                summary: 'Perfil del usuario logueado',
                tags: ['Auth'],
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Datos del usuario' }, '401': { description: 'Token inválido' } }
            }
        },
        '/api/events': {
            get: {
                summary: 'Obtener todos los eventos',
                tags: ['Eventos'],
                responses: { '200': { description: 'Lista de eventos' } }
            },
            post: {
                summary: 'Crear un evento (solo admin)',
                tags: ['Eventos'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Concierto Rock' },
                                    description: { type: 'string', example: 'Concierto en vivo' },
                                    location: { type: 'string', example: 'Ciudad de México' },
                                    date: { type: 'string', example: '2026-12-01' },
                                    hour: { type: 'string', example: '20:00:00' },
                                    total_tickets: { type: 'integer', example: 100 },
                                    available_tickets: { type: 'integer', example: 50 },
                                }
                            }
                        }
                    }
                },
                responses: { '201': { description: 'Evento creado' }, '403': { description: 'No es admin' } }
            }
        },
        '/api/events/filter': {
            get: {
                summary: 'Filtrar eventos por fecha, hora y ubicación',
                tags: ['Eventos'],
                parameters: [
                    { name: 'date', in: 'query', required: false, schema: { type: 'string', example: '2026-12-01' } },
                    { name: 'hour', in: 'query', required: false, schema: { type: 'string', example: '20:00:00' } },
                    { name: 'location', in: 'query', required: false, schema: { type: 'string', example: 'Ciudad de México' } }
                ],
                responses: { '200': { description: 'Lista de eventos filtrados' }, '500': { description: 'Error al filtrar eventos' } }
            }
        },
        '/api/events/{id}': {
            get: {
                summary: 'Obtener un evento por su ID',
                tags: ['Eventos'],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { '200': { description: 'Evento encontrado' }, '404': { description: 'No encontrado' } }
            },
            put: {
                summary: 'Actualizar un evento (solo admin)',
                tags: ['Eventos'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Concierto Rock actualizado' },
                                    description: { type: 'string', example: 'Concierto en vivo actualizado' },
                                    location: { type: 'string', example: 'Auditorio central' },
                                    date: { type: 'string', example: '2026-12-02' },
                                    hour: { type: 'string', example: '21:00:00' },
                                    total_tickets: { type: 'integer', example: 120 },
                                    available_tickets: { type: 'integer', example: 80 }
                                }
                            }
                        }
                    }
                },
                responses: { '200': { description: 'Evento actualizado' }, '404': { description: 'No encontrado' } }
            },
            delete: {
                summary: 'Eliminar un evento (solo admin)',
                tags: ['Eventos'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { '200': { description: 'Evento eliminado' }, '404': { description: 'No encontrado' } }
            }
        },
        '/api/reservations': {
            get: {
                summary: 'Obtener todas las reservas',
                tags: ['Reservaciones'],
                responses: { '200': { description: 'Lista de reservas' } }
            },
            post: {
                summary: 'Crear una reserva',
                tags: ['Reservaciones'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id_event: { type: 'integer', example: 7 },
                                    date_reserv: { type: 'string', example: '2026-11-05' },
                                    amount: { type: 'integer', example: 3 },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'Reserva creada y boletos descontados' },
                    '400': { description: 'Datos de reserva inválidos' },
                    '401': { description: 'Token no proporcionado o inválido' },
                    '404': { description: 'Evento no encontrado' },
                    '409': { description: 'No hay suficientes boletos disponibles' }
                }
            }
        },
        '/api/reservations/{userId}': {
            get: {
                summary: 'Obtener las reservas de un usuario',
                tags: ['Reservaciones'],
                parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
                responses: { '200': { description: 'Reservas del usuario' } }
            }
        },
    },
};