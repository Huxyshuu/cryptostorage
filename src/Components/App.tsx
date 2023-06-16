import { useState } from 'react'
import '../Styles/App.scss'
import Sidebar from '../Components/Sidebar.tsx'

function App() {
  const [tab, setTab] = useState("overview")

  return (
    <>
      <div id="main-window">
        <Sidebar tab={tab} setTab={setTab}/>
        <div id="main-content">
          <h1>Overview 🚧</h1>
        </div>
      </div>
    </>
  )
}

export default App
