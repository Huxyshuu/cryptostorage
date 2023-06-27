import { useState } from 'react'
import 'Styles/App.scss'
import Sidebar from 'Components/Sidebar.tsx'
import Database from 'Tabs/Database.tsx'
import Overview from 'Tabs/Overview.tsx'

function App() {
  const [tab, setTab] = useState("overview")

  const tabs = {
    overview: <Overview />,
    transactions: <h1>Transactions 🚧</h1>,
    storage: <h1>Storage 🚧</h1>,
    database: <Database />,
    market: <h1>Market 🚧</h1>,
    settings: <h1>Settings 🚧</h1>
  }

  return (
    <>
      <div id="main-window">
        <Sidebar tab={tab} setTab={setTab}/>
        <div id="content">
          <div id="sidebar-margin">-</div>
          <div id="main-content">
            {tabs[tab as keyof typeof tabs]} {/* Render different tabs */}
          </div>
        </div>
        
      </div>
    </>
  )
}

export default App
