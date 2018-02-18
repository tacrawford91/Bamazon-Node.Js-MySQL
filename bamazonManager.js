var mysql = require("mysql");
var inquirer = require("inquirer");
var NewProduct = require("./NewProduct.js");


var stockUpdate;
var selectedItemNumber;

//stand up database 
  var connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "Makerasll91!",
      database: "bamazon"
  })

  //Connect to db
  connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
  });


//Menu you options
inquirer.prompt({
    type: "list",    
    name: "mgrChoice",
    message: "What would you like to do?",
    choices: ["View Products for sell", "View low inventory", "Add to inventory", "Add new product"]
}).then(function(answer){
    var mgrChoice = answer.mgrChoice
    if (mgrChoice === "View Products for sell") {
        console.log(`Current items for sell below:`)
        //show wares
        showWares();
        connection.end();
    }
    if (mgrChoice === "View low inventory") {
        showLowInv();
    }
    if (mgrChoice === "Add to inventory") {
        console.log(`Current Inventories Below:`)
        addInv();
    }
    if (mgrChoice === "Add new product") {
        addNewProduct();
    }
})
    
function showWares() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log(`Item|Product|Price|Stock`)
      res.forEach(element => {
          let item_id = element.item_id;
          let product_name = element.product_name;
          let price = element.price;
          let stock = element.stock_quantity
          console.log(`${item_id}: ${product_name} - Unit price: $${price} - Current Invetory:${stock} pcs`);        
      });
    });
  }
//Show low inventory
  function showLowInv() {
    connection.query("SELECT * FROM products where stock_quantity < 20", function(err, res) {
      if (err) throw err;
      console.log(`Low Stock Items:`)
      console.log(`Item|Product|Price|Stock`)
      res.forEach(element => {
          let item_id = element.item_id;
          let product_name = element.product_name;
          let price = element.price;
          let stock = element.stock_quantity
          console.log(`${item_id}: ${product_name} - Unit price: $${price} - Current Invetory:${stock} pcs`);        
      });
      connection.end();
    });
  }


//Add to invetory 
function addInv() {
    showWares();
    inquirer.prompt([
        {
    type: "input",
    name: "selectedItemNumber",
    message: "which product number would you like to add inventory to?"
    },
    {
    type: "input",
    name: "quantity",
    message: "How  many would units to be added?"
    }
    ]).then(function(answer){
        selectedItemNumber = Number(answer.selectedItemNumber);
        addedInv = Number(answer.quantity);
        connection.query(`SELECT * FROM products where item_id = ${selectedItemNumber}`, function(err, res) {
        if (err) throw err;
            let product_name = res[0].product_name;
            stockUpdate = res[0].stock_quantity + addedInv;
            console.log(`stock update is ${stockUpdate}`)  
            updateProduct();
        });
    });
}

  function updateProduct() {
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
        stock_quantity: stockUpdate
        },
        {
        item_id: selectedItemNumber
        }
      ], function(err, res) {
            if (err) throw err; 
                // console.log(res.affectedRows + " products updated!\n");
                console.log("added inventory!")
            } 
        );
    connection.end();
}

//new item
function addNewProduct() {
    inquirer.prompt([
        {
    type: "input",
    name: "npName",
    message: "What is the new product name?"
    },
    {
    type: "input",
    name: "npPrice",
    message: "What is the unit price?"
    },
    {
    type: "input",
    name: "npDepartment",
    message: "What which department does the item fall in?"
    },
    {
    type: "input",
    name: "npStock",
    message: "How many pieces?"
    }
    ]).then(function(answer){;
        var newProduct = new NewProduct(answer.npName, Number(answer.npPrice), answer.npDepartment, Number(answer.npStock));
          console.log("Inserting a new product...\n");
          connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: newProduct.name,
              price: newProduct.price,
              department_name: newProduct.department,
              stock_quantity: newProduct.stock
            },
        function(err, res) {
            if (err) throw err; 
            console.log("New product added!\n");
            }
        );
        connection.end();
    });
}