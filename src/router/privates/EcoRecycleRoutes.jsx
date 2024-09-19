import OffCanvas from '../../components/private/OffCanvas'
import NavBar from '../../components/private/NavBar'
import { Route, Routes } from 'react-router-dom'
import Tabs from '../../components/private/Tabs'
import Perfil from '../../components/private/Perfil'
import Puntaje from '../../components/private/Puntaje'
import Ubicaciones from '../../components/private/Ubicaciones'
import Html5QrcodePlugin from '../../components/private/Html5QrcodePlugin'
import Reciclaje from '../../components/private/Reciclaje'
import Home from '../../components/private/Home'
import NoFound from '../../components/public/NoFound'
import { useEffect, useState } from 'react'

const init = () => {
  return JSON.parse(sessionStorage.getItem('user'))
}

export default function EcoRecycleRoutes() {
  const [user, setUser] = useState({
    nombre: ''
})

useEffect(() => {
    const usuario = init()
    if (usuario && usuario.logged) {
        setUser(usuario.user.usuarioBD)
    }
}, [])

  return (
    <>
      <OffCanvas user={user}/>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/reciclar" element={<Reciclaje />} />
        <Route path="/scanneo" element={<Html5QrcodePlugin />} />
        <Route path="/canecas" element={<Ubicaciones />} />
        <Route path="/puntaje" element={<Puntaje />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/*" element={<NoFound />} />
      </Routes>
      <Tabs />
    </>
  )
}
