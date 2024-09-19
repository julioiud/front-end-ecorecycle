// file = Html5QrcodePlugin.jsx
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import './Html5QrcodePlugin.css'
import { obtenerPuntos } from '../../services/private/PuntajeService';
import { validarBarra } from '../../services/private/BarrasService';

const nombreData = "data"
//const puntosData = "puntos"

export default function Html5QrcodePlugin() {

    const media = useDevices()
    const [paused, setPaused] = useState(false)
    const [puntos, setPuntos] = useState(0)

    const [codigos, setCodigos] = useState([])

   /* const [latitud, setLatitud] = useState(0.0)
    const [longitud, setLongitud] = useState(0.0)
    const [qrCaneca, setQrCaneca] = useState('')*/

    const codigosAdmitidos = ["aztec", "code_128", "code_39", "code_93", "codabar", "databar", "databar_expanded", "data_matrix", "dx_film_edge", "ean_13", "ean_8", "itf", "maxi_code", "pdf417", "upc_a", "upc_e", "linear_codes", "matrix_codes"]

    const [leida, setLeida] = useState(false)

    useEffect(() => {
        console.log('entra html')
        setPaused(false)
        let storedData = JSON.parse(
            localStorage.getItem(nombreData)
        );

        /*let ptsData = JSON.parse(
            localStorage.getItem(puntosData)
        );*/
        
        setCodigos(storedData.codigos) 

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

        
        /*const getLocalizacion = () => {
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
            setLatitud(latitude)
            setLongitud(longitude)

            let storedData = JSON.parse(
                localStorage.getItem(nombreData)
            );

            storedData.latitud = latitude;
            storedData.longitud = longitude;

            localStorage.setItem(nombreData, JSON.stringify(storedData))
            console.log(JSON.parse(localStorage.getItem(nombreData)));
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
        getLocalizacion()*/
    }, [])

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    useEffect(() => {
        return () => {
            console.log('chao html');
            setPaused(true)
        };
    }, []);

    const onScan = async (result) => {
        console.log(result)
        if (result) {
            setLeida(true)
            await sleep(1000)
            let cod;
            const rawValue = result.length && result[0].rawValue ? result[0].rawValue : result;

            validarBarra(rawValue)
                .then(r => r.data)
                .then(r => {
                   if(!r.valido /*|| !r.noreciclado*/){
                    Swal.fire({
                        title: 'Informe Barra',
                        text: '¡Ojo, Barra no valida!, no sumará puntos',
                        icon: 'warning',
                        confirmButtonText: 'OK, lo entiendo'
                    })
                    return
                   }
                })
                .catch(e => {
                    console.log(e)
                })

            // Usamos la función de actualización de setCodigos para contar antes de agregar
            setCodigos((prevCodigos) => {
                if (prevCodigos.length >= 10) {
                    Swal.fire({
                        title: 'Reciclar material',
                        text: 'Te recomendamos ir reciclando en la caneca',
                        icon: 'warning',
                        confirmButtonText: 'OK, lo haré'
                    });
                }
                let cantidad = prevCodigos.reduce((contador, valorActual) =>
                    valorActual.serial === rawValue ? contador + 1 : contador, 0);

                if (cantidad >= 5) {
                    Swal.fire({
                        title: 'Elementos repetidos',
                        text: 'Estás intentado reciclar el mismo producto',
                        icon: 'warning',
                        confirmButtonText: 'OK'
                    })
                    const elementosFiltrados = [
                        ...prevCodigos.filter(elemento => elemento.serial !== rawValue),
                        ...prevCodigos.filter(elemento => elemento.serial === rawValue).slice(0, 1)
                    ];
                    
                    let storedData = JSON.parse(
                        localStorage.getItem(nombreData)
                    );
              
                    storedData.codigos = elementosFiltrados
                                  
                    localStorage.setItem(nombreData, JSON.stringify(storedData))
                    console.log(JSON.parse(localStorage.getItem(nombreData)))

                    return elementosFiltrados; // No actualizamos el estado si ya hay 5 o más
                }
                cod = { serial: rawValue };
    
                let storedData = JSON.parse(
                    localStorage.getItem(nombreData)
                );
          
                storedData.codigos = [...prevCodigos, cod]
                              
                localStorage.setItem(nombreData, JSON.stringify(storedData))
                console.log(JSON.parse(localStorage.getItem(nombreData)))
                return [...prevCodigos, cod];
            });
        }
        setLeida(false)
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
                Swal.fire({
                    title: 'Error de lectura',
                    text: 'No corresponde a un código válido',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
                console.log(err)
                //html5QrCode2.clear()
            });
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center mt-3">
                    <div className="col-sm-4 shadow p-3">
                        <h3 className='text-center'>
                            Escanea los códigos de Barras de tus envases
                        </h3>
                        <div className='text-center my-3'>
                            <button type="button" className="btn btn-primary mx-2">
                                <i className="fa-regular fa-trash-can"></i>
                                <span className={`badge ${leida ? "increase" : "decrease"}`}>{codigos.length}</span>
                                
                            </button>
                            <button type="button" className="btn btn-primary mx-2">
                                <i className="fa-solid fa-money-bill"></i>
                                <span className="badge bg-secondary">{puntos}</span>
                            </button>
                        </div>
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <button onClick={() => setPaused(false)} className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                                    Con camara
                                </button>
                                <button onClick={() => setPaused(true)} className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">
                                    Con Imagenes
                                </button>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabIndex="0">
                                {!paused && <Scanner
                                    paused={paused}
                                    onScan={onScan}
                                    scanDelay={2000}
                                    formats={codigosAdmitidos}
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