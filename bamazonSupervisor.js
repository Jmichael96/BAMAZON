var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table3');

// let createTable = function () {
//     departmentT = new Table('Department Id', 'Department Name', 'Over-Head-Cost', 'Product Sales', 'Total Profit')
// };
// createTable();

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

connection.connect(function(err) {
    if (err) throw err;
	});

//--  table and formatting  --//
//************************************************//
//*****    declare global variables          *****//
//************************************************//
//

	var welcome = "    **********************************************************************\n" +
				  "    **********                BAMAZON SUPERVISOR                **********\n" +
				  "    **********                Manage departments                **********\n" +
				  "    **********                                                  **********\n" +
				  "    **********************************************************************\n\r"

	var departmentMsg;

	var goodbye = "    **********************************************************************\n" +
				  "    **********           EXTING BAMAZON SUPERVISOR              **********\n" +
				  "    **********           Making money every day!                **********\n" +
				  "    **********                                                  **********\n" +
				  "    **********************************************************************\n\r"



//************************************************//
//*****           global functions           *****//
//************************************************//
//
//----  Main menu with user input  ----//
	function supervisorMenu(){

		inquirer.prompt([
		 	{
			    type: "list",
			    message: "What do you want to do?",
			    choices: ["View Products Sales by Department", "Create New Department", "Exit"],
			    name: "superDoItem"
		  	}
	  	])
		.then(function(supervisor_menu) {
			switch(supervisor_menu.superDoItem){
				case "View Products Sales by Department":
					displayDepartments();
					break;
				case "Create New Department":
					addDepartment();
					break;
				case "Exit":
					exitBamazonMgr();
					break;
			};
		});
	};

//----  Display table of inventory items  ----//
	function displayDepartments() {

		connection.query("SELECT * FROM departments", function(err, res) {
		    if (err) throw err;

		    //console.log(" Reached first function")
			var table = new Table({
				head: ["Department Id", "Department Name", "Over head Costs", "product sales", "Profit"],
				});
            res.forEach(value => {
                var profits = value.product_sales - value.over_head_costs
                table.push([
                    value.department_id,
                    value.department_name,
                    value.over_head_costs,
                    value.product_sales,
                    profits
                ]);
            });
            console.log(table.toString());

			supervisorMenu();
		});
	};


//----  Add a new inventory item  ----//
	function addDepartment(){
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
				function(err, res) {
					if(err) throw err;

					departmentMsg = "    " + addDept.itemDept + " department has been added with an over_head_costs of " + addDept.itemCost ;
					console.log(departmentMsg);
					supervisorMenu();
				}
			);
		});
	};

//----  Exit the program  ----//
	function exitBamazonMgr(){
		connection.end();
		console.log(goodbye);
	};




//************************************************//
//*****          Start the program           *****//
//************************************************//
//
	
	console.log(welcome);
	supervisorMenu();

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Successfully connected to the Bamazon Server!");
//   })

// function supervisorLog() {
//     inquirer.prompt({
//         type: "list",
//         name: "Supervisor Options",
//         message: "What would you like to do: ",
//         choices: [
//             'View Product Sales by Department',
//             'Create New Department',
//             'Exit',
//         ]
//     }).then(function (answer) {
//         switch (answer.action) {
//             case 'View Product Sales by Department':
//                 productDepartment();
//                 break;

//             case 'Create New Department':
//                 break;

//             case 'Exit':
//                 break;
//         }

//         function productDepartment() {
//             connection.query('SELECT * FROM departments', function (err, res) {
//                 if(err) throw 'you have an error';
//                 res.forEach(value => {
//                     let total_profits = val.total_sales - val.over_head_costs; 
//                     departmentT.push([
//                         value.department_id,
//                         value.department_name,
//                         value.over_head_costs,
//                         value.total_sales,
//                         total_profits,
//                     ]);
//                 });
//                 console.log(departmentT.toString());
//                 supervisorLog();
//             })

//         }
//     });
// };
// supervisorLog();
