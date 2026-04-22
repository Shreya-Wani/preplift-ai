import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.scss'
import App from './App.jsx'
import { AuthProvider } from './features/auth/auth.content.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <App />
    </AuthProvider>
)
