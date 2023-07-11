import { useEffect, useState } from 'react';
import 'Styles/Transactions.scss';
import {getDatabase, insertData, queryData, deleteData} from '../Scripts/db_functions.tsx';
import { Icon } from '@iconify/react';
import upSolid from '@iconify/icons-teenyicons/up-solid';

interface props {
    setTab: React.Dispatch<React.SetStateAction<string>>
}

function Transactions({setTab}:props) {

    const [dataExists, setDataExists] = useState(false);
    const [databaseExists, setDatabaseExists] = useState(false);
    const [addingEntry, setAddingEntry] = useState(false);
    const [editingEntry, setEditingEntry] = useState(false);
    const [data, setData] = useState([{}]);
    const [removeActive, setRemoveActive] = useState(false);
    const [editingActive, setEditingActive] = useState(false);

    const addEntry = () => {
        setAddingEntry(!addingEntry);
        setRemoveActive(false);
        setEditingActive(false);
        setEditingEntry(false);
    }

    const confirmAdd = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            await insertData(getDatabase(), {
                taxed: (event.target as HTMLFormElement)[0],
                date: (event.target as HTMLFormElement)[1],
                value: (event.target as HTMLFormElement)[2],
                amount: (event.target as HTMLFormElement)[3],
            });

            setAddingEntry(false);
            setDataExists(true);
            renderData();
        } catch (error) {
            console.error(error);
            setDataExists(false);
            setAddingEntry(false);
        }
    }

    const activateRemove = () => {
        setRemoveActive(!removeActive);
        setEditingActive(false);
        setAddingEntry(false);
        setEditingEntry(false);
    }

    const activateEditing = () => {
        setEditingActive(!editingActive);
        setRemoveActive(false);
        setAddingEntry(false);
        setEditingEntry(false);
    }

    const removeEntry = async (id: number) => {
        await deleteData(getDatabase(), id);
        renderData();
    }

    const editEntry = () => {
        setEditingEntry(true);
    }

    const confirmEdit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Editing!");
        console.log(event);
    }

    const renderData = async () => {
        try {
          const query = await queryData(getDatabase());
          
          if (query.length > 0) {
            setData(query);
            setDataExists(true);
            setDatabaseExists(true)
          } else {
            setDataExists(false);
            setDatabaseExists(true)
          }
        } catch (error) {
          setDataExists(false);
          setDatabaseExists(false);
        }
    };

    const goToDatabase = () => {
        setTab("database")
    }

    useEffect(() => {
        renderData();
    }, [])

    interface Transaction {
        taxed: { checked: boolean };
        date: { value: string };
        value: { value: string };
        amount: { value: string };
    }

    return (
        <div className="content transactions">
            <div className="header">
                <h1>Transactions</h1>
                <div>
                    <button onClick={addEntry} className={ addingEntry ? "grayed" : ""}>Add</button>
                    <button onClick={activateEditing} className={ editingActive ? "grayed" : ""}>Edit</button>
                    <button onClick={activateRemove} className={ removeActive ? "grayed" : ""}>Remove</button>
                </div>
            </div>
            
            <div className="transactionCoin">
                <div className="titles">
                    <p>Coin</p>
                    <p>Current Amount</p>
                    <p>Total Sum</p>
                    <p>Current Limit</p>
                    <p>Profit Sum</p>
                </div>
                <div className="info">
                    <div>
                        <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="eth" />
                        <p>Etherium</p>
                        <div>
                            <Icon className="arrows" icon={upSolid} />
                            <Icon className="arrows" icon={upSolid} rotate={2} />
                        </div>
                        
                    </div>
                    <p>2000</p>
                    <p>2000 €</p>
                    <p>2000 €</p>
                    <p>2000 €</p>
                </div>
            </div>

            <div className="transactionStuff">
                <div className="titles">
                    <p>Taxed</p>
                    <p className="date">Date</p>
                    <p>Value</p>
                    <p className="amount">Amount</p>
                    <p>Total</p>
                    <p>Fee</p>
                    <p>Return</p>
                    <p>Profit %</p>
                </div>

                {dataExists ? 
                <>
                    {
                        data.map((transaction, index) => {
                            let id = 0
                            let value = 0
                            let amount = 0
                            let total = 0                               
                            let fee = 0

                            try {
                                value = parseFloat(transaction.value);
                                amount = parseFloat(transaction.amount);
                                total = value * amount
                                fee = total * 0.001
                                id = transaction.id
                            } catch(err) {
                                console.log(err);
                            }
                            

                            return (
                            <div className={`info ${ index == data.length - 1 ? "roundedCorners" : ""} ${amount < 0 ? "sold" : ""} ${ removeActive || editingActive ? "hoverGray" : ""}`} 
                            key={index+"-transaction"}
                            onClick={ () => {
                                if (removeActive) removeEntry(transaction.id);
                                if (editingActive) editEntry(transaction.id)
                            }}>
                                <p>{transaction.taxed ? "X" : ""}</p>
                                <p className="date">{transaction.date}</p>
                                <p>{value.toFixed(2)} €</p>
                                <p className="amount">{amount.toFixed(2)}</p>
                                <p>{total.toFixed(2)} €</p>
                                <p>{fee.toFixed(2)} €</p>
                                <p>- €</p>
                                <p>- %</p>
                            </div>
                            )
                        })
                    }
                </> 
                : 
                <>
                    {databaseExists ? <p id="noData" onClick={addEntry}>Add a first entry</p>
                    : <p id="noData" onClick={goToDatabase}>Add a database</p>}
                </>
                }

                {addingEntry ? 
                <div id="addingEntry">
                    <div className="entryHeader">
                        <h4>Adding a new entry</h4>
                        <h4>To <span className="sellRed">SELL</span>, use a negative value for AMOUNT!</h4>
                    </div>
                    <div className="titles">
                        <p>Taxed</p>
                        <p>Date</p>
                        <p>Value</p>
                        <p>Amount</p>
                        <p>Total</p>
                        <p>Fee</p>
                        <p>Return</p>
                        <p>Profit %</p>
                    </div>
                    <form id="addForm" onSubmit={(e: React.FormEvent): void => {confirmAdd(e)}} className="info"> 
                        <div className="squaredTwo">
                            <input type="checkbox" value="None" id="squaredTwo" name="check" />
                            <label htmlFor="squaredTwo"></label>
                        </div>
                        <input type="text" id="date"/>
                        <input type="text" id="value"/>
                        <input type="text" id="amount"/>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                    </form>
                    <div className="addButton">
                        <input type="submit" form="addForm" value="Add"/>
                        <button onClick={() => setAddingEntry(false)}>Cancel</button>
                    </div>
                </div>
                :
                <>
                </>}

                {editingEntry ? 
                <div id="addingEntry">
                    <div className="entryHeader">
                        <h4>Edit an entry</h4>
                        <h4>To <span className="sellRed">SELL</span>, use a negative value for AMOUNT!</h4>
                    </div>
                    <div className="titles">
                        <p>Taxed</p>
                        <p>Date</p>
                        <p>Value</p>
                        <p>Amount</p>
                        <p>Total</p>
                        <p>Fee</p>
                        <p>Return</p>
                        <p>Profit %</p>
                    </div>
                    <form id="addForm" onSubmit={(e: React.FormEvent): void => {confirmEdit(e)}} className="info"> 
                        <div className="squaredTwo">
                            <input type="checkbox" value="None" id="squaredTwo" name="check" />
                            <label htmlFor="squaredTwo"></label>
                        </div>
                        <input type="text" id="date"/>
                        <input type="text" id="value"/>
                        <input type="text" id="amount"/>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                    </form>
                    <div className="addButton">
                        <input type="submit" form="addForm" value="Edit"/>
                        <button onClick={() => setEditingEntry(false)}>Cancel</button>
                    </div>
                </div>
                :
                <>
                </>}

                

                
            </div>
        </div>
    )
}

export default Transactions