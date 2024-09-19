import { useEffect, useState } from "react"

export default function Perfil() {

  const [user, setUser] = useState({
    nombre : '',
    apellido: '',
    documento: '',
    email: '',
    grado: {},
    seccione: {}
  })

  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem('user'))
    if(usuario && usuario.logged) {
      setUser(user => usuario.user.usuarioBD)
    }
  }, [])

  return (
    <div className='container'>
      <h2 className='text-center my-3'>
        Tu Perfil
      </h2>
      <div className="card w-2">
        <img src="/profile.jpg" className="card-img-top" alt=""/>
          <div className="card-body">
            <h5 className="card-title">{user.nombre} {user.apellido ? user.apellido : ''}</h5>
            <p className="card-text"></p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">{user.email}</li>
            <li className="list-group-item">{user.documento}</li>
            <li className="list-group-item">Grado: <>{user.grado ? user.grado.nombre : ''}</><>{user.seccione ? ` - ${user.seccione.nombre}`: ''}</></li>
          </ul>
      </div>
    </div>
  )
}
