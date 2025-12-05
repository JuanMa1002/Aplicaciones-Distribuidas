import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Hola, React</h1>
      <p>Esta es mi primera aplicación en React.</p>
      
      <button onClick={() => setCount((count) => count + 1)}>
        Contador: {count}
      </button>
    </div>
  )
}
export default App
