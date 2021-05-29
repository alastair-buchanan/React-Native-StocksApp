const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@HomerNala",
    database: "stockapp"
});

connection.connect(function(err) {
    if(err) throw err;
});

module.exports = (req, res, next) => {
    req.db = connection;
    next();
}