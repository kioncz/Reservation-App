import { createContext, useContext, useEffect, useState } from 'react';
import { login } from '../api/authjwt.js';

const AuthContext = createContext(null);

// El JWT tiene tres partes separadas por puntos. La segunda parte contiene
// los datos del usuario, como type_user, y está codificada en Base64Url.
const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        return JSON.parse(atob(payload));
    } catch {
        return {};
    }
};

// Convertimos los datos del JWT en el usuario que usará toda la aplicación.
// Conservamos también el token para enviarlo en las peticiones Axios.
const getUserFromToken = (token) => ({
    ...decodeToken(token),
    token,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Al recargar, recuperamos el rol desde el token guardado.
            setUser(getUserFromToken(token));
        }
        setLoading(false);
    }, []);

    const loginUser = async (username, password) => {
        const data = await login(username, password);
        const token = data.token;
        const authenticatedUser = {
            ...data,
            // La respuesta del login trae el token; sus claims incluyen type_user.
            ...getUserFromToken(token),
        };
        setUser(authenticatedUser);
        return authenticatedUser;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // En el backend, type_user 1 representa administrador.
    const isAdmin = user?.role === 'admin' || Number(user?.type_user) === 1;

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);