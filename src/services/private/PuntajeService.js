import { axiosConfig } from "../../configuration/axiosConfig";

const headers = {
    'Content-Type': 'application/json'
};

export const obtenerPuntos = async () => {
    const token = sessionStorage.getItem('token')
    headers.token = token
    return await axiosConfig.get('/puntajes/puntos',
                {
                    headers: headers
                }
            )
}

export const obtenerPuntajes = async () => {
    const token = sessionStorage.getItem('token')
    headers.token = token
    return await axiosConfig.get('/puntajes',
        {
            headers: headers
        }
    )
}


