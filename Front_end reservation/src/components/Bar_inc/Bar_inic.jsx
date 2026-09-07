
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";

function Bar_inic() {
    const {isAdmin} = useAuth();

    return (
        <header className="flex flex-col gap-4 border-b border-orange-100 bg-white/95 px-4 py-5 shadow-[0_8px_24px_rgba(30,41,59,0.08)] md:flex-row md:items-center md:justify-between md:px-[max(1rem,calc((100vw-1180px)/2))]">
            <div className="min-w-0 md:min-w-57.5">
                <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-orange-700">
                    Reserva fácil
                </span>
                <h1 className="mt-1 text-lg font-extrabold leading-tight text-slate-800">
                    Tu próxima experiencia empieza aquí
                </h1>
            </div>
            <nav aria-label="Navegación principal">
                <ul className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                    {isAdmin && (
                        <li>
                            <Link className="block rounded-lg bg-orange-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-300" to="/create_event">  
                                Crear Evento
                            </Link>
                        </li>
                    )}
                    {!isAdmin && (
                    <li>
                        <Link className="bblock rounded-lg bg-orange-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-300" to="/consultar">
                            Consultar tus reservas
                        </Link>
                    </li>
                    )}
                    <li>
                        <Link className="block rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300" to="/login" onClick={() => localStorage.removeItem("token")}>
                            Cerrar sesión
                        </Link>
                    </li>

                </ul>
            </nav>
        </header>
    );
}


export default Bar_inic;
