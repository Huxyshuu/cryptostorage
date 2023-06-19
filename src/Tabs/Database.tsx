import React from 'react'
import 'Styles/Database.scss'

function Database() {
  return (
    <div className="content database">
        <h1>Database</h1>
        <div className="database-select">
          <p className="text">Current database:</p>
          <p className="current">None</p>
          <div>
            <button onClick={() => console.log("Change")}>Change</button>
            <button onClick={() => console.log("Remove")}>Remove</button>
          </div>
        </div>
    </div>
  )
}

export default Database