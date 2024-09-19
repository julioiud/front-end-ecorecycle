import AppRouter from "./router/AppRouter";
import './app.css'
import { useEffect } from "react";
import AuthProvider from "./auth/AuthProvider";

const nombreData = "data"
//const puntosData = "puntos"

const data = {
    "qrCaneca": null,
    "codigos": [],
    "latitud": 0.0,
    "longitud": 0.0
}

export default function App() {
  
  useEffect(() => {
    // TODO: CARGA INFO DESDE BBDD
    if(!localStorage.getItem(nombreData)){
      localStorage.setItem(nombreData, JSON.stringify(data))
    }
    /*if(!localStorage.getItem(puntosData)){
      localStorage.setItem(puntosData, 0);
    }*/
    
  }, [])

  return (
    <AuthProvider >
      <AppRouter />
    </AuthProvider>
  )
}
