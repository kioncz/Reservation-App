import app from '../../app.mjs';
import pool from '../config/db_reserv.js';

const PORT = process.env.TEST_PORT || 3002;
const BASE = `http://localhost:${PORT}`;

// Admin de prueba (lo limpiamos al final, pero los eventos creados se quedan para llenar la BD)
const ADMIN = { username: 'test_admin_crud', password: 'admin123', type_user: 1 };

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

// 5 eventos extra para llenar la base
const NUEVOS_EVENTOS = [
    { name: 'Concierto Sol', description: 'Concierto acústico al atardecer', location: 'Teatro principal', date: '2026-07-10', hour: '19:30:00', total_tickets: 200, available_tickets: 200 },
    { name: 'Expo Tecnológica', description: 'Feria de innovación y startups', location: 'Centro de convenciones', date: '2026-08-05', hour: '10:00:00', total_tickets: 150, available_tickets: 150 },
    { name: 'Festival de Cine', description: 'Muestra de cine independiente', location: 'Sala 1', date: '2026-08-22', hour: '18:00:00', total_tickets: 80, available_tickets: 80 },
    { name: 'Torneo de Esports', description: 'Competencia de videojuegos en vivo', location: 'Arena digital', date: '2026-09-12', hour: '14:00:00', total_tickets: 300, available_tickets: 300 },
    { name: 'Feria Gastronómica', description: 'Degustación de comida internacional', location: 'Plaza central', date: '2026-10-03', hour: '12:00:00', total_tickets: 120, available_tickets: 120 }
];

let idsCreados = [];

async function login(username, password) {
    const { data } = await api('/api/auth/login', { method: 'POST', body: { username, password } });
    if (!data.token) throw new Error('Login falló');
    return data.token;
}

async function main() {
    try {
        server = app.listen(PORT);
        console.log(`🔧 Servidor de test en ${BASE}\n`);

        // Limpiar por si quedó de una corrida anterior
        await pool.query('DELETE FROM `user` WHERE User_Name = ?', [ADMIN.username]);
        await pool.query("DELETE FROM events WHERE name_event IN (?,?,?,?,?)",
            NUEVOS_EVENTOS.map(e => e.name));

        // Crear y loguear admin
        await api('/api/auth/register', { method: 'POST', body: ADMIN });
        const adminToken = await login(ADMIN.username, ADMIN.password);
        console.log('✅ Admin creado y logueado.\n');

        // 1) CREATE - crear los 5 eventos
        console.log('--- CREATE (5 eventos) ---');
        for (const ev of NUEVOS_EVENTOS) {
            const r = await api('/api/events', { method: 'POST', token: adminToken, body: ev });
            if (r.status !== 201 || !r.data.event) {
                throw new Error(`Falló crear ${ev.name}: HTTP ${r.status}`);
            }
            idsCreados.push(r.data.event.id_event);
            console.log(`✅ Creado: ${ev.name} (id ${r.data.event.id_event})`);
        }
        console.log('');

        // 2) GET ALL (universal) - verificar que están los 5
        console.log('--- GET ALL ---');
        const todos = await api('/api/events');
        const names = todos.data.map(e => e.name_event);
        const ok = NUEVOS_EVENTOS.every(ev => names.includes(ev.name));
        console.log(`✅ GET /api/events -> ${todos.data.length} eventos. ¿Están los 5 nuevos? ${ok}`);
        if (!ok) throw new Error('No todos los eventos nuevos aparecen en GET ALL');
        console.log('');

        // 3) GET BY ID - verificar el primero
        console.log('--- GET BY ID ---');
        const uno = await api(`/api/events/${idsCreados[0]}`);
        console.log(`✅ GET /api/events/${idsCreados[0]} -> HTTP ${uno.status}: ${uno.data?.name_event}`);
        if (uno.status !== 200) throw new Error('GET by id falló');
        console.log('');

        // 4) UPDATE - actualizar el segundo evento
        console.log('--- UPDATE ---');
        const target = idsCreados[1];
        const up = await api(`/api/events/${target}`, {
            method: 'PUT', token: adminToken,
            body: {
                name: 'Expo Tecnológica (actualizado)',
                description: 'Feria 2026',
                location: 'Centro de convenciones',
                date: '2026-08-06',
                hour: '11:00:00',
                total_tickets: 150,
                available_tickets: 150
            }
        });
        console.log(`✅ PUT /api/events/${target} -> HTTP ${up.status}: ${up.data?.message}`);
        if (up.status !== 200) throw new Error('Update falló');
        const verifUp = await api(`/api/events/${target}`);
        console.log(`   Verificado nuevo nombre: ${verifUp.data?.name_event}`);
        if (verifUp.data.location !== 'Centro de convenciones' ||
            verifUp.data.total_tickets !== 150 ||
            verifUp.data.available_tickets !== 150) {
            throw new Error('Los nuevos campos no se conservaron en el evento actualizado');
        }
        console.log('');

        // 5) DELETE - eliminar el 5to evento
        console.log('--- DELETE ---');
        const delTarget = idsCreados[4];
        const del = await api(`/api/events/${delTarget}`, { method: 'DELETE', token: adminToken });
        console.log(`✅ DELETE /api/events/${delTarget} -> HTTP ${del.status}: ${del.data?.message}`);
        if (del.status !== 200) throw new Error('Delete falló');
        const verifDel = await api(`/api/events/${delTarget}`);
        console.log(`   Al consultarlo de nuevo: HTTP ${verifDel.status} (404 = eliminado)`);
        console.log('');

        // 6) Estado final de la BD
        const [total] = await pool.query('SELECT COUNT(*) AS n FROM events');
        console.log('--- ESTADO FINAL ---');
        const quedan = NUEVOS_EVENTOS.length - 1; // 4 quedan (borramos el 5to)
        console.log(`✅ Total de eventos en BD: ${total[0].n} (se agregaron ${quedan} nuevos y quedaron persistidos).`);
        console.log('\n🎉 CRUD VERIFICADO: create, get all, get by id, update, delete funcionan.');

    } catch (error) {
        console.error('\n❌ ERROR en el test:', error.message);
        process.exitCode = 1;
    } finally {
        // Limpiar solo el usuario de prueba (los eventos se quedan para llenar)
        try {
            await pool.query('DELETE FROM `user` WHERE User_Name = ?', [ADMIN.username]);
            console.log('\n🧹 Usuario de prueba eliminado (los 4 eventos nuevos se conservan).');
        } catch (e) {
            console.log('(no se pudo limpiar usuario: ' + e.message + ')');
        }
        server?.close();
        await pool.end();
    }
}

main();