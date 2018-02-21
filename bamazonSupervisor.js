const mysql = require("mysql");
const inquirer = require("inquirer");
const NewDepartment = require("./NewDepartment.js");
const cTable = require('console.table');

//stand up database 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "redacted",
    database: "bamazon"
})

//Connect to db
connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);

})



//Menu options
inquirer.prompt({
    type: "list",    
    name: "mgrChoice",
    message: "What would you like to do?",
    choices: ["View Product Sales by Department", "Create New Department"]
}).then(function(answer){
    var mgrChoice = answer.mgrChoice
    if (mgrChoice === "View Product Sales by Department") {
        console.log(`Product Sales by Department below:`);
        //show table
        showDptSales();
    }
    if (mgrChoice === "Create New Department") {
        //create new department
        addNewDept();
    }

    })



//show department sales
function showDptSales() {
    connection.query(`SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(product_sales) as product_sales, (SUM(product_sales) - departments.over_head_costs) as total_profit
    from products left join departments 
    on products.department_name = departments.department_name
    GROUP BY department_name
    ORDER BY (departments.department_id) ASC`,function(err, res){
        if (err) throw err;
        console.table(res);
    connection.end(); 
    })
}

//Create New Department 
function addNewDept() {
    inquirer.prompt([
        {
    type: "input",
    name: "ndName",
    message: "What is the new department name?"
    },
    {
    type: "input",
    name: "ndOverHead",
    message: "What is the over head cost to take department on?"
    }
    ]).then(function(answer){;
        var newDept = new NewDepartment(answer.ndName, Number(answer.ndOverHead));
          console.log("Adding new department...\n");
          connection.query(
            "INSERT INTO departments SET ?",
            {
              department_name: newDept.department_name,
              over_head_costs: newDept.over_head_costs
            },
        function(err, res) {
            if (err) throw err; 
            console.log("New Department added!\n");
            }
        );
        connection.end();
    });
}