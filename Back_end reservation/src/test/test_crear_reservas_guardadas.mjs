import app from '../../app.mjs';
import pool from '../config/db_reserv.js';

const PORT = process.env.TEST_PORT || 3005;
const BASE = `http://localhost:${PORT}`;

// Nuevos usuarios (admin y normal) - únicos para no chocar con los existentes
const NUEVO_ADMIN = { username: 'admin_2026', password: 'admin2026', type_user: 1 };
const NUEVO_USER  = { username: 'user_2026',  password: 'user2026',  type_user: 2 };

let server;

async function api(path, { method = 'GET', token, body } = {}) {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body) headers['Content-Type'] = 'application/json';
    const res = await fetch(`${BASE}${path}`, {
        method, headers, body: body ? JSON.stringify(body) : undefined
    });
    let data = null;
    try { data = await res.json(); } catch (e) {}
    return { status: res.status, data };
}

async function login(u, p) {
    const { data } = await api('/api/auth/login', { method: 'POST', body: { username: u, password: p } });
    if (!data.token) throw new Error(`Login falló para ${u}`);
    return data.token;
}

async function main() {
    try {
        server = app.listen(PORT);
        console.log(`🔧 Servidor en ${BASE}\n`);

        // Intentar crear ambos usuarios (si ya existen, no romper)
        const ra = await api('/api/auth/register', { method: 'POST', body: NUEVO_ADMIN });
        const ru = await api('/api/auth/register', { method: 'POST', body: NUEVO_USER });
        console.log(`Admin registro: HTTP ${ra.status} | User registro: HTTP ${ru.status}`);

        // Login para obtener ids reales
        const adminToken = await login(NUEVO_ADMIN.username, NUEVO_ADMIN.password);
        const userToken  = await login(NUEVO_USER.username, NUEVO_USER.password);

        const { data: profileAdmin } = await api('/api/auth/profile', { token: adminToken });
        const { data: profileUser }  = await api('/api/auth/profile', { token: userToken });
        const adminId = profileAdmin.user.id;
        const userId  = profileUser.user.id;
        console.log(`✅ Admin "admin_2026" (id ${adminId}) | User "user_2026" (id ${userId})\n`);

        // Obtener eventos disponibles
        const { data: events } = await api('/api/events');
        if (!events || events.length === 0) throw new Error('No hay eventos');
        const eventIds = events.map(e => e.id_event);

        // Generar reservaciones (persistidas) para cada usuario
        const reservasAdmin = [
            { evento: eventIds[0], cantidad: 3, fecha: '2026-11-05' },
            { evento: eventIds[1], cantidad: 2, fecha: '2026-11-10' },
            { evento: eventIds[2], cantidad: 1, fecha: '2026-11-15' }
        ];
        const reservasUser = [
            { evento: eventIds[3], cantidad: 4, fecha: '2026-11-20' },
            { evento: eventIds[4], cantidad: 2, fecha: '2026-11-22' }
        ];

        let totalId = null;
        const guardadas = [];

        async function crearReservas(idUser, lista, nombre) {
            console.log(`--- Creando reservas para ${nombre} (id_user ${idUser}) ---`);
            for (const r of lista) {
                const res = await api('/api/reservations', {
                    method: 'POST', token: adminToken,
                    body: { id_user: idUser, id_event: r.evento, date_reserv: r.fecha, amount: r.cantidad }
                });
                if (res.status !== 201 || !res.data.reservation) {
                    throw new Error(`Falló reserva para ${nombre}: HTTP ${res.status} ${JSON.stringify(res.data)}`);
                }
                const rr = res.data.reservation;
                totalId = rr.id_reser;
                guardadas.push(rr);
                console.log(`✅ evento=${rr.id_event} | cantidad=${rr.amount} | fecha=${rr.date_reserv} (id_reser ${rr.id_reser})`);
            }
            console.log('');
        }

        await crearReservas(adminId, reservasAdmin, 'admin_2026');
        await crearReservas(userId, reservasUser, 'user_2026');

        // Verificar que quedaron guardadas en BD
        const { data: todas } = await api('/api/reservations');
        console.log(`--- Total de reservas en BD: ${todas.length} ---`);
        console.log(`Reservas guardadas en este test: ${guardadas.length}`);

        console.log('\n🎉 Reservaciones creadas y GUARDADAS en la base de datos.');
        console.log(`Usuarios nuevos: admin_2026 (admin) y user_2026 (normal).`);

    } catch (error) {
        console.error('\n❌ ERROR en el test:', error.message);
        process.exitCode = 1;
    } finally {
        server?.close();
        await pool.end();
    }
}

main();