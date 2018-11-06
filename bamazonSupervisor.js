var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table3');

let createTable = function () {
    table = new Table( 
        {head: ['Department Name', 'Over-Head-Cost', 'Product Sales', 'Total Profit']})
};
createTable();

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
});

var welcome = "    **********************************************************************\n" +
    "    **********                BAMAZON SUPERVISOR                **********\n" +
    "    **********                Manage departments                **********\n" +
    "    **********************************************************************\n\r"

var departmentMsg;

var goodbye = "    **********************************************************************\n" +
    "    **********           EXTING BAMAZON SUPERVISOR              **********\n" +

    "    **********************************************************************\n\r"

//----  Main menu with user input  ----//
function supervisorMenu() {

    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to do?",
            choices: ["View Products Sales by Department", "Create New Department", "Exit"],
            name: "superDoItem"
        }
    ])
        .then(function (supervisor_menu) {
            switch (supervisor_menu.superDoItem) {
                case "View Products Sales by Department":
                    displayDepartments();
                    break;
                case "Create New Department":
                    addDepartment();
                    break;
                case "Exit":
                    exitBamazonSpvs();
                    break;
            };
        });
};

//----  Display table of inventory items  ----//
function displayDepartments() {

    let query = connection.query(`SELECT departments.department_name, departments.over_head_costs, ` +
        `SUM(products.product_sales) AS product_sales, ` +
        `SUM(products.product_sales) - departments.over_head_costs AS total_profit ` +
        `FROM departments LEFT JOIN products ON departments.department_name = products.department_name ` +
        `GROUP BY departments.department_name;`,
        (function (err, res) {
            if (err) throw err;
            res.forEach(value => {
                table.push([value.department_name, `$${value.over_head_costs}`, `$${value.product_sales}`, `$${value.total_profit}`]);
            });
            console.log(table.toString());
            supervisorMenu();
        }))
        
};


//----  Add a new inventory item  ----//
function addDepartment() {
    //console.log("still working on this")
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department you would like to add? ",
            name: "itemDept"
        },
        {
            type: "input",
            message: "What is the over_head cost for this department?",
            name: "itemCost"
        }
    ])
        .then(function (addDept) {
            connection.query("INSERT INTO departments SET ?",
                {
                    department_name: addDept.itemDept,
                    over_head_costs: addDept.itemCost,
                    product_sales: 0
                },
                function (err, res) {
                    if (err) throw err;

                    departmentMsg = "    " + addDept.itemDept + " department has been added with an over_head_costs of " + addDept.itemCost;
                    console.log(departmentMsg);
                    supervisorMenu();
                }
            );
        });
};

//----  Exit the program  ----//
function exitBamazonSpvs() {
    connection.end();
    console.log(goodbye);
};

console.log(welcome);
supervisorMenu();
