import { useState } from 'react'
import '../Styles/App.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="main-window">
        <h1>React</h1>
      </div>
    </>
  )
}

export default App
