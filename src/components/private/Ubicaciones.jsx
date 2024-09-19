import { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import Swal from "sweetalert2";
import { obtenerCanecas } from "../../services/private/CanecaService";

const nombreData = "data"

export default function Ubicaciones() {

  const [latitud, setLatitud] = useState(0.0)
  const [longitud, setLongitud] = useState(0.0)
  const [canecas, setCanecas] = useState([])
  const [map, setMap] = useState(null)
  const [maps, setMaps] = useState(null)

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
        break
    }
  }

  useEffect(() => {
    getLocalizacion()
    Swal.fire({
      imageUrl: "/ajax-loader.gif",
      timerProgressBar: true,
      background: 'transparent',
      didOpen: () => {
        Swal.showLoading();
        obtenerCanecas()
          .then(r => r.data)
          .then(r => {
            setCanecas(r)
          })
          .then(() => {
            const timer = setTimeout(() => {
              Swal.close()
            }, 1000)
            return () => clearTimeout(timer)
          })
          .catch(e => {
            Swal.close()
            console.log(e)
            Swal.fire({
              title: 'Error',
              text: 'Error al obtener canecas',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          })
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.close) {
        console.log("I was closed auto");
      }
    })
  }, [])

  useEffect(() => {
    // Este useEffect se ejecuta cada vez que canecas cambia
    if (map && maps) {
      renderCanecas(map, maps);
    }
  }, [canecas, map, maps])

  useEffect(() => {
    // Este useEffect se ejecuta cada vez que canecas cambia
    if (map && maps) {
      renderYo(map, maps);
    }
  }, [latitud, longitud])

  useEffect(() => {
    // Este useEffect se ejecuta cada vez que canecas cambia
    if (map && maps) {
      renderYo(map, maps);
    }
  }, [map, maps])



  const handleMap = (map, maps) => {
    setMap(map)
    setMaps(maps)
    renderYo(map, maps)
  }

  const renderYo = (map, maps) => {
    new maps.Marker({
      position: { lat: latitud, lng: longitud },
      map,
      title: 'Yo',
    })
  }

  const renderCanecas = (map, maps) => {
    canecas.map(can => {
      const timer = setTimeout(() => {
        const marker = new maps.Marker({
          position: { lat: can.latitud, lng: can.longitud },
          map,
          title: can.ubicacion,
          icon: {
            url: '/logo.jpg',
            scaledSize: new maps.Size(36, 36)
          }
        })
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitud},${longitud}&destination=${can.latitud},${can.longitud}`
        marker.addListener('click', () => {
          window.open(url, '_blank'); // Abrir la URL en una nueva pestaña
        })
      }, 1000)
      return () => clearTimeout(timer)
    })


  }

  const defaultProps = {
    center: {
      lat: 6.2040175,
      lng: -75.5494032
    },
    zoom: 12
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '90vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleMap(map, maps)}
      >
      </GoogleMapReact>
    </div>
  )
}
