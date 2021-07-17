//info for connect to the mysql database
//currently hosted on ...
const mysql = require("mysql");

var config = {
    connectionLimit: 100,
    host: " ",
    user: " ",
    password: " ",
    database: " "
};

var pool = mysql.createPool(config);


module.exports = pool;
