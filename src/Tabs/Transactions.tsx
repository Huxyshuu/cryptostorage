import React, { useEffect } from 'react';
import 'Styles/Transactions.scss';
import {getDatabase, loadData} from '../Scripts/db_functions.tsx';
import { Icon } from '@iconify/react';
import upSolid from '@iconify/icons-teenyicons/up-solid';

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
        </div>
    )
}

export default Transactions