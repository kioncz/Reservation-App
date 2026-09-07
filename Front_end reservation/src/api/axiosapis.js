import axios from "axios";


//create an instance of axios with default configuration
const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

//manejara las solicitudes HTTP a la API, incluyendo la autenticacion y el manejo de errores.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }   
);

export default api;