import React from 'react'
import 'Styles/Database.scss'
import DB from '../Scripts/db_functions.tsx';

function Database() {

  return (
    <div className="content database">
        <h1>Database</h1>
        <div className="database-current">
          <p className="text">Current database:</p>
          <p className="current">None</p>
        </div>
        <div className="database-button">
          <button onClick={() => console.log("Create New")}>Create New</button>
          {/* <button onClick={() => console.log("Add Existing")}>Add Existing</button>
          <button onClick={() => console.log("Change")}>Change</button> */}
          <label htmlFor="database-file-add">Add Existing</label>
          <input onChange={DB.addDatabase} type="file" id="database-file-add" name="database-file-add" accept=".db"/>
          <label htmlFor="database-file-change">Change</label>
          <input onChange={DB.changeDatabase} type="file" id="database-file-change" name="database-file-change" accept=".db"/>
          <button onClick={() => console.log("Remove")}>Remove</button>
        </div>
    </div>
  )
}

export default Database