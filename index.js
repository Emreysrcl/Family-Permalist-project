import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import e from "express";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "traslan2003trA",
  port: 5432,
});
db.connect();


let currentUserId = 1;

let users = [
  { id: 1, name: "example" },
  
];

let items = [
  { id: 1, title: "Example" },
  
];
let itemsw = [
  { id: 1, title: "Example" },
  
];
let itemsm = [
  { id: 1, title: "Example" },
  
];
//today list items get functions
async function getItems() {
  const result = await db.query("SELECT * FROM items WHERE user_id=$1 ORDER BY id ASC", [currentUserId]);
  items = result.rows;
  console.log(items);
  return items;
}
//week list items get functions
async function getItemsW() {
  const result = await db.query("SELECT * FROM itemsw WHERE user_id=$1 ORDER BY id ASC", [currentUserId]);
  items = result.rows;
  
  return items;
}
//month list items get functions
async function getItemsM() {
  const result = await db.query("SELECT * FROM itemsm WHERE user_id=$1 ORDER BY id ASC", [currentUserId]);
  items = result.rows;
  
  return items;
 
}

//get current user functions
async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
  return users.find((user) => user.id == currentUserId);
}
//all get routes
app.get("/", async (req, res) => {
  try {
    const result = await getItems();
    const resultw = await getItemsW();
    const resultm = await getItemsM();
    const currentUser= await getCurrentUser();
    
    
    console.log(currentUser);
    console.log(result);
    res.render("index.ejs", {
      //today list
      listTitle: "Today",
      listItems: result,
      //week list
      listTitlew: "Week",
      listItemsw: resultw,
      //month list
      listTitlem: "Month",
      listItemsm: resultm,
      users: users,
      currentUserId : currentUserId,
      itemid : items.id,
    });
  } catch (err) {
    console.log(err);
  }
});


//day add route
app.post("/add", async (req,res)=>{
  const item = req.body.newItem;

  try{
    await db.query("INSERT INTO items (title,user_id) VALUES ($1,$2) ", [item,currentUserId]);
    console.log("Item added!!");
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

//week add route
app.post("/addw", async (req,res)=>{
  const item = req.body.newItemw;

  try{
    await db.query("INSERT INTO itemsw (title,user_id) VALUES ($1,$2) ", [item,currentUserId]);
    console.log("Item added!!");
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

//month add route
app.post("/addm", async (req,res)=>{
  const item = req.body.newItemm;

  try{
    await db.query("INSERT INTO itemsm (title,user_id) VALUES ($1,$2) ", [item,currentUserId]);
    console.log("Item added!!");
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

//day edit route 
app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  const userId = req.body.currentUserId;

  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2 AND user_id = $3", [item, id, userId]);
    console.log("Item updated!!");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//week edit route
app.post("/editw", async (req, res) => {
  const item =req.body.updatedItemTitlew;
  const id = req.body.updatedItemIdw;
  const user_id = req.body.currentUserId;
   
   try{
     await db.query("UPDATE itemsw SET title = ($1) WHERE id =$2 AND user_id=$3", [item , id,user_id] ),
     console.log("Item updated!!")
      res.redirect("/");
   }
   catch(err)
    {
      console.log(err);
    }
});

//month edit route
app.post("/editm", async (req, res) => {
  const item =req.body.updatedItemTitlem;
  const id = req.body.updatedItemIdm;
  const user_id = req.body.currentUserId;
   try{
     await db.query("UPDATE itemsm SET title = ($1) WHERE id =$2 AND user_id=$3", [item , id,user_id]),
     console.log("Item updated!!")
      res.redirect("/");
   }
   catch(err)
    {
      console.log(err);
    }
});


//day delete route
app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  const user_id= req.body.currentUserId;
  try {
    await db.query("DELETE FROM items WHERE id = $1 AND user_id=$2", [id,user_id]);
    
    console.log("Item deleted!!")
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
//week delete route
app.post("/deletew",async (req, res) => {
  const idw = req.body.deleteItemIdweek;
  const user_id= req.body.currentUserId;
  try {
    await db.query("DELETE FROM itemsw WHERE id = $1 AND user_id=$2", [idw,user_id]);
    console.log("Item deleted!!");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//month delete route
app.post("/deletem",async (req, res) => {
  const idm = req.body.deleteItemIdmonth;
  const user_id= req.body.currentUserId;
  try {
    await db.query("DELETE FROM itemsm WHERE id = $1 AND user_id=$2", [idm,user_id]);
    console.log("Item deleted!!");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {
if (req.body.add == "new"){
  res.render("new.ejs");
}
else{
  currentUserId = req.body.user;
  res.redirect("/");
}

});

app.post("/new", async (req, res) => {
 const name = req.body.name;

 const result  = await db.query("INSERT INTO users (name) VALUES ($1) RETURNING *", [name]);

 const id = result.rows[0].id;
  currentUserId = id; 
  res.redirect("/");

});


app.post("/deletetab", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    const users = result.rows; 
    res.render("delete.ejs", {
      users: users
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/deleteuser", async (req, res) => {
  const userId = req.body.user;  // Formdan gelen kullanıcı ID'si

  try {
    
    await db.query("DELETE FROM items WHERE user_id = $1", [userId]);
    await db.query("DELETE FROM itemsw WHERE user_id = $1", [userId]);
    await db.query("DELETE FROM itemsm WHERE user_id = $1", [userId]);
    await db.query("DELETE FROM users WHERE id = $1", [userId]);

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
 



app.listen(port, () => {
  console.log(`Server running on port  http://localhost:${port}`);
});


