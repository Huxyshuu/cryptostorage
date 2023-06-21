const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

export default class Database {
    

    static addDatabase(event: Event): void {
        const ev = event.target.files[0];
        if (event) {
            if (fs.existsSync(`./src/Database/${ev.name}`)) {
                console.log("The file already exists. Please choose a different file.");
            } else {
                fs.copyFile(ev.path, `./src/Database/${ev.name}`, (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                    else {
                        currentDatabase = `./src/Database/${ev.name}`
                        console.log("done!");
                    }
                });
            }
        }
    }

    static changeDatabase(event: Event): void {
        return
    }

    static removeCurrentDatabase(): void {
        console.log(currentDatabase)
    }

    createDatabase(name: string) {
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

