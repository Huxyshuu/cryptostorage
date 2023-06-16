import React from 'react'
import '../Styles/Sidebar.scss'

interface props {
    tab: string,
    setTab: React.Dispatch<React.SetStateAction<string>>

}

function Sidebar({tab, setTab}:props) {
    console.log(tab)

    

  return (
    <div className="sidebar">
        <div className="profile">
            <img src="https://wiki.kerbalspaceprogram.com/images/thumb/4/4e/Kerbal_mostly_naked.jpg/300px-Kerbal_mostly_naked.jpg" alt="kerb" />
            <p>Hello, Hugo</p>
        </div>
        <div className="buttons">
            <p onClick={() => setTab("overview")}>Overview</p>
            <p onClick={() => setTab("transactions")}>Transactions</p>
            <p onClick={() => setTab("storage")}>Storage</p>
            <p onClick={() => setTab("database")}>Database</p>
            <p onClick={() => setTab("market")}>Market</p>
            
        </div>
        <div className="footer">
            <p className="setting">Settings</p>
            <p className="version">V1.0</p>
        </div>
        
    </div>
  )
}

export default Sidebar