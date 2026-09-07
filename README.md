# Reservation App

## Documentación del proyecto

Este proyecto está compuesto por un backend y un frontend. La documentación específica sobre el funcionamiento, la configuración y las funcionalidades de cada parte se encuentra en el archivo `README.md` correspondiente dentro de las carpetas `Back_end reservation` y `Front_end reservation`.

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
