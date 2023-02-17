const { exportsDB } = require("../routes/db");
const con= exportsDB();
process.on('sql', (sql))
try{
    this.con.query(sql, function (err, result) {
      if (err) throw err; 
      console.log("video guardado en db");
      
    });
    this.con.commit();
      resSQL="succesfull query"; 
  }
  catch (error){
    resSQL =error + " error query:()";
  }