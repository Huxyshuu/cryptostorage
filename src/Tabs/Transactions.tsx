import { useEffect, useState } from 'react';
import 'Styles/Transactions.scss';
import {getDatabase, insertData, queryData} from '../Scripts/db_functions.tsx';
import { Icon } from '@iconify/react';
import upSolid from '@iconify/icons-teenyicons/up-solid';

interface props {
    setTab: React.Dispatch<React.SetStateAction<string>>
}

function Transactions({setTab}:props) {

    const [dataExists, setDataExists] = useState(false);
    const [databaseExists, setDatabaseExists] = useState(false);
    const [addingEntry, setAddingEntry] = useState(false);
    const [data, setData] = useState([{}]);
    const [removeActive, setRemoveActive] = useState(false);

    const addToDatabase = () => {
        setAddingEntry(true);
    }

    interface TransactionData {
        taxed: { checked: boolean };
        date: { value: string };
        value: { value: string };
        amount: { value: string };
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
            renderData()
        } catch (error) {
            console.error(error)
            setDataExists(false);
            setAddingEntry(false);
        }
    }

    const activateRemove = () => {
        setRemoveActive(!removeActive)
    }

    const removeEntry = id => {
        console.log(id);
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

    return (
        <div className="content transactions">
            <div className="header">
                <h1>Transactions</h1>
                <div>
                    <button onClick={addToDatabase}>Add</button>
                    <button>Edit</button>
                    <button onClick={activateRemove}>Remove</button>
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
                    <p>Date</p>
                    <p>Value</p>
                    <p>Amount</p>
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
                                total = transaction.value * transaction.amount
                                fee = total * 0.001
                                id = transaction.id
                            } catch(err) {
                                console.log(err);
                            }
                            

                            return (
                            <div className={`info ${ index == data.length - 1 ? "roundedCorners" : ""} ${amount < 0 ? "sold" : ""}`} 
                            key={index+"-transaction"}
                            onClick={ removeActive ? () => removeEntry(transaction.id) : () => {console.log("Hi")}}>
                                <p>{transaction.taxed ? "X" : ""}</p>
                                <p>{transaction.date}</p>
                                <p>{value.toFixed(2)} €</p>
                                <p>{amount.toFixed(2)}</p>
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
                    {databaseExists ? <p id="noData" onClick={addToDatabase}>Add a first entry</p>
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

                

                
            </div>
        </div>
    )
}

export default Transactions