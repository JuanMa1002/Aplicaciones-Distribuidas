import { useEffect, useState } from 'react'
 
function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
 
  useEffect(() => {
    // Llamada a la API al montar el componente
    async function cargarUsuarios() {
      try {
        setCargando(true)
        setError(null)
 
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users')
 
        if (!respuesta.ok) {
          throw new Error('Error al obtener los usuarios')
        }
 
        const datos = await respuesta.json()
        setUsuarios(datos)
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }
 
    cargarUsuarios()
  }, []) // [] => solo se ejecuta una vez al cargar la página
 
  if (cargando) {
    return <p>Cargando usuarios...</p>
  }
 
  if (error) {
    return <p>Ocurrió un error: {error}</p>
  }
 
  return (
    <div>
      <h1>Usuarios (desde API)</h1>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            <strong>{usuario.name}</strong> — {usuario.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
 
export default Usuarios
