import { useState } from 'react'
import '../Styles/App.scss'
import Sidebar from '../Components/Sidebar.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="main-window">
        <Sidebar />
        <div id="main-content">
          <h1>This area is currently under construction! 🚧</h1>
        </div>
      </div>
    </>
  )
}

export default App
