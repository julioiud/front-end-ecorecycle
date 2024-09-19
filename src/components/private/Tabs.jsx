import { NavLink } from "react-router-dom";
import './Tabs.css'

export default function Tabs() {
    return (
        <nav id="tab-main" className="navbar fixed-bottom">
            <div className="container-fluid justify-content-center">
                <ul className="nav nav-pills text-center">
                    <NavLink
                        className="nav-link"
                        aria-current="page"
                        aria-label="Inicio"
                        to="/home"
                    >
                        <i className="fa-solid fa-house fa-xl"></i>
                    </NavLink>
                    <NavLink
                        className="nav-link"
                        aria-label="Reciclar"
                        to="/pr/reciclar"
                    >
                        <i className="fa-solid fa-recycle fa-xl"></i>
                    </NavLink>
                    <NavLink
                        className="nav-link"
                        aria-label="Scanear envases"
                        to="/pr/scanneo"
                    >
                        <i className="fa-solid fa-barcode fa-xl"></i>
                    </NavLink>
                    <NavLink
                        className="nav-link"
                        aria-label="Ver canecas"
                        to="/pr/canecas"
                    >
                        <i className="fa-solid fa-location-dot fa-xl"></i>
                    </NavLink>
                    <NavLink
                        className="nav-link"
                        aria-label="Puntos"
                        to="/pr/puntaje"
                    >
                        <i className="fa-solid fa-money-bill fa-xl"></i>
                    </NavLink>
                </ul>
            </div>
        </nav>
    )
}
