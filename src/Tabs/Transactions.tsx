import React, { useEffect, useState } from 'react';
import 'Styles/Transactions.scss';
import {getDatabase, loadData} from '../Scripts/db_functions.tsx';
import { Icon } from '@iconify/react';
import upSolid from '@iconify/icons-teenyicons/up-solid';

function Transactions() {

    const [dataExists, setDataExists] = useState(true);

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
                    <p id="noData">Add a first entry</p>
                </>
                }

                

                
            </div>
        </div>
    )
}

export default Transactions