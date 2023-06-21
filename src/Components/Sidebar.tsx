import React from 'react'
import 'Styles/Sidebar.scss'

interface props {
    tab: string,
    setTab: React.Dispatch<React.SetStateAction<string>>
}
const tabs: string[] = ['overview', 'transactions', 'storage', 'database', 'market'];


function Sidebar({tab, setTab}:props) {

  return (
    <div className="sidebar">
        <div className="profile">
            <img src="../../public/CryptoStorage.png" alt="kerb" />
            <p>Hello, Hugo</p>
        </div>
        <div className="buttons">

            {
                tabs.map((currentTab, index) => {
                    return <p className={`${tab == currentTab ? "active" : ""}`} 
                              onClick={() => setTab(currentTab)}
                              key={`sidebar-button-${index}`}
                           >{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</p>
                })
            }

        </div>
        <div className="footer">
            <p className={`setting ${tab == 'settings' ? "active" : ""}`} onClick={() => setTab("settings")}>Settings</p>
            <p className="version">V1.0</p>
        </div>
        
    </div>
  )
}

export default Sidebar