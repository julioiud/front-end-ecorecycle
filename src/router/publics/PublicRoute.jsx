import { useContext } from 'react'
import { AuthContext } from '../../auth/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {

    const { user } = useContext(AuthContext);
    
    return (!user.logged)
        ? children
        : <Navigate to='/pr/home'/>
}
