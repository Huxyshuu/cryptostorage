import { useState } from 'react'
import '../Styles/App.scss'
import Sidebar from '../Components/Sidebar.tsx'

function App() {
  const [tab, setTab] = useState("overview")

  const tabs = {
    overview: <h1>Overview 🚧</h1>,
    transactions: <h1>Transactions 🚧</h1>,
    storage: <h1>Storage 🚧</h1>,
    database: <h1>Database 🚧</h1>,
    market: <h1>Market 🚧</h1>,
    settings: <h1>Settings 🚧</h1>
  }

  return (
    <>
      <div id="main-window">
        <Sidebar tab={tab} setTab={setTab}/>
        <div id="main-content">
          {tabs[tab as keyof typeof tabs]} // Render different tabs
        </div>
      </div>
    </>
  )
}

export default App
