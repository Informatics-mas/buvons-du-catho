import React from 'react'
import ReactDOM from 'react-dom/client'
// Retrait du BrowserRouter ici car il est déjà dans App.jsx
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
)