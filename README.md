# Reservation App

## Documentación del proyecto

Este proyecto está compuesto por un backend y un frontend. La documentación específica sobre el funcionamiento, la configuración y las funcionalidades de cada parte se encuentra en el archivo `README.md` correspondiente dentro de las carpetas `Back_end reservation` y `Front_end reservation`.


## Diagrama de arquitectura

```
                        ┌──────────────────────────────────────────┐
                        │            USUARIO (Navegador)           │
                        └─────────────────────┬────────────────────┘
                                              │ HTTP :5173
                        ┌─────────────────────▼────────────────────┐
                        │   FRONTEND (React + Vite + TailwindCSS)  │
                        │   servido por Nginx — contenedor         │
                        │  ┌─────────────┐  ┌───────────────────┐  │
                        │  │ pages/      │  │ context/auth.jsx  │  │
                        │  │ login       │  │ (estado global    │  │
                        │  │ register    │  │  de sesión JWT)   │  │
                        │  │ create_event│  └───────────────────┘  │
                        │  │ edit_event  │  ┌───────────────────┐  │
                        │  │ menu_user   │  │ routes/approuter  │  │
                        │  │ reservation │  └───────────────────┘  │
                        │  └─────────────┘                         │
                        │  api/ → axios (authjwt, eventapi,        │
                        │         reservation, axiosapis)          │
                        └─────────────────────┬────────────────────┘
                                              │ REST/JSON  http://localhost:3000/api
                                              │ (Authorization: Bearer JWT)
┌─────────────────────────────────────────────▼───────────────────────────────┐
│                     BACKEND (Node.js + Express) :3000                       │
│                                                                             │
│  app.mjs ── cors, swagger-ui (/api-docs)                                    │
│      │                                                                      │
│  ┌───▼───────── ROUTES ────────────┐   ┌───── MIDDLEWARES ──────────────┐   │
│  │ authRoutes      /api/auth       │──▶│ authMiddleware (verifica JWT)  │   │
│  │ eventsroutes    /api/events     │──▶│ verifyadmin   (rol admin)      │   │
│  │ reservationRoutes /api/reserv.  │   └────────────────────────────────┘   │
│  └───┬─────────────────────────────┘                                        │
│      │                                                                      │
│  ┌───▼──────────── CONTROLLERS ──────────────┐                              │
│  │ authController ─ event_controller         │                              │
│  │ reservation_controller (valida campos)    │                              │
│  └───┬───────────────────────┬───────────────┘                              │
│      │                       │                                              │
│  ┌───▼───── SERVICES ─────┐  │                                              │
│  │ authServices           │  │                                              │
│  │ reservationServices    │  │  (lógica de negocio: bcrypt,                 │
│  │  → JWT, bcryptjs       │  │   transacciones de tickets)                  │
│  └───┬────────────────────┘  │                                              │
│      │                       │                                              │
│  ┌───▼───────── MODELS ────▼──────────┐  ┌───────────────┐                  │
│  │ user_model / event_model /         │─▶│ config/       │                  │
│  │ reservation_model (SQL con mysql2) │  │ db_reserv.js  │                  │
│  └────────────────────────────────────┘  │ swagger.mjs   │                  │
│                                          └───────────────┘                  │
└─────────────────────────────────────────────┬───────────────────────────────┘
                                              │ mysql2/promise :3306
                        ┌─────────────────────▼────────────────────┐
                        │        MySQL 8.4 (contenedor db)         │
                        │  BD: reservations_db                     │
                        │  Tablas: users, events, reservations     │
                        │  init.sql + volumen mysql_data           │
                        └──────────────────────────────────────────┘
```

### Flujo de una petición (ejemplo: crear reserva)

1. Usuario en `reservation_user.jsx` → llama a `api/reservation.js` (axios).
2. Axios envía `POST /api/reservations` con el token JWT del `auth.jsx`.
3. `reservationRoutes` → `authMiddleware` valida el token → `reservation_controller` valida datos.
4. `reservationServices` aplica la lógica (verificar tickets disponibles).
5. `reservation_model` ejecuta el SQL vía `db_reserv.js` contra MySQL.
6. Respuesta JSON vuelve al frontend y React actualiza la UI.


## Dockerizacion

La aplicacion se compone de tres servicios:

- `db`: MySQL en el puerto `3306`.
- `backend`: API Express en el puerto `3000`.
- `frontend`: aplicacion React servida por Nginx en el puerto `5173`.

### Requisitos

- Docker Desktop instalado y ejecutandose.
- Docker Compose incluido en Docker Desktop.

### Ejecutar la aplicacion

Desde la carpeta raiz del proyecto (`Proyecto`), ejecutar:

```powershell
docker compose up -d --build
```

Abrir en el navegador:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api-docs

### Comprobar servicios

```powershell
docker compose ps
docker compose logs -f
```

MySQL utiliza el volumen `mysql_data` para conservar los datos. El archivo `database/init.sql` se ejecuta automaticamente cuando se crea una base nueva.

### Detener la aplicacion

```powershell
docker compose down
```

Este comando detiene los servicios sin eliminar el volumen de datos. No usar `docker compose down -v` salvo que se quiera borrar la base de datos de Docker.

## Notas

Recordar que las claves deben cambiarse por las que usted utilice, estas son solo claves de pruebas
