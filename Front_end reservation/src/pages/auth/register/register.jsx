import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.jsx";
import { register } from "../../../api/authjwt.js";

function Register() {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSubmitting(true);    

        try {
            await register(username, password, roleId);
            await loginUser(username, password);
            navigate("/menu_user");
        } catch {
            setError("Error al registrar el usuario. Por favor, inténtelo de nuevo.");
        } finally {
            setSubmitting(false);
        }   

    }
    return (
        <div className="register-container">
            <div className="register-heading">
                <p className="event-eyebrow">Reserva fácil</p>
                <h1>Crear cuenta</h1>
                <p>Regístrate para comenzar a reservar.</p>
            </div>
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Usuario:</label>
            <input
                type="text"    

                id="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
            />  
            <label htmlFor="password">Contraseña:</label>
            <input
                type="password" 
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
            />  
            <label htmlFor="type_user">Tipo de usuario:</label>
            <select
                id="type_user"
                name="type_user"
                value={roleId}
                onChange={(event) => setRoleId(Number(event.target.value))}
                required
            >
                <option value="">Seleccione un tipo de usuario</option>
                <option value="1">Admin</option>
                <option value="2">Usuario</option>
            </select>
            
            {error && <p role="alert">{error}</p>}
            <button

                type="submit"
                disabled={submitting}
                className="register-submit-button"
                >
                {submitting ? "Registrando..." : "Registrar"}
            </button>   
            <button
                type="button"
                className="register-login-button"
                onClick={() => navigate("/login")}
            >
                Regresar al login
            </button>
            <p className="text-sm text-gray-500">
                Rol seleccionado: <strong>
                    {roleId === 1 ? "Admin (CRUD)" : roleId === 2 ? "Usuario (Solo Lectura)" : "Ninguno"}
                </strong>
            </p>
        </form>
    </div>
    );
}

export default Register;