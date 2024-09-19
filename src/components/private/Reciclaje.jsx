// file = Html5QrcodePlugin.jsx
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import './Reciclaje.css'
import { obtenerPuntos } from '../../services/private/PuntajeService';
import { validarQR } from '../../services/private/CanecaService';
import { guardarBarras } from '../../services/private/BarrasService';

const nombreData = "data"

const data = {
  "qrCaneca": null,
  "codigos": [],
  "latitud": 0.0,
  "longitud": 0.0
}

//const puntosData = "puntos"

export default function Reciclaje() {

  const media = useDevices()
  const [pausedR, setPausedR] = useState(false)
  const [puntos, setPuntos] = useState(0)

  const [codigos, setCodigos] = useState([])

  const [qrCaneca, setQrCaneca] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return () => {
      console.log('chao');
      setPausedR(true)
    };
  }, []);

  useEffect(() => {

    console.log('entra');
    setPausedR(false)
    let storedData = JSON.parse(
      localStorage.getItem(nombreData)
    );

    setCodigos(storedData.codigos)

    if(storedData.codigos.length <= 0) {
      Swal.fire({
        title: 'Caneca vacía',
        text: 'No hay ningún envase para reciclar. Recolecta, escanea y vuelve',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
    }

    /*let puntos = JSON.parse(
      localStorage.getItem(puntosData)
    );*/

    obtenerPuntos()
      .then(r => r.data)
      .then(r => setPuntos(r.puntos))
      .catch(e => {
        console.log(e)
        Swal.fire({
          title: 'Error',
          text: 'Error al obtener puntos',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      })

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
      const { latitude, longitude } = position.coords;

      let storedData = JSON.parse(
        localStorage.getItem(nombreData)
      );

      storedData.latitud = latitude
      storedData.longitud = longitude

      localStorage.setItem(nombreData, JSON.stringify(storedData))
      console.log(JSON.parse(localStorage.getItem(nombreData)))
    }
    const errorPosition = (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          Swal.fire({
            title: 'Permiso ubicación',
            text: 'Debe permitir su ubicación, recargue y permitala',
            icon: 'error',
            confirmButtonText: 'OK'
          })
          break;
        case error.POSITION_UNAVAILABLE:
          // 
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

  const onScan = (result) => {
    if(codigos.length <= 0){
      Swal.fire({
        title: 'No hay barras',
        text: 'No hay ninguna barra para reciclar',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return
    }
    if (result) {
      const rawValue = result.length && result[0].rawValue ? result[0].rawValue : result
      let storedData = JSON.parse(
        localStorage.getItem(nombreData)
      )
      validarQR(rawValue)
        .then(r => r.data)
        .then(r => {
          if (r.existe) {
            storedData.qrCaneca = rawValue
            Swal.fire({
              title: "¿Desea almacenar la basura en la caneca?",
              text: "Confirma para obtener tus puntos",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#024E50",
              cancelButtonColor: "#d33",
              confirmButtonText: "Si, Reciclar"
            }).then((r) => {
              if (r.isConfirmed) {
                setLoading(true)
                guardarBarras(storedData)
                  .then(r => r.data)
                  .then(r => {
                    console.log(r)
                    obtenerPuntos()
                      .then(r => r.data)
                      .then(r => {
                        setPuntos(r.puntos)
                      })
                      .catch(e => {
                        setLoading(false)
                        console.log(e)
                        Swal.fire({
                          title: 'Error validación',
                          text: 'Error al intentar validar QR de Eco-recycle',
                          icon: 'error',
                          confirmButtonText: 'OK'
                        })
                    })
                    
                    Swal.fire({
                      title: "Basura reciclada",
                      text: "Ya tienes tus puntos",
                      icon: "success",
                      confirmButtonColor: '#024E50'
                    })
                    storedData.codigos = []
                    setCodigos(storedData.codigos)
                    storedData.qrCaneca = null
                    storedData.latitud = 0.0
                    storedData.longitud = 0.0
                    localStorage.setItem(nombreData, JSON.stringify(storedData));
                    setLoading(false)
                  })
                  .catch(e => {
                    setLoading(false)
                    console.log(e)
                    if(e.response) {
                      const { data } = e.response
                      Swal.fire({
                        title: 'Error',
                        text: data.msj,
                        icon: 'error',
                        confirmButtonText: 'OK'
                      })
                    }
                  })
              }
            })
            .catch(e => {
                setLoading(false)
                console.log(e)
                if(e.response) {
                  const { data } = e.response
                  Swal.fire({
                    title: 'Error',
                    text: data.msj,
                    icon: 'error',
                    confirmButtonText: 'OK'
                  })
                }
            })
          } else {
            setLoading(false)
            Swal.fire({
              title: 'QR NO válido',
              text: 'Este no es un QR válido de las canecas Eco-recycle',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
        })
        .catch(e => {
          setLoading(false)
          console.log(e)
          Swal.fire({
            title: 'QR NO válido',
            text: 'Este no es un QR válido de las canecas Eco-recycle',
            icon: 'error',
            confirmButtonText: 'OK'
          })
        })
    }
  }

  const handleFileSelected = (e) => {
    const html5QrCode2 = new Html5Qrcode("reader-file");
    html5QrCode2.scanFile(e.target.files[0], true)
      .then(onScan)
      .then(() => html5QrCode2.clear())
      .then(() => {
        e.target.value = null
      })
      .catch(err => {
        console.log(err)
        Swal.fire({
          title: 'Error de lectura',
          text: 'No corresponde a un código válido',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        //html5QrCode2.clear()
      });
  }

  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-3">
          <div className="col-sm-4 shadow p-3">
            <h3 className='text-center'>
              Escanea el QR del Basurero, y obtén tus puntos
            </h3>
            <p className='text-center'>
              Asegurate tener activado el GPS de tu dispositivo móvil y permitir a Eco-recycle acceder a la tu ubicación
              y a la cámara, para escanear
            </p>
            <div className="tab-content" id="nav-tabContent">
              <div className='text-center my-3'>
                {
                  loading 
                  ? 
                  <button className="btn btn-primary" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span role="status">Loading...</span>
                  </button>
                  :
                  <button type="button" className="btn btn-primary mx-2">
                    <i className="fa-regular fa-trash-can"></i>
                    <span className="badge bg-secondary">{codigos.length}</span>
                  </button>
                }
                <button type="button" className="btn btn-primary mx-2">
                  <i className="fa-solid fa-money-bill"></i>
                  <span className="badge bg-secondary">{puntos}</span>
                </button>
              </div>
              <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabIndex="0">
                {!pausedR && <Scanner
                  paused={pausedR}
                  onScan={onScan}
                  scanDelay={2000}
                  formats={["micro_qr_code", "qr_code", "rm_qr_code"]}
                  onError={(error) => console.log(error?.message)}
                  allowMultiple={true}
                  // constraints={{ advanced: { deviceId: selected } }}
                  components={{ onOff: true, finder: true, torch: true, zoom: false }}
                />}
              </div>
              <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabIndex="0">
                <div id="reader-file" width="w-100" height="600px" className="mt-2"></div>
                <input type="file" onChange={handleFileSelected} className="form-control" accept="image/*" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>)
}
