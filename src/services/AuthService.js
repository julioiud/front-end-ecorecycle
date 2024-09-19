import { axiosConfig } from "../configuration/axiosConfig";

const headers = {
    'Content-Type': 'application/json'
};

export const login = async (user) => {
        const data = {
            email: user.username,
            contrasena: user.password
        }
        return await axiosConfig.post(
                process.env.REACT_APP_AUTH_URL,
                data, 
                {
                    headers: headers
                }
            );
}

export const logout = () => {
    console.log('logout auth service')
    localStorage.clear()
    sessionStorage.clear();
}