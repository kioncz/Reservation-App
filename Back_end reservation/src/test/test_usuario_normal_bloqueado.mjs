import app from '../../app.mjs';
import pool from '../config/db_reserv.js';

const PORT = process.env.TEST_PORT || 3003;
const BASE = `http://localhost:${PORT}`;

const ADMIN = { username: 't_admin_noperm', password: 'admin123', type_user: 1 };
const USER  = { username: 't_user_noperm',  password: 'user123',  type_user: 2 };

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

const evento = { name: 'Test_Sin_Permiso', description: 'debe fallar para user normal', date: '2026-11-01', hour: '15:00:00' };

async function main() {
    try {
        server = app.listen(PORT);
        console.log(`🔧 Servidor en ${BASE}\n`);

        await pool.query('DELETE FROM `user` WHERE User_Name IN (?, ?)', [ADMIN.username, USER.username]);
        await pool.query("DELETE FROM events WHERE name_event = ?", [evento.name]);

        // login user normal
        await api('/api/auth/register', { method: 'POST', body: USER });
        const userToken = await login(USER.username, USER.password);
        console.log('✅ Usuario NORMAL logueado (type_user=2).\n');

        // Intento de crear evento con user normal
        console.log('--- POST /api/events con USUARIO NORMAL ---');
        const r = await api('/api/events', { method: 'POST', token: userToken, body: evento });
        console.log(`HTTP ${r.status}: ${JSON.stringify(r.data)}`);

        const bloqueado = r.status === 403;
        console.log(`\n${bloqueado ? '✅ CONFIRMADO: el usuario normal NO puede crear eventos (403).' : '❌ PROBLEMA: el usuario normal SÍ pudo (status ' + r.status + ').'}`);

        // Confirmar que no se guardó en BD
        const [persistidos] = await pool.query('SELECT COUNT(*) AS n FROM events WHERE name_event = ?', [evento.name]);
        console.log(`Eventos 'Test_Sin_Permiso' en BD: ${persistidos[0].n} (debe ser 0)`);

        if (!bloqueado || persistidos[0].n !== 0) process.exitCode = 1;

    } catch (error) {
        console.error('\n❌ ERROR en el test:', error.message);
        process.exitCode = 1;
    } finally {
        try {
            await pool.query('DELETE FROM `user` WHERE User_Name IN (?, ?)', [ADMIN.username, USER.username]);
            await pool.query("DELETE FROM events WHERE name_event = ?", [evento.name]);
            console.log('\n🧹 Datos de prueba eliminados.');
        } catch (e) { console.log('(no se pudo limpiar: ' + e.message + ')'); }
        server?.close();
        await pool.end();
    }
}

main();