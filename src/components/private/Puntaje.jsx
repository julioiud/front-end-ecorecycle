import { useEffect, useState } from 'react';
import { obtenerPuntajes } from '../../services/private/PuntajeService';
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import es from 'dayjs/locale/es'
dayjs.locale(es)

export default function Puntaje() {

  const [puntajes, setPuntajes] = useState([])

  useEffect(() => {
    Swal.fire({
      imageUrl: "/ajax-loader.gif",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        obtenerPuntajes()
          .then(r => {
            return r.data;
          })
          .then(r => {
            setPuntajes(r);
          })
          .then(() => {
            const timer = setTimeout(() => {
              Swal.close()
            }, 1000)
            return () => clearTimeout(timer)
          })
          .catch(e => {
            console.log(e)
            Swal.close()
            Swal.fire({
              title: 'Error',
              text: 'Error al obtener puntajes',
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

  return (
    <div className='container'>
      <div className='table-responsive my-3'>
        <h2 className='text-center my-3'>
          Tus puntos
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Fecha</th>
              <th scope="col">Basurero</th>
              <th scope="col">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {puntajes.map((p, index) =>
                <tr key={p._id}>
                  <th scope="row">{(index + 1)}</th>
                  <td>{dayjs(p.fechaCreacion).format('MMM D[,] YYYY')}</td>
                  <td>{p.caneca.ubicacion}</td>
                  <td>{p.puntos}</td>
                </tr>
              )
            }
            <tr>
              <th scope="row"></th>
              <td></td>
              <th scope="col">Total</th>
              <th scope="col">{puntajes.reduce((acumulador, actual) => acumulador + actual.puntos, 0)}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
