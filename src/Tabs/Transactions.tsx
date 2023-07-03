import { useEffect, useState } from 'react';
import 'Styles/Transactions.scss';
import {getDatabase, loadData} from '../Scripts/db_functions.tsx';
import { Icon } from '@iconify/react';
import upSolid from '@iconify/icons-teenyicons/up-solid';

function Transactions() {

    const [dataExists, setDataExists] = useState(false);
    const [addingEntry, setAddingEntry] = useState(false);

    useEffect(() =>  {
        console.log(getDatabase());
    })

    return (
        <div className="content transactions">
            <div className="header">
                <h1>Transactions</h1>
                <div>
                    <button>Add</button>
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
                    <div className="info">
                        <p>X</p>
                        <p>06.05.2023</p>
                        <p>1.553 €</p>
                        <p>0.0251</p>
                        <p>38.98 €</p>
                        <p>0.04 €</p>
                        <p>29.92 €</p>
                        <p>3.61 %</p>
                    </div>
                </> 
                : 
                <>
                    <p id="noData" onClick={() => setAddingEntry(true)}>Add a first entry</p>
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
                    <form action="" className="info"> 
                        <div className="squaredTwo">
                            <input type="checkbox" value="None" id="squaredTwo" name="check" />
                            <label htmlFor="squaredTwo"></label>
                        </div>
                        <input type="text" id="date"/>
                        <input type="text" id="value"/>
                        <input type="text" id="amount"/>
                        <input type="text" id="total"/>
                        <input type="text" id="fee"/>
                        <input type="text" id="return"/>
                        <input type="text" id="profit"/>
                    </form>
                    <div className="addButton">
                        <button>Add</button>
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