const sqlite3 = await require('sqlite3');
const fs = await require('fs');
const Store = await require('electron-store');

const store = new Store();

let currentDatabase = store.get("database.current");

export function addDatabase(event: Event): void {
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
    
                        const current = document.getElementById("currentDatabase");
                        if (current !== null) current.innerHTML = file.name;
                        
                        setTime();
                        setSize(file.path);
                        setEdited(file.path);
                        saveData();
                    }
                });
            }
        }
    }
}

export function changeDatabase(event: Event): void {
    
    if (event.target !== null) {
        const ev = (event.target as HTMLInputElement).files;
        if (ev !== null) {
            const file = ev[0];

            currentDatabase = `${file.path}`

            const current = document.getElementById("currentDatabase");
            if (current !== null) current.innerHTML = file.name;

            setTime();
            setSize(file.path);
            setEdited(file.path);
            saveData();
        }
    }
}

export function removeCurrentDatabase(): void {
    const current = document.getElementById("currentDatabase");
    const dateAdded = document.getElementById("dateAdded");
    const fileSize = document.getElementById("fileSize");
    const lastEdited = document.getElementById("lastEdited");

    currentDatabase = "None";
    if (current !== null && dateAdded !== null && fileSize !== null && lastEdited !== null) {
        current.innerHTML = "None";
        dateAdded.innerHTML = "Date added: -"
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

/*
export function createDatabase(name: string) {
    const db = new sqlite3.Database('./src/Database/database1.db',
        (err) => {
            if (err) return console.error(err.message);
        });
}


export function createTable() {
    const sql = 'CREATE TABLE transactions(id INTEGER PRIMARY KEY, coin, short, value, amount, date, taxed)';
    db.run(sql);
}
*/

export function getDatabase(): string {
    return currentDatabase;
}

function setTime(): void {
    const date = new Date().toLocaleDateString("fi-FI");
    // Check for null
    const dateAdded = document.getElementById("dateAdded");
    if (dateAdded !== null) {
        dateAdded.innerHTML = `Date added: ${date}`;
    } else {
        alert("Oops! SetTime failed")
    }
}

function setEdited(file: string): void {
    const dateEdited = fs.statSync(file).mtime.toLocaleDateString("fi-FI");
    const lastEdited = document.getElementById("lastEdited");
    if (lastEdited !== null) {
        lastEdited.innerHTML = `Last edited: ${dateEdited}`;
    } else {
        alert("Oops! lastEdited failed")
    }
}

function setSize(file: string): void {
    const sizeInBytes = fs.statSync(file).size;
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

export function saveData() {
    store.set('database.current', currentDatabase)
}

export function loadData() {
    currentDatabase = store.get('database.current');

    if (currentDatabase === undefined || currentDatabase === "None") {
        removeCurrentDatabase();
    } else {
        const current = document.getElementById("currentDatabase");
        if (current !== null) {
            current.innerHTML = `${currentDatabase.substring(currentDatabase.lastIndexOf("\\") + 1)}`
        }
        setTime();
        setEdited(currentDatabase);
        setSize(currentDatabase);
    }
}

