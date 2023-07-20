import React, { useEffect, useState } from 'react'
import 'Styles/Database.scss'
import {openDatabase, addDatabase, getDatabase, changeDatabase, removeCurrentDatabase, loadData, insertCoin, queryCoins, updateCoin,} from '../Scripts/db_functions.tsx';

function Database() {

  const [creatingNew, setCreatingNew] = useState(false);
  const [addingCoinLayout, setAddingCoinLayout] = useState(false);
  const [editingCoinLayout, setEditingCoinLayout] = useState(false);
  const [removingCoinLayout, setRemovingCoinLayout] = useState(false);

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

  const falseLayouts = () => {
    setAddingCoinLayout(false);
    setEditingCoinLayout(false);
    setRemovingCoinLayout(false);
  }

  const addCoin = async (event: React.FormEvent) => {
    event.preventDefault();
    const name = (event.target as HTMLFormElement)[0].value;
    const short = (event.target as HTMLFormElement)[1].value;
    const image = (event.target as HTMLFormElement)[2].value;

    const newCoin = {name: name, short: short, img: image};
    
    const existingCoins = await queryCoins(getDatabase());
    
    let coinExists = false;

    existingCoins.forEach(coin => {
        if (coin.name === newCoin.name && coin.short === newCoin.short) {
            if (coin.img === newCoin.img) {
                console.log("Coin exists already");
            } else {
                console.log("Updating coin image...");
                updateCoin(getDatabase(), newCoin)
                setAddingCoinLayout(false);
            }
            coinExists = true;
        }
    });

    if (!coinExists) {
        insertCoin(getDatabase(), newCoin)
        setAddingCoinLayout(false);
    }
  }

  const editCoin = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Editing Coin!");
  }

  const removeCoin = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Removing Coin!");
  }

  
  
  useEffect(() => {
    loadData();
  })

  return (
    <div className="database-content">
      <div className="mainData">
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
        <button onClick={() => {falseLayouts(), setAddingCoinLayout(!addingCoinLayout)}} className={`coinButton ${ addingCoinLayout ? "grayed" : ""}`}>New Coin</button>
        <button onClick={() => {falseLayouts(), setEditingCoinLayout(!editingCoinLayout)}} className={`coinButton ${ editingCoinLayout ? "grayed" : ""}`}>Edit Coin</button>
        <button onClick={() => {falseLayouts(), setRemovingCoinLayout(!removingCoinLayout)}} className={`coinButton ${ removingCoinLayout ? "grayed" : ""}`}>Remove Coin</button>


        {addingCoinLayout || editingCoinLayout || removingCoinLayout ? 
        <div id="coinLayout">
            <div className="entryHeader">
                <h4>{addingCoinLayout ? "Adding a new coin" 
                : editingCoinLayout ? "Editing an existing coin" : "Removing an existing coin"}</h4>
            </div>
            <div>
                <div className="titles">
                    <p>Name</p>
                    <p>Abbrev.</p>
                    <p>Image</p>
                </div>
                {addingCoinLayout ? 
                <form id="addForm" onSubmit={(e: React.FormEvent): void => {addCoin(e)}} className="info"> 
                    <input type="text" id="name"/>
                    <input type="text" id="short"/>
                    <input type="text" id="image"/>
                </form> 
                : editingCoinLayout ? 
                <form id="addForm" onSubmit={(e: React.FormEvent): void => {editCoin(e)}} className="info"> 
                  <input type="text" id="name"/>
                  <input type="text" id="short"/>
                  <input type="text" id="image"/>
                </form> 
                : 
                <form id="addForm" onSubmit={(e: React.FormEvent): void => {removeCoin(e)}} className="info"> 
                    <input type="text" id="name"/>
                    <input type="text" id="short"/>
                    <input type="text" id="image"/>
                </form>}
                
                <div className="button">
                  {addingCoinLayout ? 
                    <input type="submit" form="addForm" value="Add"/> 
                  : editingCoinLayout ? 
                    <input type="submit" form="addForm" value="Edit"/>
                  : <input type="submit" form="addForm" value="Remove"/>}
                    <button onClick={() => falseLayouts()}>Cancel</button>
                </div>
            </div>
        </div>
        :
        <>
        </>}
      </div>
      <div className="coinGrid">
        <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025" alt="btc" />
        <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025" alt="btc" />
        <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025" alt="btc" />
        <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025" alt="btc" />
        <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025" alt="btc" />
        <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025" alt="btc" />
        <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025" alt="btc" />
      </div>
    </div>
  )
}

export default Database