let express=require("express");

const axios = require("axios"); /*Importing the axios library*/

let app=express();
let {open} =require("sqlite");
let sqlite3=require("sqlite3");
let path=require("path")
let cors=require("cors")
app.use(cors())
app.use(express.json())

let database=null;

let dbPath=path.join(__dirname,"manageTask.db")

let inDataBase=async()=>{

    try{
   database= await open({
        filename:dbPath,
        driver:sqlite3.Database
    });
    app.listen(3000,()=>console.log("Server is Running at :3000"))

}
catch(e){
    console.log(`DB error: ${e.message}`)
    process.exit(1)
}
}

inDataBase()


app.post("/",(request,response)=>{

    const fetchAndInsert = async () => {
      const response = await axios.get(
        "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
      );
      const data = response.data;
    
      for (let item of data) {
        const queryData = `SELECT id FROM transactions WHERE id = ${item.id}`;
        const existingData = await database.get(queryData);
        if (existingData === undefined) {
          const query = `
       INSERT INTO transactions (id, title, price, description, category, image, sold, dateOfSale) 
       VALUES (
           ${item.id},
           '${item.title.replace(/'/g, "''")}',
           ${item.price},
           '${item.description.replace(/'/g, "''")}',
           '${item.category.replace(/'/g, "''")}',
           '${item.image.replace(/'/g, "''")}',
           ${item.sold},
           '${item.dateOfSale.replace(/'/g, "''")}'
       );
    `; /*The .replace(/'/g, "''") in the SQL query helps prevent SQL injection attacks by escaping single quotes.*/
    
          await database.run(query);
        }
      }
      console.log("Transactions added");
    };
    
    fetchAndInsert();





})


app.get("/",async(request,response)=>{

    const dataFetchingFromDatabase=`
    select * from transactions`
    const dataAll=await database.all(dataFetchingFromDatabase)
    response.send(dataAll)
});


