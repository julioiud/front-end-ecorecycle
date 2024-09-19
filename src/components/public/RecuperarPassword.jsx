import { Link, useNavigate } from "react-router-dom"

export default function RecuperarPassword() {

    const navigate = useNavigate()

    const irHome = () => {
        navigate('/login')
    }
    return (
        <section className="vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form>
                            <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                                <p className="lead fw-normal mb-0 me-3">Recuperar Contraseña</p>
                            </div>

                            <div className="divider d-flex align-items-center my-4">
                                <p className="text-center fw-bold mx-3 mb-0"></p>
                            </div>

                            <div className="form-floating mb-3">
                                <input type="email" id="form3Example3" className="form-control"
                                    placeholder="Enter a valid email address" />
                                <label className="form-label" htmlFor="form3Example3">Email</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input type="password" id="form3Example4" className="form-control"
                                    placeholder="Enter password" />
                                <label className="form-label" htmlFor="form3Example4">Contraseña</label>
                            </div>
                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg"
                                    onClick={irHome}
                                >Recuperar
                                </button>
                                <p className="small fw-bold mt-2 pt-1 mb-0">¿Ya recuerdas tu contraseña?
                                    <Link to='/login' className="link-danger">  Volver a Login</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
