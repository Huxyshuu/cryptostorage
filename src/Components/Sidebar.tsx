import React from 'react'
import '../Styles/Sidebar.scss'

function Sidebar() {
  return (
    <div className="sidebar">
        <div className="profile">
            <img src="https://wiki.kerbalspaceprogram.com/images/thumb/4/4e/Kerbal_mostly_naked.jpg/300px-Kerbal_mostly_naked.jpg" alt="kerb" />
            <p>Hello, Hugo</p>
        </div>
        <div className="buttons">
            <p>Overview</p>
            <p>Transactions</p>
            <p>Storage</p>
            <p>Database</p>
            <p>Market</p>
            
        </div>
        <div className="footer">
            <p className="setting">Settings</p>
            <p className="version">V1.0</p>
        </div>
        
    </div>
  )
}

export default Sidebar