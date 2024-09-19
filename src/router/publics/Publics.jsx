import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../../components/public/Login";
import RecuperarPassword from "../../components/public/RecuperarPassword";
import Registro from "../../components/public/Registro";
import NoFound from "../../components/public/NoFound";

export default function Public() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/recovery" element={<RecuperarPassword />} />
            <Route path="/register" element={<Registro />} />
            <Route path="*" element={<NoFound />} />
        </Routes>
    )
}

