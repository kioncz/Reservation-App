import { loginUser } from '../services/authServices.mjs';
import { createUser } from '../models/user_model.mjs';


export const login = async (req, res) => {
    const { username, password } = req.body;    

    try {
        const { token, user } = await loginUser(username, password);
        res.json({ token, user });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }   

};

export const register = async (req, res) => {
    const { username, password, type_user } = req.body;
    const ty = type_user ?? 2; // 1 = admin, 2 = user (por defecto user)

    try {
        const user = await createUser({ username, password, type_user: ty });
        res.status(201).json({ message: 'Usuario creado', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

