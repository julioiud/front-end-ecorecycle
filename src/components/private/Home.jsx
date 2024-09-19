import { useEffect, useState } from 'react'
import './Home.css'

const src = "/logo.jpg"

export default function Home() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        setLoading(false);
    };
  }, []);

  return (
    <div className='container'>
      <h3 className='text-center mt-3'>
        ¡Bienvenido!
      </h3>
      {loading
          ?
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          :
      <img 
        {...{ src }}
        className={`img img-fluid ${loading ? 'loading' : 'loaded'}`}
      />}
      <p className='text-center mt-3'>
        Eco-Recycle te ayuda a ayudar al medioambiente en tu escuela
      </p>
      <p>
        <small>
          <b>Aviso:</b> Para tu tranquilidad y privacidad, 
          Eco-recycle no almacena tus datos de ubicación ni 
          imagenes capturadas por la cámara de tu móvil.
          La ley también te protege
        </small>
      </p>
    </div>
  )
}
