import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/auth.jsx'

//con la implementacion del router, se puede navegar entre diferentes paginas de 
// la aplicacion sin recargar la pagina completa, lo que mejora la experiencia del usuario 
// y permite una navegacion mas fluida.
createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<AuthProvider>'
		
			<App />
		</AuthProvider>
	</BrowserRouter>
)
