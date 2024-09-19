export const InfoUsers = {

    roleExiste(role) {
        if(sessionStorage.getItem('user') != null){
            const user = JSON.parse(sessionStorage.getItem('user'));
            
            if(user){
                if(user.usuarioBD){
                    const rol = user.usuarioBD.role;
                    const existe = rol.nombre === role;
                    return existe;
                }
                return false;
            }
            return false;
        }
        return false;
    },
};