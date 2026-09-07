//comectamoos el componente de inicio de sesion con la api para poder iniciar sesion en la aplicacion,
//y poder acceder a las diferentes funcionalidades de la aplicacion, como la reserva de habitaciones, 
//la gestion de usuarios, etc.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.jsx";

function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await loginUser(username, password);
      navigate("/menu_user");
    } catch {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-container">
        <div className="login-heading">
          <p className="event-eyebrow">Reserva fácil</p>
          <h1>Iniciar sesión</h1>
          <p>Accede para gestionar tus reservas.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
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

            {error && <p role="alert">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="login-submit-button"
            >
                {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="login-register-button"
            >
                No tengo cuenta, quiero registrarme
            </button>
        </form>
    </div>
  );
}


export default Login;