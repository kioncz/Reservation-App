//protege que se verifcieque los token de los usuarios que quieren acceder a las rutas privadas
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req, res, next) => {
    const header = req.headers['authorization']; 

    // El token debe venir como: Authorization: Bearer <token>
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }     

};

//verifica que el usuario sea admin para poder acceder a ciertas rutas
//type_user: 1 = admin, 2 = user
export const verifyadmin = (req, res, next) => {
    // req.user lo coloca authMiddleware (ya verificó el token antes)
    if (!req.user) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    if (req.user.type_user === 1) {
        next();
    } else {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};

