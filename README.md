<img src="https://i.imgur.com/Eom1pC7.png" align="right"
     alt="Logo of cryptostorage" width="222" height="206">

# Crypto Storage
### _A great alternative for bookkeeping asset transactions_ 

Crypto storage is built on Electron.js to be a installable application for windows computers. Replacing tedious Excel spreadsheet manipulation by having a proper interactive UI.

## Features 💡

- Adding and removing a local database
- Switching between different databases
- Adding crypto coins to a database, which in turn allows for adding transactions to those coins
- Adding, editing and removing transactions
- Switching between different coins

## Planned 🚀

- A overview tab for seeing your transactions with more statistics related to them
- A realtime market tab with an ability to search for specific coin pairs and to see information on them
- Storage tab for overall view of all owned assets

## Tech ✨

Crypto Storage is built with React and TypeScript 

- [React](https://react.dev/) - For rendering UI components and state management.
- [TypeScript](https://www.typescriptlang.org/) - For typesafety and better prevention of errors.
- [SQLite](https://www.sqlite.org/index.html) - For creating and editing a local database stored on the users computer.
- [Sass](https://sass-lang.com/) - Improved CSS and readability in styling.
- [NPM](https://www.npmjs.com/) - For package management

And of course Crypto Storage itself is open source with a [public repository](https://github.com/Huxyshuu/cryptostorage) on GitHub, but due to not being finished as of 30.1.2024, it might serve properly.

## Installation
Not yet available 😎

## Usage
Opening Crypto Storage after installation would ideally bring you to the overview tab which isn't yet implemented but designed below with Figma.
![Overview](https://i.imgur.com/jtnCN52.png)

### Database tab
Database files can be changed from the "Database tab", where you can either create a new .db file or pick an existing one from your local files. New coins can be added and existing ones removed and edited. 
![Image of the database tab](https://i.imgur.com/qZhj3BZ.png)

### Transaction tab
Opening the transaction tab allows the user to choose a coin and then enter, edit and remove transaction details using the UI. Changes are then modified to the selected database
![Image of the software](https://i.imgur.com/YeSgzFd.png)
