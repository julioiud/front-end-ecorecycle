import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import Swal from 'sweetalert2';
import { messages } from '../../utils/messages';
import { types } from '../../types/types';
import { login } from '../../services/AuthService';

export default function Login() {

  const history = useNavigate();

  const [enabled, setEnabled] = useState(false)
  const [off, setOff] = useState("off");
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const [req] = useState(true);
  const [usr, setUsr] = useState({
    username: '',
    password: '',
    captcha: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  })

  const [captchaValido, setCaptchaValido] = useState(false)

  useEffect(() => {
    setOff("off");
    loadCaptchaEnginge(6);
  }, [])


  const handleValidation = () => {
    let errors = {};
    let isValid = true;
    if (!usr.username) {
      isValid = false;
      errors["username"] = "Email requerido";
    } else
      if (typeof usr.username !== "undefined" && usr.username !== '') {
        let lastAtPos = usr.username.lastIndexOf('@');
        let lastDotPos = usr.username.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0
          && usr.username.indexOf('@@') === -1
          && lastDotPos > 2
          && (usr.username.length - lastDotPos) > 2)) {
          isValid = false;
          errors["username"] = "Email no válido";
        }
      } else {
        errors["username"] = "";
      }

    if (!usr.password) {
      isValid = false;
      errors["password"] = "Contraseña requerida";
    } else {
      errors["password"] = "";
    }

    // valida captcha
    let user_captcha = usr.captcha;

    if (validateCaptcha(user_captcha) === true) {
      setCaptchaValido(true)
    } else {
      isValid = false;
      setCaptchaValido(false)
      Swal.fire('Error', "Captcha invalido", 'error');
      loadCaptchaEnginge(6);
    }

    setErrors({ ...errors });
    return isValid;
  }

  const sendLogin = e => {
    e.preventDefault()
    if (handleValidation()) {
      setLoading(true);
      login(usr)
        .then(r => {
          const lastPath = localStorage.getItem('lastPath') || '/pr/home';
          dispatch({
            type: types.login,
            payload: {
              user: r.data
            }
          });
          history(lastPath, { replace: true })
          setLoading(false)
        })
        .catch(e => {
          console.log(e)
          if(e.message){
            setLoading(false)
            return Swal.fire('Error', e.message, 'error')
          }
          if(e.response) {
            const { data } = e.response;
            console.log(data);
            if (data.msg){
              setLoading(false)
              return Swal.fire('Error', data.msg, 'error')
            }
          }
          setLoading(false)
          return Swal.fire('Error', messages.CREDS_INVALIDAS, 'error');
        });
    }
  }

  const handleChange = e => {
    setUsr({
      ...usr,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <img src="/logo.jpg"
            className="d-block img img-fluid img-thumbnail radius" alt="Logo" />
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={sendLogin}>
              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                <p className="lead fw-normal mb-0 me-3">Ingresar con</p>
                <button type="button" className="btn btn-primary mx-1 radius">
                  <i className="fab fa-facebook-f fa-lg"></i>
                </button>

                <button type="button" className="btn btn-primary mx-1 radius">
                  <i className="fab fa-google fa-lg"></i>
                </button>

                <button type="button" className="btn btn-primary mx-1 radius">
                  <i className="fab fa-linkedin-in fa-lg"></i>
                </button>
              </div>

              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">Ó</p>
              </div>

              <div className="form-floating mb-3">
                <input
                  autoComplete={off}
                  name="username"
                  onChange={handleChange}
                  required={req}
                  type="email"
                  id="form3Example3"
                  className="form-control"
                  placeholder="Ingrese un e-mail válido"
                />
                <label
                  className="form-label"
                  htmlFor="form3Example3"
                >
                  Email
                </label>
              </div>

              <div className="form-floating mb-3">
                <input
                  autoComplete="new-password"
                  name="password"
                  onChange={handleChange}
                  required={req}
                  type="password"
                  id="form3Example4"
                  className="form-control"
                  placeholder="Ingrese password"
                />
                <label className="form-label" htmlFor="form3Example4">Contraseña</label>
              </div>

              <div className="d-flex justify-content-between align-items-center">


                <LoadCanvasTemplateNoReload />
                <div className="form-floating mx-1">
                  <input
                    name="captcha"
                    onChange={handleChange}
                    required={req}
                    type="text"
                    id="form3Example5"
                    className="form-control"
                    placeholder="Ingresa captcha"
                  />
                  <label className="form-label" htmlFor="form3Example5">Captcha</label>
                </div>
                <div>
                  <Link to='/recovery' className="text-body">¿Olvidaste contraseña?</Link>
                </div>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  disabled={(loading ? true : false) || (usr.username.length == 0 || usr.password.length == 0)}
                  type="submit"
                  className="btn btn-primary btn-lg"
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>)}
                  Ingresar
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">¿No tienes cuenta?
                  <Link to='/register' className="link-danger">  Regístrate</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
