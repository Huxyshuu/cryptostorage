const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

let currentDatabase = "None";

export function addDatabase(event: Event): void {
    const ev = event.target.files[0];
    if (event && ev) {
        if (fs.existsSync(`./src/Database/${ev.name}`)) {
            console.log("The file already exists. Please choose a different file.");
        } else {
            fs.copyFile(ev.path, `./src/Database/${ev.name}`, (err) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                    currentDatabase = `./src/Database/${ev.name}`
                    document.getElementById("currentDatabase").innerHTML = ev.name;
                    setTime();
                }
            });
        }
    }
}

export function changeDatabase(event: Event): void {
    const file = event.target.files[0];
    if (event && file) {
        currentDatabase = `./src/Database/${file.name}`
        document.getElementById("currentDatabase").innerHTML = file.name;
        setTime();
        setSize(file.path);
        setEdited(file.path);
    }
}

export function removeCurrentDatabase(): void {
    currentDatabase = "None";
    document.getElementById("currentDatabase").innerHTML = "None";
    document.getElementById("dateAdded").innerHTML = "Date added: -"
    document.getElementById("fileSize").innerHTML = "File size: -"
    document.getElementById("lastEdited").innerHTML = `Last edited: -`;


    // reset the onChange events
    document.getElementById("database-file-change").value = "";
    document.getElementById("database-file-add").value = "";
}

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

function setTime(): void {
    const date = new Date().toLocaleDateString("fi-FI");
    document.getElementById("dateAdded").innerHTML = `Date added: ${date}`
}

function setEdited(file: string): void {
    const dateEdited = fs.statSync(file).mtime.toLocaleDateString("fi-FI");
    document.getElementById("lastEdited").innerHTML = `Last edited: ${dateEdited}`;
}

function setSize(file: string): void {
    const sizeInBytes = fs.statSync(file).size;
    const sizeInKB = sizeInBytes / 1024;
    const sizeInMB = sizeInKB / 1024;
    if (sizeInKB < 1000) {
        document.getElementById("fileSize").innerHTML = `File size: ${sizeInKB.toFixed(2)} KB`;
    } else {
        document.getElementById("fileSize").innerHTML = `File size: ${sizeInMB.toFixed(2)} MB`;
    }
}

