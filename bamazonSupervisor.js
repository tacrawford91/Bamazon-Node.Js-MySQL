var mysql = require("mysql");
var inquirer = require("inquirer");
// var NewDepartment = require("./NewDepartment.js");

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
        console.log(`Product Sales by Department below:`)
        //show table
        showDptSales();
    }
    if (mgrChoice === "Create New Department") {
        //create new department
    }

    })



//show department sales
function showDptSales() {
    connection.query(`SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(product_sales) as product_sales, (SUM(product_sales) - departments.over_head_costs) as total_profit
    from products right join departments 
    on products.department_name = departments.department_name
    GROUP BY department_name
    ORDER BY (departments.department_id) ASC`,function(err, res){
        if (err) throw err;
        console.log(res[0]);
        res.forEach(element => {
            let department_id = element.department_id;
            let deparment_name = element.department_name;
            let over_head_costs = element.over_head_costs;
            let product_sales = element.product_sales;
            let total_profit = element.total_profit;
            console.log(`${department_id} - ${deparment_name} - OverHead$ ${over_head_costs} - Sales ${product_sales} - Total Profit $ ${total_profit}`);        
        });
    })
}