import { axiosConfig } from "../../configuration/axiosConfig";

const headers = {
    'Content-Type': 'application/json'
};

export const obtenerCanecas = async () => {
    const token = sessionStorage.getItem('token')
    headers.token = token
    return await axiosConfig.get('/canecas',
                {
                    headers: headers
                }
            )
}


export const validarQR = async (info) => {
    const token = sessionStorage.getItem('token')
    headers.token = token
    return await axiosConfig.get('/canecas/'+info,
                {
                    headers: headers
                }
            )
}