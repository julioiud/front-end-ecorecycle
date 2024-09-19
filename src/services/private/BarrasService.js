import { axiosConfig } from "../../configuration/axiosConfig";

const headers = {
    'Content-Type': 'application/json'
};

export const guardarBarras = async (data) => {
    const token = sessionStorage.getItem('token')
    headers.token = token
    return await axiosConfig.post('/codigos',
                data,
                {
                    headers: headers
                }
            )
}


export const validarBarra = async (qr) => {
    const token = sessionStorage.getItem('token')
    headers.token = token
    return await axiosConfig.get('/codigos/'+qr,
                {
                    headers: headers
                }
            )
}