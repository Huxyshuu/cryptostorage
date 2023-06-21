const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

export default class Database {
    static addDatabase(event: Event): void {
        console.log(event.target.files[0].path)
    }

    static changeDatabase(event: Event): void {
        console.log(event.target.files[0].name)
    }

    createDatabase() {
        const db = new sqlite3.Database('./src/Database/database1.db',
            (err) => {
                if (err) return console.error(err.message);
            });
    }

    createTable() {
        let sql = 'CREATE TABLE transactions(id INTEGER PRIMARY KEY, coin, short, value, amount, date, taxed)';
        db.run(sql);
    }
}




//create table

