import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import tzlookup from "tz-lookup";
import { obtenerGrados, obtenerSecciones, obtenerTipoDoc, registrar } from "../../services/public/RegisterService";

const ZONE = "America/Bogota";

export default function Registro() {

  const [user, setUser] = useState({
   tipoDocumento: "",
   documento: "",
   email: "",
   contrasena: "",
   nombre: "",
   apellido: "",
   grado:"",
   seccione: "",
   genero: "N",
   terminos: false
  })

  const [secciones, setSecciones] = useState([])
  const [grados, setGrados] = useState([])
  const [tiposDoc, setTiposDoc] = useState([])
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const volver = () => {
    navigate('/login')
  }

  useEffect(() => {
    obtenerSecciones()
          .then(r => {
            setSecciones(r.data)
          })
          .catch(e => {
            console.log(e)
            Swal.close()
            Swal.fire({
              title: 'Error',
              text: 'Error al obtener secciones',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          })
  }, [])

  useEffect(() => {
    obtenerTipoDoc()
          .then(r => {
            setTiposDoc(r.data)
          })
          .catch(e => {
            console.log(e)
            Swal.close()
            Swal.fire({
              title: 'Error',
              text: 'Error al obtener tipos de documento',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          })
  }, [])

  useEffect(() => {
    obtenerGrados()
          .then(r => {
            setGrados(r.data)
          })
          .catch(e => {
            console.log(e)
            Swal.close()
            Swal.fire({
              title: 'Error',
              text: 'Error al obtener grados',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          })
  }, [])

  useEffect(() => {
    const getLocalizacion = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, errorPosition)
      } else {
        Swal.fire({
          title: 'Error navegador',
          text: 'Navegador no soporta la Geolocation',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    }
    const showPosition = (position) => {
      console.log(position)
      const { latitude, longitude } = position.coords;
      if (tzlookup(latitude, longitude) === ZONE) {
        console.log("En Colombia")
      } else {
        Swal.fire({
          title: 'Ubicación no permitida',
          text: 'Debes estar en Colombia para usar Eco-recycle',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result) {
           //   volver()
          }
        })
      }
    }

    const errorPosition = (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          Swal.fire({
            title: 'Permiso ubicación',
            text: 'Debe permitir su ubicación para el registro, recargue y permitala',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result) {
              volver()
            }
          })
          break;
        case error.POSITION_UNAVAILABLE:
          Swal.fire({
            title: 'Ubicación no disponible',
            text: 'La ubicación no está disponible.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
          break;
        case error.TIMEOUT:
          Swal.fire({
            title: 'Timeout',
            text: 'Se ha excedido el tiempo para obtener la ubicación',
            icon: 'error',
            confirmButtonText: 'OK'
          })
          break;
        case error.UNKNOWN_ERROR:
          Swal.fire({
            title: 'Error desconocido',
            text: 'Un error desconocido.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
          break;
      }
    }
    getLocalizacion()
  }, [])

  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeCheck = e => {
    setUser({
      ...user,
      [e.target.name] : e.target.checked
    })
  }

  const registrarse = e => {
    e.preventDefault()
    setLoading(true)
    registrar(user)
    .then(r => r.data)
    .then(r => {
      Swal.fire({
        title: "Registro exitoso!",
        text: `${r.nombre}, te has registrado correctamente, Ya puedes iniciar sesión`,
        icon: "success",
        confirmButtonColor: '#024E50'
      })
      setLoading(false)
    }).catch(e => {
      if(e.response) {
        const { data } = e.response;
        console.log(data);
        if (data.msg){
          setLoading(false)
          return Swal.fire('Error', data.msg, 'error')
        }
      }
      if(e.message){
        setLoading(false)
        return Swal.fire('Error', e.message, 'error')
      }
      setLoading(false)
      return Swal.fire('Error', 'Ha ocurrido un erros', 'error');
    })
  }

  return (
    <div className="pt-3 mt-5 container" id="pills-register" role="tabpanel" aria-labelledby="tab-register">

      <form className="form" onSubmit={registrarse}>
        <div className="contact-form">
          <div className="text-center mb-3">
            <p><b>Registrarme con:</b></p>
            <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
              <i className="fab fa-facebook-f"></i>
            </button>

            <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
              <i className="fab fa-google"></i>
            </button>

            <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
              <i className="fab fa-linkedin"></i>
            </button>
          </div>
          <div className="input-fields">
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="validationDefault01">Tipo Documento</label>
              <select 
                name="tipoDocumento"
                onChange={handleChange}
                className="form-select" 
                id="validationDefault01" 
                required
              >
                <option selected disabled value="">Seleccionar...</option>
                {
                  tiposDoc.map(t => 
                    <option key={t._id} value={t._id}>{t.descripcion}</option>
                  )
                }
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="validationDefault02" className="form-label">Número Documento</label>
              <input 
                name="documento"
                onChange={handleChange}
                type="text" 
                className="form-control" 
                id="validationDefault02" 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Correo Electrónico</label>
              <input 
                name="email"
                onChange={handleChange}
                type="email" 
                className="form-control" 
                id="exampleInputEmail1" 
                aria-describedby="emailHelp"
                required 
               />
              <div id="emailHelp " className="form-text "></div>
            </div>
            <div className="mb-3">
              <label htmlFor="validationDefault04" className="form-label">Contraseña</label>
              <input
                name="contrasena"
                onChange={handleChange}
                type="password" 
                className="form-control" 
                id="inputPassword4" 
                required 
              />
            </div>
            <div className="input-group ">
              <span htmlFor="validationCustom03 " className="input-group-text ">Nombre y Apellido</span>
              <input 
                name="nombre"
                onChange={handleChange}
                type="text" 
                aria-label="First name" 
                className="form-control" 
                id="validationCustom03"
                required 
              />
              <input 
                name="apellido"
                onChange={handleChange}
                type="text" 
                aria-label="Last name" 
                className="form-control" 
                id="validationCustom03" 
                required 
              />
            </div>
            <h1></h1>
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="validationDefault01">Grado</label>
              <select 
                name="grado"
                onChange={handleChange}
                className="form-select" 
                id="validationDefault01" 
              >
                <option selected disabled value="">Seleccionar...</option>
                {
                  grados.map(g => 
                    <option key={g._id} value={g._id}>{g.nombre}</option>
                  )
                }
              </select>
            </div>
            <h1></h1>
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="validationDefault01">Sección</label>
              <select 
                name="seccione"
                onChange={handleChange}
                className="form-select" 
                id="validationDefault01" 
              >
                <option selected disabled value="">Seleccionar...</option>
                {
                  secciones.map(s => 
                    <option key={s._id} value={s._id}>{s.nombre}</option>
                  )
                }
              </select>
            </div>
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="validationDefault01">Género</label>
              <select 
                name="genero"
                onChange={handleChange}
                className="form-select" 
                id="validationDefault01" 
                required
              >
                <option selected disabled value="N">Seleccionar...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>

            <div className="form-check d-flex justify-content-center mb-4">
              <input 
                className="form-check-input me-2" 
                type="checkbox" 
                name="terminos"
                onChange={handleChangeCheck}
                value={user.terminos}
                id="registerCheck"
                aria-describedby="registerCheckHelpText" 
              />
              <label className="form-check-label" htmlFor="registerCheck">
                He leído los términos y condiciones
              </label>
            </div>

            <div className="text-center text-lg-start mt-4 pt-2">
              <button
                  disabled={(loading ? true : false) || !user.terminos}
                  type="submit"
                  className="btn btn-primary btn-block mb-3 mx-3"
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>)}
                  Registrarme
                </button>
                <button onClick={volver} type="button" className="btn btn-secundary btn-block mb-3">Volver a Login</button>
            </div>
                
          </div>
        </div>
      </form >
    </div>
  )
}
