import './NavBar.css'

export default function NavBar({ puntos = 0, envases = 0 }) {

    return (
        <nav id="nav-main" className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <div id="titulo">
                   Eco-recycle
                </div>
                <button id="btn-toggle" className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" >
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
        </nav>

    )
}
