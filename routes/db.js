var mysql = require("mysql");

var con = mysql.createConnection({
    user: "desarrollo5",
    password: "AVNS_islzzcql-bjBra_SKJl",
    host: "db-mysql-hq5-do-user-12947639-0.b.db.ondigitalocean.com",
    port: "25060",
    database: "defaultdb"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
function exportsDB(){
    return con
}
module.exports={exportsDB}