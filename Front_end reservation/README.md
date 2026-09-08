# Reservation App - Frontend

Aplicacion web para consultar eventos y gestionar reservas. Este proyecto contiene la interfaz de usuario desarrollada con React y se comunica con una API REST implementada en el backend.

## Funcionamiento general

## Arquitectura del frontend

Arquitectura basada en componentes con manejo de estado global por contextos y una capa dedicada al consumo de la API:

```text
┌────────────────────────────────────────────┐
│                 main.jsx                    │
│                    │                        │
│                 App.jsx                     │
│                    │                        │
│            AuthProvider (context)           │
│            - token JWT en localStorage      │
│            - datos del usuario              │
│                    │                        │
│              approuter.jsx                  │
│        ┌──────────┼──────────────┐          │
│        ▼          ▼              ▼          │
│   Rutas publicas  Rutas privadas (proteg.) │
│   - Login         - Menu principal          │
│   - Registro      - Crear/editar evento     │
│                   - Menu usuario + reservas │
│                        │                    │
│                        ▼                    │
│                   api/ (Axios)              │
│          envia Authorization: Bearer <JWT>  │
│                        │                    │
└────────────────────────┼────────────────────┘
                         ▼
            Backend REST (VITE_API_URL)
            http://localhost:3000/api
```

Capas principales:

- **`context/`**: contexto de autenticacion global. Persiste el token JWT en `localStorage` y expone el usuario y su rol al resto de la aplicacion.
- **`routes/`**: definicion de rutas con React Router. Las rutas privadas verifican autenticacion y tipo de usuario antes de renderizar.
- **`pages/`**: vistas principales (login, registro, menu, formularios de eventos, reservas del usuario).
- **`components/`**: componentes reutilizables (formularios, tarjetas de evento, navegacion).
- **`api/`**: encapsula las llamadas HTTP con Axios; unica capa que conoce la URL del backend (`VITE_API_URL`).

Flujo tipico:

1. El usuario inicia sesion; el backend responde con un JWT que se guarda en `localStorage`.
2. Axios adjunta el token automaticamente en cada solicitud protegida.
3. Segun el rol (`type_user`), el router muestra u oculta las acciones de administrador (crear, editar, eliminar eventos).
4. Las operaciones de eventos y reservas consumen los endpoints REST del backend y actualizan el estado de la interfaz.

## Ejecucion rapida (Docker)

Desde la carpeta raiz del proyecto:

```powershell
docker compose up -d --build
```

- Frontend: http://localhost:5173
- (El mismo comando levanta el backend y MySQL; ver README del backend.)

Para desarrollo local sin Docker: ver [Ejecucion en desarrollo](#ejecucion-en-desarrollo).


El frontend permite a los usuarios:

- Registrarse e iniciar sesion.
- Consultar la lista de eventos disponibles.
- Filtrar eventos.
- Consultar y crear reservas.
- Crear, editar y eliminar eventos cuando un usuario tiene permisos de administrador.

La autenticacion utiliza un token JWT entregado por el backend. El token se guarda en `localStorage` y Axios lo envia automaticamente en las solicitudes protegidas para su validacion.

## Funcionalidades principales

### Autenticacion

- Registro de usuarios.
- Inicio de sesion.
- Persistencia del token de autenticacion.
- Proteccion de rutas privadas.
- Control de acceso segun el tipo de usuario.

### Eventos

- Visualizacion de eventos.
- Busqueda y filtrado de eventos.
- Creacion de eventos para usuarios autorizados.
- Edicion de eventos existentes para usuarios autorizados.
- Eliminacion de eventos para usuarios autorizados.

### Reservas

- Consulta de reservas asociadas a un usuario.
- Creacion de nuevas reservas.
- Envio de datos al backend mediante Axios.

## Pantallas implementadas

- Inicio de sesion.
- Registro.
- Menu principal de usuario.
- Formulario de creacion de eventos.
- Formulario de edicion de eventos.
- Menu de usuario.
- Vista de reservas del usuario.

## Tecnologias utilizadas

- **React 19:** construccion de la interfaz mediante componentes reutilizables.
- **Vite:** servidor de desarrollo y herramienta de build.
- **React Router:** navegacion entre paginas y rutas protegidas.
- **Axios:** comunicacion con la API REST.
- **Tailwind CSS:** utilidades de estilos.
- **ESLint:** revision de calidad y consistencia del codigo.

## Estructura del proyecto

```text
src/
├── api/             # Funciones para consumir la API REST
├── assets/          # Recursos estaticos
├── components/      # Componentes reutilizables
├── context/         # Contextos globales, incluida la autenticacion
├── pages/           # Vistas principales
├── routes/          # Configuracion de rutas
├── App.jsx          # Componente principal
├── App.css          # Estilos de la aplicacion
├── index.css        # Estilos globales
└── main.jsx         # Punto de entrada
```

## Requisitos

- Node.js 22 o superior.
- pnpm 11.5.2 o npm equivalente.
- Backend ejecutandose y accesible desde el navegador.

## Instalacion

Desde la carpeta del frontend:

```powershell
pnpm install
```

Tambien se puede utilizar npm:

```powershell
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raiz del frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

`VITE_API_URL` define la URL base utilizada por Axios para comunicarse con el backend. Las variables utilizadas por Vite deben comenzar con `VITE_`.

No subas archivos `.env` con secretos al repositorio. Para una entrega publica, utiliza un archivo `.env.example` sin credenciales.

## Ejecucion en desarrollo

```powershell
pnpm dev
```

La aplicacion se abrira normalmente en:

```text
http://localhost:5173
```

## Build de produccion

Para generar los archivos optimizados:

```powershell
pnpm build
```

Para revisar localmente el build:

```powershell
pnpm preview
```

## Docker

El frontend incluye un `Dockerfile` que compila la aplicacion con Node.js y sirve el resultado con Nginx.

Desde la carpeta raiz de `Proyecto`, donde se encuentra `docker-compose.yml`:

```powershell
docker compose up -d --build
```

El frontend queda disponible en:

```text
http://localhost:5173
```

Para consultar el estado de los servicios:

```powershell
docker compose ps
```

Para detener los servicios sin borrar los datos de MySQL:

```powershell
docker compose down
```

## Validacion del proyecto

Ejecuta ESLint con:

```powershell
pnpm lint
```

Genera el build antes de crear el Pull Request:

```powershell
pnpm build
```

## Integracion con el backend

El frontend espera que el backend exponga sus rutas bajo el prefijo `/api`. La URL configurada por defecto es:

```text
http://localhost:3000/api
```

Si el backend se ejecuta en otra direccion o puerto, actualiza `VITE_API_URL` y vuelve a iniciar el servidor de desarrollo o a generar el build.

## Notas

Los puertos indicados en Docker Compose son valores por defecto. Puedes cambiar el puerto externo si el que aparece en la configuracion ya esta ocupado en tu equipo.

Por ejemplo, para publicar el frontend en el puerto `5174`:

```yaml
ports:
	- "5174:80"
```

El primer puerto (`5174`) es el puerto del equipo y el segundo (`80`) es el puerto interno del contenedor. En este caso, el frontend se abriria en:

```text
http://localhost:5174
```

Si cambias el puerto externo del backend, tambien debes actualizar `VITE_API_URL`, por ejemplo:

```env
VITE_API_URL=http://localhost:3001/api
```

Despues de cambiar una variable `VITE_`, reinicia el servidor o reconstruye la imagen:

```powershell
docker compose up -d --build
```
