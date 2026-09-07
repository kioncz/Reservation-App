# Reservation App - Backend

## Documentacion del proyecto

Backend de la aplicacion de reservas de eventos. Expone una API REST desarrollada
con Express, utiliza MySQL para persistir usuarios, eventos y reservaciones, y
protege las operaciones privadas mediante tokens JWT.

La API utiliza el prefijo `/api` para sus rutas.

## Funcionamiento general

El backend proporciona la API REST que utiliza el frontend para autenticar
usuarios, consultar eventos y gestionar reservaciones. La comunicacion se
realiza mediante solicitudes HTTP en formato JSON.

La autenticacion utiliza tokens JWT. El backend valida el token en las rutas
protegidas y comprueba el rol del usuario en las operaciones administrativas.

## Funcionalidades principales

### Autenticacion

- Registro e inicio de sesion de usuarios.
- Consulta del perfil del usuario autenticado.

### Eventos

- Listado y consulta de eventos.
- Busqueda por fecha, hora y ubicacion.
- Creacion, edicion y eliminacion de eventos para administradores.

### Reservaciones

- Consulta de todas las reservaciones.
- Consulta de reservaciones por usuario.
- Creacion de reservaciones con validacion de disponibilidad de boletos.
- Actualizacion de boletos disponibles despues de una reservacion.

### Documentacion

- Documentacion interactiva con Swagger UI.
- Especificacion OpenAPI en `openapi.yaml`.

## Tecnologias utilizadas

- Node.js 22
- Express 5
- MySQL 8.4
- mysql2 para la conexion con MySQL
- JWT con `jsonwebtoken`
- `bcryptjs` para el manejo de contrasenas
- Swagger UI Express y OpenAPI 3.0.3
- Docker y Docker Compose

## Estructura del proyecto

```text
src/
├── config/          # Conexion a MySQL y configuracion de Swagger
├── controller/      # Controladores HTTP de autenticacion, eventos y reservas
├── middlewares/     # Validacion de JWT y rol de administrador
├── models/          # Consultas y acceso a datos
├── routes/          # Definicion de rutas de la API
├── services/        # Logica de autenticacion y reservaciones
└── test/            # Pruebas y scripts de verificacion
app.mjs              # Configuracion y punto de entrada de Express
openapi.yaml         # Especificacion OpenAPI de la API
Dockerfile           # Imagen del backend
```

## Endpoints implementados

### Salud y documentacion

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/` | Comprueba que la API esta disponible. |
| GET | `/api-docs` | Abre la documentacion interactiva de Swagger. |

### Autenticacion

| Metodo | Ruta | Autenticacion | Descripcion |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Registra un usuario. `type_user`: `1` administrador, `2` usuario normal. |
| POST | `/api/auth/login` | No | Inicia sesion y devuelve un token JWT. |
| GET | `/api/auth/profile` | JWT | Devuelve el perfil del usuario autenticado. |

Ejemplo de registro:

```json
{
	"username": "usuario1",
	"password": "clave123",
	"type_user": 2
}
```

Para usar una ruta protegida, enviar el token en el encabezado:

```text
Authorization: Bearer <token>
```

### Eventos

| Metodo | Ruta | Autenticacion | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/events` | No | Lista todos los eventos. |
| GET | `/api/events/filter` | No | Filtra por fecha, hora y/o ubicacion. Los parametros son opcionales. |
| GET | `/api/events/:id` | No | Obtiene un evento por su identificador. |
| POST | `/api/events` | JWT + administrador | Crea un evento. |
| PUT | `/api/events/:id` | JWT + administrador | Actualiza un evento. |
| DELETE | `/api/events/:id` | JWT + administrador | Elimina un evento. |

Ejemplo de evento:

```json
{
	"name": "Concierto Rock",
	"description": "Concierto en vivo",
	"location": "Guayas",
	"date": "2026-10-15",
	"hour": "20:00:00",
	"total_tickets": 100,
	"available_tickets": 100
}
```

Ejemplos de filtrado:

```text
GET /api/events/filter?date=2026-10-15
GET /api/events/filter?hour=20:00:00
GET /api/events/filter?location=Guayas
GET /api/events/filter?date=2026-10-15&hour=20:00:00
```

Los parametros `date`, `hour` y `location` pueden combinarse. Si se envia mas
de uno, el evento debe cumplir todas las condiciones. La fecha debe usar el
formato `YYYY-MM-DD`.

### Reservaciones

| Metodo | Ruta | Autenticacion | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/reservas` | No | Ruta auxiliar de comprobacion. |
| GET | `/api/reservations` | No | Lista todas las reservaciones. |
| GET | `/api/reservations/:userId` | No | Lista las reservaciones de un usuario. |
| POST | `/api/reservations` | JWT | Crea una reservacion y descuenta los boletos disponibles. |

Ejemplo de reservacion:

```json
{
	"id_event": 7,
	"date_reserv": "2026-11-05",
	"amount": 3
}
```

Respuestas relevantes: `400` datos invalidos, `401` token invalido, `404`
evento inexistente y `409` boletos insuficientes.

## Documentacion OpenAPI

La especificacion completa se encuentra en [`openapi.yaml`](./openapi.yaml).

Con el backend iniciado, Swagger UI esta disponible en:

```text
http://localhost:3000/api-docs
```

Tambien se puede cargar `openapi.yaml` directamente en
[Swagger Editor](https://editor.swagger.io/).

## Requisitos

- Node.js 22 o superior.
- pnpm 11.5.2 o compatible.
- MySQL 8.4, si se ejecuta sin Docker.
- Docker Desktop y Docker Compose, si se utiliza Docker.

## Variables de entorno

Crear un archivo `.env` en esta carpeta:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=reservations_db
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=2h
```

Cuando el backend se ejecuta dentro de Docker Compose, `DB_HOST` debe ser
`db`, porque ese es el nombre del servicio MySQL dentro de Docker.

P.D: En caso de utilizar un puerto definido, agregar una nueva variable de entorno asignando el puerto.

## Instalacion

Desde esta carpeta:

```powershell
pnpm install
```

El servidor queda disponible en `http://localhost:3000`.

## Ejecucion en desarrollo

El backend se inicia con:

```powershell
pnpm start
```

Antes de iniciarlo, MySQL debe estar disponible y las variables de entorno
deben apuntar a la base de datos correcta.

## Docker

El archivo Compose se encuentra en la carpeta raiz `Proyecto`, un nivel por
encima de este backend. Desde esa carpeta ejecutar:

```powershell
docker compose up -d --build
```

Esto inicia MySQL en `localhost:3306`, el backend en `http://localhost:3000`
y el frontend en `http://localhost:5173`.

Para comprobar el estado y detener los servicios:

```powershell
docker compose ps
docker compose logs -f backend
docker compose down
```

Los datos de MySQL se conservan en el volumen `mysql_data`. No utilizar
`docker compose down -v` salvo que se quiera eliminar tambien la base de datos.

## Validacion del proyecto

Para validar la especificacion OpenAPI:

```powershell
pnpm --package=@redocly/cli dlx redocly lint openapi.yaml
```

Los scripts de prueba se encuentran en [`src/test`](./src/test). Por ejemplo:

```powershell
node src/test/test_eventos_crud.mjs
```

Las pruebas que acceden a MySQL requieren que la base de datos este levantada.

## Integracion con el frontend

El frontend espera que el backend este disponible bajo:

```text
http://localhost:3000/api
```

Si se cambia el puerto del backend, actualiza `VITE_API_URL` en el frontend y
vuelve a iniciar el servidor o reconstruir la imagen de Docker.

## Notas

- `DB_HOST=localhost` se utiliza cuando el backend corre directamente en el equipo.
- `DB_HOST=db` se utiliza cuando el backend corre dentro de Docker Compose.
- No subir archivos `.env` con contrasenas o secretos al repositorio.
- `docker compose down` detiene los servicios sin eliminar el volumen de MySQL.

## Base de datos

El script [`database/init.sql`](../database/init.sql) crea las tablas:

- `user_type`: tipos de usuario.
- `user`: credenciales y rol de los usuarios.
- `events`: informacion, fecha, hora y disponibilidad de eventos.
- `reservation`: reservaciones asociadas a usuarios y eventos.
