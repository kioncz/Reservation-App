import { createUser, getUserByUsername } from '../models/user_model.mjs';
import { loginUser } from '../services/authServices.mjs';
import pool from '../config/db_reserv.js';

// Datos del usuario de prueba
const TEST_USER = {
    username: 'test_automatizado',
    password: 'clave123',
    type_user: 2 // 1 = admin, 2 = user
};

async function probarAuth() {
    try {
        // 1) Asegurar que no exista un usuario previo (para que sea re-ejecutable)
        await pool.query('DELETE FROM `user` WHERE User_Name = ?', [TEST_USER.username]);
        console.log('🔧 Estado listo (usuario de prueba limpio).\n');

        // 2) Crear el usuario en la tabla `user`
        console.log('--- Paso 1: Crear usuario ---');
        const creado = await createUser(TEST_USER);
        console.log('✅ Usuario creado:', JSON.stringify(creado));

        // 3) Verificar que se guardó bien (password encriptada)
        console.log('\n--- Paso 2: Verificar en BD ---');
        const guardado = await getUserByUsername(TEST_USER.username);
        console.log('✅ Encontrado en BD:', JSON.stringify(guardado));
        console.log('ℹ️ Password en BD (debe verse encriptada):', guardado.Password);

        // 4) Login correcto -> genera token JWT
        console.log('\n--- Paso 3: Login correcto ---');
        const { token, user } = await loginUser(TEST_USER.username, TEST_USER.password);
        console.log('✅ Login OK, token:', token);
        console.log('✅ Datos del usuario:', JSON.stringify(user));

        // 5) Login con contraseña incorrecta -> debe fallar
        console.log('\n--- Paso 4: Login con contraseña incorrecta ---');
        try {
            await loginUser(TEST_USER.username, 'password_mal');
            console.log('❌ Debería haber fallado, pero no falló');
        } catch (e) {
            console.log('✅ Falló como se esperaba:', e.message);
        }

    } catch (error) {
        console.error('❌ Error en el test:', error.message);
    } finally {
        // Limpiar el usuario de prueba y cerrar el pool
        try {
            await pool.query('DELETE FROM `user` WHERE User_Name = ?', [TEST_USER.username]);
            console.log('\n🧹 Usuario de prueba eliminado.');
        } catch (e) {
            console.log('(no se pudo limpiar:', e.message + ')');
        }
        await pool.end(); // Cierra el pool para que Node termine la ejecución
    }
}

probarAuth();