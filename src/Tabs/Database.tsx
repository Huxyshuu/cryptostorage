import React, { useEffect, useState } from 'react'
import 'Styles/Database.scss'
import {openDatabase, addDatabase, changeDatabase, removeCurrentDatabase, loadData} from '../Scripts/db_functions.tsx';

function Database() {

  const [creatingNew, setCreatingNew] = useState(false);

  const createNew = (event: React.FormEvent) => {
    event.preventDefault();
    if (event.target !== null) {
      const ev = (event.target as HTMLFormElement)[0];
      if (ev !== null) {
        const newName = (ev as HTMLInputElement).value; 
        openDatabase(`./src/Database/${newName}.db`);

        setCreatingNew(false);
      }
    }
  }
  
  useEffect(() => {
    loadData();
  })

  return (
    <div className="content database">
        <h1>Database</h1>
        { creatingNew ? 
        <div className="database-current">
          <p className="text">New database name:</p>
          <form onSubmit={(event: React.FormEvent<HTMLFormElement>): void => createNew(event)}>
            <input type="text" name="databaseName"/>
            <input type="submit" value="Create"/>
          </form>
        </div>
        :
        <div className="database-current">
          <p className="text">Current database:</p>
          <p className="current" id="currentDatabase">None</p>
        </div>
        }
        
        <div className="database-button">
          { creatingNew ? 
          <button onClick={() => setCreatingNew(false)}>Cancel</button>
          :
          <button onClick={() => setCreatingNew(true)}>Create New</button>
          }
          <label htmlFor="database-file-add">Add Existing</label>
          <input onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {addDatabase(event); setCreatingNew(false)}} type="file" id="database-file-add" name="database-file-add" accept=".db"/>
          <label htmlFor="database-file-change">Change</label>
          <input onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {changeDatabase(event); setCreatingNew(false)}} type="file" id="database-file-change" name="database-file-change" accept=".db"/>
          <button onClick={() => {removeCurrentDatabase(); setCreatingNew(false)}}>Remove</button>
        </div>
        <div className="database-info">
          <p id="dateAdded">Date added: -</p>
          <p id="lastEdited">Last edited: -</p>
          <p id="fileSize">File size: -</p>
        </div>
    </div>
  )
}

export default Database