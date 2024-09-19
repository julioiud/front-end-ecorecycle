import { Link, NavLink } from "react-router-dom";
import './OffCanvas.css'
import Swal from "sweetalert2";
import { logout } from "../../services/AuthService";

export default function OffCanvas({user = {nombre: 'Recycler'}}) {
   
    const salir = () => {
        Swal.fire({
            title: "Salir de Eco-recycle",
            text: "¿Seguro Deseas salir?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#024E50",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Salir"
        }).then((r) => {
            if (r.isConfirmed) {
                logout()
                window.location.reload();
            }
        })

    }

    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasRightLabel">
                    Hola <b id="nombre">{user.nombre ? user.nombre : 'Recycler'}</b>
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                    <NavLink className="nav-link" to="/pr/perfil">
                        <i className="fa-solid fa-user fa-2x"></i>  Perfil
                    </NavLink>

                    <a href={`https://reciclaje-sostenible-csjdelasalle.netlify.app/nosotros`} target="_blank" rel="noopener noreferrer" className="nav-link">
                        <i className="fa-solid fa-circle-info fa-2x"></i> Contacto
                    </a>

                    <a href={`https://docs.google.com/document/d/17AJqxgfYqc_hxmgRNSCoOL6l0IauXouX/edit`} target="_blank" rel="noopener noreferrer" className="nav-link">
                        <i className="fa-regular fa-envelope fa-2x"></i> Acerca de
                    </a>

                    <Link className="nav-link" onClick={salir}>
                        <i className="fa-solid fa-right-from-bracket fa-2x"></i> Salir
                    </Link>
                </ul>
                <span className="navbar-text">
                    Eco-recycle &copy; {new Date().getFullYear()}
                </span>
            </div>
        </div>
    )
}
