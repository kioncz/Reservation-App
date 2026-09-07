import app from '../../app.mjs';
import pool from '../config/db_reserv.js';

// Configuración de prueba
const PORT = process.env.TEST_PORT || 3001;
const BASE = `http://localhost:${PORT}`;

// Datos temporales para el test
const ADMIN = { username: 'test_admin_evento', password: 'admin123', type_user: 1 };
const USER  = { username: 'test_user_evento',  password: 'user123',  type_user: 2 };

let server;

async function api(path, { method = 'GET', token, body } = {}) {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (body) headers['Content-Type'] = 'application/json';

    const res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    let data = null;
    try { data = await res.json(); } catch (e) {/* sin body JSON */}
    return { status: res.status, data };
}

async function login(username, password) {
    const { data } = await api('/api/auth/login', {
        method: 'POST',
        body: { username, password }
    });
    if (!data.token) throw new Error('Login falló');
    return data.token;
}

async function main() {
    let testEventId = null;

    try {
        // 1) Levantar servidor de prueba
        server = app.listen(PORT);
        console.log(`🔧 Servidor de test en ${BASE}\n`);

        // 2) Limpiar por si quedó algo de una corrida anterior
        await pool.query('DELETE FROM `user` WHERE User_Name IN (?, ?)', [ADMIN.username, USER.username]);
        await pool.query('DELETE FROM events WHERE name_event LIKE ?', ['Test_%']);

        // 3) Crear usuario admin y usuario normal
        await api('/api/auth/register', { method: 'POST', body: ADMIN });
        await api('/api/auth/register', { method: 'POST', body: USER });
        console.log('✅ Admin y usuario normal creados.\n');

        // 4) Login de ambos
        const adminToken = await login(ADMIN.username, ADMIN.password);
        const userToken  = await login(USER.username, USER.password);
        console.log('✅ Login admin OK, token obtenido.');
        console.log('✅ Login user OK, token obtenido.\n');

        // 5) ADMIN intenta crear un evento -> debe funcionar (201)
        const eventData = {
            name: 'Test_Evento_Admin',
            description: 'Evento creado por admin en test',
            location: 'Auditorio central',
            date: '2026-06-15',
            hour: '20:00:00',
            total_tickets: 100,
            available_tickets: 100
        };
        const creado = await api('/api/events', { method: 'POST', token: adminToken, body: eventData });
        console.log(`--- POST /api/events con ADMIN -> HTTP ${creado.status}`);
        if (creado.status === 201 && creado.data.event) {
            testEventId = creado.data.event.id_event;
            console.log('✅ ADMIN pudo crear el evento:', JSON.stringify(creado.data.event));
        } else {
            throw new Error('❌ El admin NO pudo crear el evento (status ' + creado.status + ')');
        }
        if (creado.data.event.location !== eventData.location ||
            creado.data.event.total_tickets !== eventData.total_tickets ||
            creado.data.event.available_tickets !== eventData.available_tickets) {
            throw new Error('❌ La respuesta no contiene correctamente los nuevos campos del evento');
        }
        console.log('');

        // 6) USUARIO NORMAL intenta crear un evento -> debe fallar (403)
        const rechazado = await api('/api/events', { method: 'POST', token: userToken, body: eventData });
        console.log(`--- POST /api/events con USUARIO NORMAL -> HTTP ${rechazado.status}`);
        if (rechazado.status === 403) {
            console.log('✅ El usuario normal fue bloqueado (403) como debe ser.');
        } else {
            throw new Error('❌ El usuario normal NO fue bloqueado (status ' + rechazado.status + ')');
        }
        console.log('');

        // 7) Verificar que solo quedó el evento del admin en la BD
        const [persistidos] = await pool.query(
            "SELECT id_event, name_event FROM events WHERE name_event LIKE 'Test_%'"
        );
        console.log(`--- Eventos 'Test_%' en BD: ${persistidos.length}`);
        if (persistidos.length === 1) {
            console.log('✅ Correcto: el usuario normal no dejó registrado ningún evento.');
        } else {
            throw new Error(`❌ Se esperaba 1 evento, hay ${persistidos.length}`);
        }

        console.log('\n🎉 TEST COMPLETADO: verifyadmin protege createEvent correctamente.');

    } catch (error) {
        console.error('\n❌ ERROR en el test:', error.message);
        process.exitCode = 1;
    } finally {
        // Limpiar datos de prueba
        try {
            await pool.query('DELETE FROM `user` WHERE User_Name IN (?, ?)', [ADMIN.username, USER.username]);
            await pool.query('DELETE FROM events WHERE name_event LIKE ?', ['Test_%']);
            console.log('\n🧹 Datos de prueba eliminados.');
        } catch (e) {
            console.log('(no se pudo limpiar:', e.message + ')');
        }

        server?.close(); // Cerrar el servidor
        await pool.end(); // Cerrar el pool para que Node termine
    }
}

main();