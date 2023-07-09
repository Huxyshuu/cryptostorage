import { useEffect, useState } from 'react';
import 'Styles/Transactions.scss';
import {getDatabase, insertData, queryData} from '../Scripts/db_functions.tsx';
import { Icon } from '@iconify/react';
import upSolid from '@iconify/icons-teenyicons/up-solid';

function Transactions() {

    const [dataExists, setDataExists] = useState(false);
    const [addingEntry, setAddingEntry] = useState(false);
    const [data, setData] = useState([{}]);

    const addToDatabase = () => {
        console.log("adding");

        setAddingEntry(true);
    }

    const confirmAdd = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("added");
        console.log(event);
        insertData(getDatabase(), {
            taxed: (event.target as HTMLFormElement)[0],
            date: (event.target as HTMLFormElement)[1],
            value: (event.target as HTMLFormElement)[2],
            amount: (event.target as HTMLFormElement)[3],
        });

        setAddingEntry(false);
        setDataExists(true);
    }

    const renderData = () => {
        const query = queryData(getDatabase())
        console.log(query);
        if (query) {
            setData(query)
            setDataExists(true);
        } else {
            setDataExists(false)
        }
        
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
                    <button>Remove</button>
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

                            console.log(transaction.taxed);
                            const total = parseInt(transaction.value) * parseInt(transaction.amount)
                            const fee = total * 0.001

                            return (
                            <div className="info" key={index+"-transaction"}>
                                <p>{transaction.taxed ? "X" : ""}</p>
                                <p>{transaction.date}</p>
                                <p>{transaction.value}</p>
                                <p>{transaction.amount}</p>
                                <p>{total} €</p>
                                <p>{fee} €</p>
                                <p>- €</p>
                                <p>- %</p>
                            </div>
                            )
                        })
                    }
                </> 
                : 
                <>
                    <p id="noData" onClick={addToDatabase}>Add a first entry</p>
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