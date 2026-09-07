import app from '../../app.mjs';
import pool from '../config/db_reserv.js';

const PORT = process.env.TEST_PORT || 3004;
const BASE = `http://localhost:${PORT}`;

const USER = { username: 'test_reservador', password: 'res123', type_user: 2 };

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
    if (!data.token) throw new Error('Login falló');
    return data.token;
}

// Número aleatorio de reservas entre 2 y 6
const NUM_RESERVAS = Math.floor(Math.random() * 5) + 2;

async function main() {
    let reservaIds = [];
    try {
        server = app.listen(PORT);
        console.log(`🔧 Servidor en ${BASE}\n`);

        // Limpiar
        await pool.query('DELETE FROM `user` WHERE User_Name = ?', [USER.username]);
        await pool.query("DELETE FROM reservation WHERE id_user IS NULL");

        // Crear y loguear usuario
        await api('/api/auth/register', { method: 'POST', body: USER });
        const lopToken = await login(USER.username, USER.password);
        const { data: userData } = await api('/api/auth/profile', { token: lopToken });
        const userId = userData.user.id;

        // Obtener ids de eventos reales
        const { data: events } = await api('/api/events');
        if (!events || events.length === 0) throw new Error('No hay eventos para reservar');
        const eventIds = events.map(e => e.id_event);

        console.log(`✅ Usuario (id ${userId}) logueado. ${events.length} eventos disponibles.`);

        // Crear N reservas con ids de eventos reales y cantidad aleatoria
        console.log(`\n--- Creando ${NUM_RESERVAS} reservas (cantidad aleatoria) ---`);
        for (let i = 0; i < NUM_RESERVAS; i++) {
            const id_event = eventIds[Math.floor(Math.random() * eventIds.length)];
            const amount = Math.floor(Math.random() * 5) + 1; // 1 a 5
            const date_reserv = `2026-${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}-${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}`;

            const r = await api('/api/reservations', {
                method: 'POST', token: lopToken,
                body: { id_user: userId, id_event, date_reserv, amount }
            });
            if (r.status !== 201 || !r.data.reservation) {
                throw new Error(`Falló reserva ${i+1}: HTTP ${r.status} ${JSON.stringify(r.data)}`);
            }
            const res = r.data.reservation;
            reservaIds.push(res.id_reser);
            console.log(`✅ Reserva ${i+1}: evento=${res.id_event} | cantidad=${res.amount} | fecha=${res.date_reserv} (id_reser ${res.id_reser})`);
        }
        console.log('');

        // Verificar que se crearon todas en la BD
        const { data: todas } = await api('/api/reservations');
        console.log(`--- Total reservas en BD: ${todas.length} ---`);

        // Verificar reservas del usuario
        const { data: misReservas } = await api(`/api/reservations/${userId}`);
        console.log(`--- Reservas del usuario ${userId}: ${misReservas.length} ---`);

        const ok = misReservas.length === reservaIds.length;
        console.log(`\n${ok ? '✅ TEST COMPLETADO: la creación de reservaciones funciona.' : '❌ No coinciden las reservas creadas.'}`);
        if (!ok) process.exitCode = 1;

    } catch (error) {
        console.error('\n❌ ERROR en el test:', error.message);
        process.exitCode = 1;
    } finally {
        // Limpiar: borrar las reservas creadas y el usuario de prueba
        try {
            await pool.query('DELETE FROM `user` WHERE User_Name = ?', [USER.username]);
            if (reservaIds.length) {
                const marks = reservaIds.map(() => '?').join(',');
                await pool.query(`DELETE FROM reservation WHERE id_reser IN (${marks})`, reservaIds);
            }
            console.log('\n🧹 Usuario y reservas de prueba eliminados.');
        } catch (e) {
            console.log('(no se pudo limpiar: ' + e.message + ')');
        }
        server?.close();
        await pool.end();
    }
}

main();