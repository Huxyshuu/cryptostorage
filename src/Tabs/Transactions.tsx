import React, { useEffect } from 'react';
import 'Styles/Transactions.scss';
import {getDatabase, loadData} from '../Scripts/db_functions.tsx';

function Transactions() {

    useEffect(() =>  {
        console.log(getDatabase());
    })

    return (
        <div className="content transactions">
            <h1>Transactions</h1>
            <div>
                stuff
            </div>
        </div>
    )
}

export default Transactions