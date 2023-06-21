import React from 'react'
import 'Styles/Database.scss'
import {addDatabase, changeDatabase, removeCurrentDatabase} from '../Scripts/db_functions.tsx';

function Database() {

  return (
    <div className="content database">
        <h1>Database</h1>
        <div className="database-current">
          <p className="text">Current database:</p>
          <p className="current" id="currentDatabase">None</p>
        </div>
        <div className="database-button">
          <button onClick={() => console.log("Create New")}>Create New</button>
          <label htmlFor="database-file-add">Add Existing</label>
          <input onChange={addDatabase} type="file" id="database-file-add" name="database-file-add" accept=".db"/>
          <label htmlFor="database-file-change">Change</label>
          <input onChange={changeDatabase} type="file" id="database-file-change" name="database-file-change" accept=".db"/>
          <button onClick={() => removeCurrentDatabase()}>Remove</button>
        </div>
    </div>
  )
}

export default Database