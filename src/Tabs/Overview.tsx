import React, { useEffect } from 'react'
import {getDatabase, loadData} from '../Scripts/db_functions.tsx';

function Overview() {

    useEffect(() =>  {
        console.log(getDatabase());
    })
    
    return (
        <div>Overview 🚧</div>
    )
}

export default Overview