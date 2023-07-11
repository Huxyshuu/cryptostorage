const sqlite3 = await require('sqlite3');
const fs = await require('fs');
const Store = await require('electron-store');

const store = new Store();

let currentDatabase = store.get("database.current");
let db: any = null;
if (currentDatabase) {
    db = openDatabase(currentDatabase);
}



export function addDatabase(event: React.ChangeEvent): void {
    if (event.target !== null) {
        const ev = (event.target as HTMLInputElement).files;
        if (ev !== null) {
            const file = ev[0];

            if (fs.existsSync(`./src/Database/${file.name}`)) {
                changeDatabase(event);
            } else {
                fs.copyFile(file.path, `./src/Database/${file.name}`, (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                    else {
                        currentDatabase = `./src/Database/${file.name}`
                        db = openDatabase(currentDatabase)
    
                        const current = document.getElementById("currentDatabase");
                        if (current !== null) current.innerHTML = file.name;
                        
                        setTime(file.path);
                        setSize(file.path);
                        setEdited(file.path);
                        saveData();
                    }
                });
            }
        }
    }
}

export function changeDatabase(event: React.ChangeEvent): void {
    
    if (event.target !== null || event.target !== undefined) {
        const ev = (event.target as HTMLInputElement).files;
        if (ev !== null) {
            const file = ev[0];

            if (file.path.includes(".db")) {
                currentDatabase = `${file.path}`

                const current = document.getElementById("currentDatabase");
                if (current !== null) current.innerHTML = file.name;

                openDatabase(currentDatabase);
                loadData();
            } else {
                console.log("Please choose a database (.db) file!");
            }

            
        }
    }
}

export function removeCurrentDatabase(): void {
    const current = document.getElementById("currentDatabase");
    const dateAdded = document.getElementById("dateAdded");
    const fileSize = document.getElementById("fileSize");
    const lastEdited = document.getElementById("lastEdited");

    currentDatabase = "None";
    db = null;
    if (current !== null && dateAdded !== null && fileSize !== null && lastEdited !== null) {
        current.innerHTML = "None";
        dateAdded.innerHTML = "Date created: -"
        fileSize.innerHTML = "File size: -"
        lastEdited.innerHTML = `Last edited: -`;
    }
    

    const change = document.getElementById("database-file-change") as HTMLInputElement;
    const add = document.getElementById("database-file-add") as HTMLInputElement;
    // reset the onChange events
    if (change !== null && add !== null) {
        change.value = "";
        add.value = "";
    }
    
    saveData();
}

export function loadData() {
    currentDatabase = store.get('database.current');

    if (currentDatabase === undefined || currentDatabase === "None") {
        removeCurrentDatabase();
    } else {
        const current = document.getElementById("currentDatabase");
        if (current !== null) {
            if (currentDatabase.indexOf("/") == -1) {
                db = openDatabase(currentDatabase);
                const fileName = `${currentDatabase.substring(currentDatabase.lastIndexOf("\\") + 1)}`
                current.innerHTML = fileName
                
            } else {
                db = openDatabase(currentDatabase);
                const fileName = `${currentDatabase.substring(currentDatabase.lastIndexOf("/") + 1)}`
                current.innerHTML = fileName
                
            }
            
        }
        
        setTime(currentDatabase);
        setEdited(currentDatabase);
        setSize(currentDatabase);
    }
}

export function openDatabase(path: string) {
    
    db = new sqlite3.Database(path,
        (err) => {
            if (err) return console.error(err.message);
        });
    
    createTable();

    currentDatabase = path;
    saveData();

    return db
}

/*
export function openDatabase(name: string) {
    const databaseName = name.replace(" ", "_").trim();
    let path = "";
    if (databaseName.includes(".db")) {
        path = `./src/Database/${databaseName}`;
    } else {
        path = `./src/Database/${databaseName}.db`;
    }
    
    db = new sqlite3.Database(path,
        (err) => {
            if (err) return console.error(err.message);
        });

    currentDatabase = path;
    saveData();
}
*/

export function getDatabase() {
    if (currentDatabase === undefined || currentDatabase === "None") {
        db = null;
    }
    return db;
}

export function createTable() {
    const sql = 'CREATE TABLE IF NOT EXISTS transactions(id INTEGER PRIMARY KEY, coin, taxed, date, value, amount)';
    if (db !== null) {
        db.run(sql);
    }
}

interface TransactionData {
    taxed: { checked: boolean };
    date: { value: string };
    value: { value: string };
    amount: { value: string };
  }

export function insertData(database: any, data: TransactionData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const sql = 'INSERT INTO transactions (coin, taxed, date, value, amount) VALUES ("ETH", ?, ?, ?, ?)'
        const params = [
            data.taxed.checked, 
            data.date.value, 
            parseFloat(data.value.value), 
            parseFloat(data.amount.value)
        ]

        if (database !== null) {
            database.all(sql, params, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        } else {
            reject(new Error("No database selected"));
        }
    });
}

export function queryData(database: any): Promise<object[]> {
    return new Promise<object[]>((resolve, reject) => {
      const queriedData: object[] = [];
      const sql = 'SELECT * FROM transactions';
  
      if (database !== null) {
        database.all(sql, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            rows.forEach(row => queriedData.unshift(row));
            resolve(queriedData);
          }
        });
      } else {
        reject(new Error("No database selected"));
      }
    });
}

export function deleteData(database, id): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const sql = `SELECT * FROM transactions WHERE id = ${id} `

        if (database !== null) {
            database.get(sql, [], (err, row) => {
              if (err) {
                reject(err);
              } else {
                console.log(row);
                resolve();
              }
            });
          } else {
            reject(new Error("No entry found"));
          }
    });
}



function saveData() {
    store.set('database.current', currentDatabase);
}

function setTime(file: string): void {
    let date = ""
    try {
        date = fs.statSync(file).birthtime.toLocaleDateString("fi-FI");
    } catch (err) {
        console.log(err.message);
        return
    }
    // Check for null
    const dateAdded = document.getElementById("dateAdded");
    if (dateAdded !== null) {
        dateAdded.innerHTML = `Date created: ${date}`;
    } else {
        alert("Oops! SetTime failed")
    }
}

function setEdited(file: string): void {
    let dateCreated = ""
    try {
        dateCreated = fs.statSync(file).mtime.toLocaleDateString("fi-FI");
    } catch (err) {
        console.log(err.message);
        return
    }
    const lastEdited = document.getElementById("lastEdited");
    if (lastEdited !== null) {
        lastEdited.innerHTML = `Last edited: ${dateCreated}`;
    } else {
        alert("Oops! lastEdited failed")
    }
}

function setSize(file: string): void {
    let sizeInBytes = 0;
    try {
        sizeInBytes = fs.statSync(file).size;
    } catch (err) {
        console.log(err.message);
        return
    }
    const sizeInKB = sizeInBytes / 1024;
    const sizeInMB = sizeInKB / 1024;

    const fileSize = document.getElementById("fileSize");
    if (fileSize !== null) {
        if (sizeInKB < 1000) {
            fileSize.innerHTML = `File size: ${sizeInKB.toFixed(2)} KB`;
        } else {
            fileSize.innerHTML = `File size: ${sizeInMB.toFixed(2)} MB`;
        }
    } else {
        alert("Oops! FileSize failed")
    }
    
}



