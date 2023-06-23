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
                    document.getElementById("dateAdded").innerHTML = `Date added: ${getTime()}`
                }
            });
        }
    }
}

export function changeDatabase(event: Event): void {
    const ev = event.target.files[0];
    if (event && ev) {
        currentDatabase = `./src/Database/${ev.name}`
        document.getElementById("currentDatabase").innerHTML = ev.name;
        document.getElementById("dateAdded").innerHTML = `Date added: ${getTime()}`
    }
}

export function removeCurrentDatabase(): void {
    currentDatabase = "None";
    document.getElementById("currentDatabase").innerHTML = "None";
    document.getElementById("dateAdded").innerHTML = "-"
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

function getTime() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}.${month}.${year}`;
    return currentDate;
}

