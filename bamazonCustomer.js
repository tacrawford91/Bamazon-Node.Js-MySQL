var mysql = require("mysql");
var inquirer = require("inquirer");

var selectedItemNumber;
var quantity;
var stockUpdate;

//stand up database 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Redacted",
    database: "bamazon"
  });
  connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    showWares();
  });

//show whats in database - ids, names, prices
function showWares() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log(`Welcome to Bamazon! Our wares are as follows!`)
      console.log(`Item|Product|Price`)
      res.forEach(element => {
          let item_id = element.item_id;
          let product_name = element.product_name;
          let price = element.price;
          console.log(`${item_id}: ${product_name} @ $${price} each`);        
      });
    //   connection.end();
    buyFunction();
    });
  }


  

//ask what id to buy?
function buyFunction() {
    inquirer.prompt([
        {
    type: "input",
    name: "selectedItemNumber",
    message: "which item number would you like to purchase?"
    },
    {
    type: "input",
    name: "quantity",
    message: "How  many would you like to purchase?"
    }
    ]).then(function(res){
        selectedItemNumber = res.selectedItemNumber;
        quantity = Number(res.quantity);
    // console.log(res)
    checkStock();
    });
}


function checkStock() {
    //get stock of item
    connection.query(`SELECT stock_quantity, price FROM products WHERE item_id=${selectedItemNumber}`, function(err, res) {
        if (err) throw err;
        let stock_quantity = res[0].stock_quantity;
        let price = res[0].price;
        if (quantity < stock_quantity) {
            //subtract amount from stock
            stockUpdate = stock_quantity - quantity;
            //update stock
            updateProduct();       
            //complete purchase 
            console.log(`Thank You! Your total today will be: $${quantity*price}. Enjoy the rest of your day and we hope to see you again soon!`);
            connection.end();
            return
        } else {
            console.log(`sorry insufficent stock. Please try a different day or another one of our great products!`)
            connection.end();
            return
        }
    })
}


function updateProduct() {
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: stockUpdate
        },
        {
          item_id: selectedItemNumber
        }
      ],
      function(err, res) {
        // console.log(res.affectedRows + " products updated!\n");
      }
    );
}
