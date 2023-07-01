import React, { useEffect } from 'react';
import 'Styles/Transactions.scss';
import {getDatabase, loadData} from '../Scripts/db_functions.tsx';

function Transactions() {

    useEffect(() =>  {
        console.log(getDatabase());
    })

    return (
        <div className="content transactions">
            <div className="header">
                <h1>Transactions</h1>
                <div>
                    <button>Add</button>
                    <button>Remove</button>
                    <button>Edit</button>
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
                        <p>-</p>
                        <div>
                            <button>up</button>
                            <button>down</button>
                        </div>
                        
                    </div>
                    <p>-</p>
                    <p>- €</p>
                    <p>- €</p>
                    <p>- €</p>
                </div>
            </div>
        </div>
    )
}

export default Transactions