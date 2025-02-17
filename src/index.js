import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'


// Crea una radice React nel nodo DOM con id 'root'

const root = ReactDOM.createRoot(document.getElementById('root'))

/* Renderizza l'applicazione React all'interno del nodo radice
 React.StrictMode è un componente di utilità che evidenzia potenziali
 problemi nell'applicazione durante la fase di sviluppo */
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
