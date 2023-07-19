import { useEffect, useState } from 'react';
import 'Styles/Transactions.scss';
import {getDatabase, insertData, insertCoin, queryData, queryCoins, updateCoin, editData, deleteData} from '../Scripts/db_functions.tsx';
import { Icon } from '@iconify/react';
import upSolid from '@iconify/icons-teenyicons/up-solid';

interface props {
    setTab: React.Dispatch<React.SetStateAction<string>>
}

function Transactions({setTab}:props) {

    const [dataExists, setDataExists] = useState(false);
    const [databaseExists, setDatabaseExists] = useState(false);

    const [addingLayout, setAddingLayout] = useState(false);
    const [editingLayout, setEditingLayout] = useState(false);
    const [removingLayout, setRemovingLayout] = useState(false);
    const [selectingCoin, setSelectingCoin] = useState(false);
    const [addingCoinLayout, setAddingCoin] = useState(false);
    
    const [removeActive, setRemoveActive] = useState(false);
    const [editingActive, setEditingActive] = useState(false);

    const [data, setData] = useState([{}]);
    const [entryInfo, setEntryInfo] = useState({
        id: 0,
        coin: "",
        taxed: false,
        date: "",
        value: 0.0,
        amount: 0.0
    });
    const [removeId, setRemoveId] = useState(0);
    const [coinInfo, setCoinInfo] = useState({
        curAmount: 0.0,
        totalSum: 0.0,
        curLimit: 0.0,
        profitSum: 0.0
    })
    const [profit, setProfit] = useState([{}])
    const [selectedCoin, setSelectedCoin] = useState({});
    const [allCoins, setAllCoins] = useState([{}])

    const activateCoinAdding = () => {
        setAddingCoin(!addingCoinLayout);
        setAddingLayout(false);
        setRemoveActive(false);
        setEditingActive(false);
        setEditingLayout(false);
        setRemovingLayout(false);
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
                    setAddingCoin(false);
                }
                coinExists = true;
            }
        });

        if (!coinExists) {
            insertCoin(getDatabase(), newCoin)
            setSelectedCoin(newCoin);
            setAddingCoin(false);
        }
    }

    const addEntry = () => {
        setAddingLayout(!addingLayout);
        setRemoveActive(false);
        setEditingActive(false);
        setEditingLayout(false);
        setRemovingLayout(false);
        setAddingCoin(false);
    }

    const confirmAdd = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            await insertData(getDatabase(), {
                coin: selectedCoin.short,
                taxed: (event.target as HTMLFormElement)[0],
                date: (event.target as HTMLFormElement)[1],
                value: (event.target as HTMLFormElement)[2],
                amount: (event.target as HTMLFormElement)[3],
            });

            setAddingLayout(false);
            setDataExists(true);
            renderData();
        } catch (error) {
            console.error(error);
            setDataExists(false);
            setAddingLayout(false);
        }
    }

    const activateRemove = () => {
        setRemoveActive(!removeActive);
        setEditingActive(false);
        setAddingLayout(false);
        setEditingLayout(false);
        setRemovingLayout(false);
        setAddingCoin(false);
    }

    const activateEditing = () => {
        setEditingActive(!editingActive);
        setRemoveActive(false);
        setAddingLayout(false);
        setEditingLayout(false);
        setRemovingLayout(false);
        setAddingCoin(false);
    }

    const editEntry = async (entry: React.BaseSyntheticEvent, entryId: number) => {

        /*
            Surprisingly the "await" does have an effect on the setStates
            as it ensures enough time for things to update before rendering.

            Same applies for the removeEntry function.
        */ 
        await setEditingActive(false);
        await setEditingLayout(false);
        
        const id = entryId;
        let taxed = false;
        {entry.children[0].innerHTML == "X" ? taxed = true : taxed = false}
        const date = entry.children[1].innerHTML;
        const value = parseFloat(entry.children[2].innerHTML);
        const amount = parseFloat(entry.children[3].innerHTML);

        setEntryInfo({id: id, coin: selectedCoin.short, taxed: taxed, date: date, value: value, amount: amount})

        setEditingLayout(true);
        setEditingActive(true);
        
    }

    const confirmEdit = async (event: React.FormEvent) => {
        event.preventDefault();
        const editedInfo = {id: entryInfo.id, coin: entryInfo.coin ,taxed: event.target[0].checked, date: event.target[1].value, value: parseFloat(event.target[2].value), amount: parseFloat(event.target[3].value)}
        if (JSON.stringify(editedInfo) === JSON.stringify(entryInfo)) {
            setEditingLayout(false);
            return
        }
        setEntryInfo(editedInfo)
        await editData(getDatabase(), editedInfo)

        renderData();
        setEditingLayout(false);
    }

    const removeEntry = async (entry: React.BaseSyntheticEvent, id: number) => {
        

        await setRemovingLayout(false);
        await setRemoveActive(false);
        
        let taxed = false;
        {entry.children[0].innerHTML == "X" ? taxed = true : taxed = false}
        const date = entry.children[1].innerHTML;
        const value = parseFloat(entry.children[2].innerHTML);
        const amount = parseFloat(entry.children[3].innerHTML);

        setEntryInfo({taxed: taxed, date: date, value: value, amount: amount})

        setRemovingLayout(true);
        setRemoveActive(true);
        setRemoveId(id);
    }

    const confirmRemove = async (event: React.FormEvent) => 
    {
        event.preventDefault();
        
        await deleteData(getDatabase(), removeId);

        renderData();
        setRemovingLayout(false);
    }

    const selectCoin = (coin: object) => {
        setSelectedCoin(coin);
        setSelectingCoin(false);
    }

    const calculateCoin = (query: Array<object>, profit: Array<object>) => {

        if (query.length == 0) {
            setCoinInfo({curAmount: 0, totalSum: 0, curLimit: 0, profitSum: 0});
            return
        }

        let curAmount = 0;
        let totalSum = 0;
        let curLimit = 0;
        let profitSum = 0;

        query.forEach((entry) => {
            curAmount += entry.amount - (entry.amount * 0.001) // amount - fee

            const total = entry.amount * entry.value 
            totalSum += total
        })

        profit.forEach((entry) => {
            profitSum += entry.profit;
        })

        totalSum += profitSum;

        curLimit = (totalSum / curAmount);

        if (curAmount < 0 || totalSum < 0) {
            curAmount = 0;
            totalSum = 0;
            curLimit = 0;
        }

        setCoinInfo({curAmount, totalSum, curLimit, profitSum});
    }

    const checkProfit = (query: Array<object>) => {
        const data = query.toReversed();

        const profitList: Array<object> = [];

        let sum = 0;
        let profit = 0;
        let percent = 0;
        for (const entry in data) {
            const total = data[entry].value * data[entry].amount;
            if (total <= 0 ) {
                profit = -(total) - sum 
                percent = ((sum + profit) / sum - 1) * 100; // fancy pantsy maht ;D
                profitList.unshift({id: data[entry].id, profit: profit, percent: percent})
                // Reset 
                sum = 0;
                profit = 0;
                continue
            }
            sum += total;
        }
        return profitList;
    }

    const renderData = async () => {
        try {
          const query = await queryData(getDatabase(), selectedCoin.short);
          
          if (query.length > 0) {
            setData(query);
            setDataExists(true);
            setDatabaseExists(true)

            const profit = checkProfit(query)
            setProfit(profit);
            calculateCoin(query, profit);
          } else {
            setDataExists(false);
            setDatabaseExists(true)
            calculateCoin([], [])
          }
        } catch (error) {
          setDataExists(false);
          setDatabaseExists(false);
        }

        const coins = await queryCoins(getDatabase());
        setAllCoins(coins);
        if (selectedCoin.name == undefined) {
            setSelectedCoin(coins[0])
        }
    };

    const goToDatabase = () => {
        setTab("database")
    }

    useEffect(() => {
        renderData();
    }, [selectedCoin])

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
                    <button onClick={activateCoinAdding} className={`newCoin ${ addingCoinLayout ? "grayed" : ""}`}>New Coin</button>
                    <button onClick={addEntry} className={ addingLayout ? "grayed" : ""}>Add</button>
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
                        <img src={selectedCoin.img} alt={selectedCoin.name} />
                        <p onClick={() => setSelectingCoin(true)}>{selectedCoin.short}</p>
                        <div>
                            <Icon onClick={() => console.log("up")} className="arrows" icon={upSolid} />
                            <Icon onClick={() => console.log("down")} className="arrows" icon={upSolid} rotate={2} />
                        </div>
                    </div>
                    { selectingCoin ? 
                    <div className="selectCoin">
                        {allCoins.map(coin => {
                            return (
                            <div key={`${coin.name}-item`}>
                                <img src={coin.img} alt={coin.name} />
                                <p onClick={() => selectCoin(coin)}>{coin.name.length > 9 ? coin.short : coin.name}</p>
                            </div>
                            )
                            
                        })}
                    </div>
                    : null}
                    <p>{(coinInfo.curAmount).toFixed(5)}</p>
                    <p>{(coinInfo.totalSum).toFixed(2)} €</p>
                    <p>{(coinInfo.curLimit).toFixed(5)} €</p>
                    <p>{(coinInfo.profitSum).toFixed(2)} €</p>
                    
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
                            
                            const profitData = profit.find(entry => entry.id === id);

                            return (
                            <div className={`info ${ index == data.length - 1 ? "roundedCorners" : ""} ${amount < 0 ? "sold" : ""} ${ removeActive || editingActive ? "hoverGray" : ""}`} 
                            key={index+"-transaction"}
                            onClick={ (event: React.FormEvent) => {
                                if (removeActive) removeEntry(event.target.parentElement, transaction.id);
                                if (editingActive) editEntry(event.target.parentElement, transaction.id);
                            }}>
                                <p>{transaction.taxed ? "X" : ""}</p>
                                <p className="date">{transaction.date}</p>
                                <p>{value < 0.0001 ? value.toFixed(8) : value.toFixed(4)} €</p>
                                <p className="amount">{amount > 99999 ? amount : amount.toFixed(4)}</p>
                                <p>{total.toFixed(2)} €</p>
                                <p>{Math.abs(fee.toFixed(2))} €</p>
                                {profitData ? 
                                <>
                                    <p className={profitData.profit >= 0? "profitValuePos" : "profitValueNeg"}>{profitData ? `${profitData.profit.toFixed(2)} €` : ""}</p>
                                    <p className={profitData.percent >= 0? "profitPercentPos" : "profitPercentNeg"}>{profitData ? `${profitData.percent.toFixed(2)} %` : ""}</p>
                                </>
                                :
                                <>
                                    <p>{profitData ? `${profitData.profit.toFixed(2)} €` : ""}</p>
                                    <p>{profitData ? `${profitData.percent.toFixed(2)} %` : ""}</p>
                                </>
                                }
                                
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

                {addingLayout ? 
                <div id="addingLayout">
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
                            <input type="checkbox" id="squaredTwo" name="check" />
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
                        <button onClick={() => setAddingLayout(false)}>Cancel</button>
                    </div>
                </div>
                :
                <>
                </>}

                { /* USES THE SAME STYLING AS ADDING ENTRY BUT IS USED FOR EDITING ENTRY*/ }
                {editingLayout ? 
                <div id="addingLayout">
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
                            <input type="checkbox" defaultChecked={entryInfo.taxed} id="squaredTwo" name="check" />
                            <label htmlFor="squaredTwo"></label>
                        </div>
                        <input type="text" defaultValue={entryInfo.date}/>
                        <input type="text" defaultValue={entryInfo.value}/>
                        <input type="text" defaultValue={entryInfo.amount}/>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                    </form>
                    <div className="addButton">
                        <input type="submit" form="addForm" value="Edit"/>
                        <button onClick={() => setEditingLayout(false)}>Cancel</button>
                    </div>
                </div>
                :
                <>
                </>}

                { /* USES THE SAME STYLING AS ADDING ENTRY BUT IS USED FOR REMOVING ENTRY*/ }
                {removingLayout ? 
                <div id="addingLayout">
                    <div className="entryHeader">
                        <h4 id="removingHeader">Remove an entry</h4>
                    </div>
                    
                    <form id="addForm" onSubmit={(e: React.FormEvent): void => {confirmRemove(e)}} className="info"> 
                        <div className="squaredTwo">
                            <input type="checkbox" defaultChecked={entryInfo.taxed} id="squaredTwo" name="check" />
                            <label htmlFor="squaredTwo"></label>
                        </div>
                        <input type="text" defaultValue={entryInfo.date}/>
                        <input type="text" defaultValue={entryInfo.value}/>
                        <input type="text" defaultValue={entryInfo.amount}/>
                    </form>
                    <div className="addButton">
                        <input type="submit" form="addForm" value="Remove"/>
                        <button onClick={() => setRemovingLayout(false)}>Cancel</button>
                    </div>
                </div>
                :
                <>
                </>}

                {addingCoinLayout ? 
                <div id="addingCoinLayout">
                    <div className="entryHeader">
                        <h4>Adding a new coin</h4>
                    </div>
                    <div>
                        <div className="titles">
                            <p>Name</p>
                            <p>Abbrev.</p>
                            <p>Image</p>
                        </div>
                        <form id="addForm" onSubmit={(e: React.FormEvent): void => {addCoin(e)}} className="info"> 
                            <input type="text" id="name"/>
                            <input type="text" id="short"/>
                            <input type="text" id="image"/>
                        </form>
                        <div className="addButton">
                            <input type="submit" form="addForm" value="Add"/>
                            <button onClick={() => setAddingCoin(false)}>Cancel</button>
                        </div>
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