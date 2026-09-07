import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { getUserByUsername } from '../models/user_model.mjs';

dotenv.config();

export const loginUser = async (username, password) => {
    try {
        // Obtener el usuario por su nombre de usuario
        const user = await getUserByUsername(username);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        // Comparar la contraseña proporcionada con la contraseña encriptada
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            throw new Error('Contraseña incorrecta');
        }

        // Generar un token JWT
        const token = jwt.sign(
            { id: user.id_user, username: user.User_Name, type_user: user.type_user },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        return { token, user };
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};