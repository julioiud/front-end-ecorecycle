import { axiosConfig } from "../../configuration/axiosConfig";

const headers = {
    'Content-Type': 'application/json'
};

export const obtenerTipoDoc = async () => {
    return await axiosConfig.get('/tiposdoc',
                {
                    headers: headers
                }
            )
}

export const obtenerGrados = async () => {
    return await axiosConfig.get('/grados',
                {
                    headers: headers
                }
            )
}

export const obtenerSecciones = async () => {
    return await axiosConfig.get('/secciones',
                {
                    headers: headers
                }
            )
}


export const registrar = async (user) => {
    const data = {
        tipoDocumento: {
          _id: user.tipoDocumento
       },
       documento: user.documento,
       email: user.email,
       contrasena: user.contrasena,
       nombre: user.nombre,
       apellido: user.apellido,
       grado: {
           _id : user.grado
       },
       seccione: {
          _id : user.seccione
       },
       genero: user.genero
    }    
    return await axiosConfig.post(
            "/usuarios",
            data, 
            {
                headers: headers
            }
        );
}