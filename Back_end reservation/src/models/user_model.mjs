import pool from '../config/db_reserv.js';
import bcrypt from 'bcryptjs';

// Función para crear el usuario (con password encriptada y tipo de usuario)
// type_user: 1 = admin, 2 = user (referencia a user_type.id_userty)
export const createUser = async (userData) => {
    try {
        const { username, password, type_user } = userData;

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO `user` (User_Name, Password, type_user) VALUES (?, ?, ?)',
            [username, hashedPassword, type_user]
        );
        return { id: result.insertId, username, type_user };
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
};

// Función para obtener un usuario por su nombre de usuario
export const getUserByUsername = async (username) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM `user` WHERE User_Name = ?',
            [username]
        );
        return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};  

