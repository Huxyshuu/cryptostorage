const sqlite3 = require('sqlite3').verbose();
let sql;

const db = new sqlite3.Database('./src/Database/database1.db',
    (err) => {
        if (err) return console.error(err.message);
    });

//create table
sql = 'CREATE TABLE users(id INTEGER PRIMARY KEY, name, short, value)';
db.run(sql);
