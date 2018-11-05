var mysql = require('mysql');
var inquirer = require('inquirer');
let Table = require('cli-table3');
let table;
const chalk = require('chalk');
let createTable = function () {
    table = new Table({
        head: ["Item Number", "Product Name", "Department", "Price", "Quantity"],
        colWidths: [13, 20, 20, 13, 13],
    });
}; createTable();

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


// Connects to the server, if it successfully connects, console.logs "Successfully connected to the Bamazon Server!" then calls the initialList function.
connection.connect(function (err) {
    if (err) throw err;
    console.log("Successfully connected to the Bamazon Server!");
})


var welcome = "    **********************************************************************\n" +
    "    **********              WELCOME TO BAMAZON                  **********\n" +
    "    **********  Please browse our items and make a purchase     **********\n" +
    "    **********                                                  **********\n" +
    "    **********************************************************************\n\r"

var orderMsg;

var goodbye = "    **********************************************************************\n" +
    "    **********       THANK YOU FOR SHOPPING BAMAZON             **********\n" +
    "    **********          Please visit us again! ;)               **********\n" +
    "    **********                                                  **********\n" +
    "    **********************************************************************\n\r"



//************************************************//
//*****          Start the program           *****//
//************************************************//
//
function checkStock() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log('----------------------------------------------')
        console.log(welcome);
        let red;
        res.forEach(value => {
            if (value.stock_quantity < 5) {
                red = chalk.red(value.stock_quantity);
            } else {
                red = value.stock_quantity;
            }
            table.push([
                value.item_id,
                value.product_name,
                value.department_name,
                chalk.green('$' + value.price),
                red,
            ]);
        });
        console.log(table.toString());
        inquirer.prompt([
            {
                type: "input",
                name: "Item_ID",
                message: "What is the ID of the product you wish to buy?"
            }, {
                type: "input",
                name: "want_quantity",
                message: "How much do you wish to buy?"
            }
        ]).then(function (product) {
            connection.query("SELECT * FROM products JOIN departments ON products.department_name = departments.department_name",
            function (err, res){
                if(err) throw err;
            var x = product.Item_ID;
            var y = product.want_quantity;
            if (y > res[x - 1].stock_quantity) {
                console.log("Insufficient Quantity!");
                connection.end();
            } else {
                console.log("Your order is fulfilled! Your total is $"
                    + (y * res[x - 1].price));
                var query = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            product_sales: (y * res[x - 1].price),
                            stock_quantity: (res[x - 1].stock_quantity - y)
                        },
                        {
                            item_id: x
                        }
                    ],

                    'UPDATE departments SET ? WHERE ?',[
                        {
                            product_sales: (y * res[x - 1].price),

                        },
                        {
                            department_name: x
                        }
                    ]
                )
            };
            continueShopping();
        });


        });

    })

}
checkStock(
);

//----  Ask the user if they would like to continue shopping  ----//
function continueShopping() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to continue shopping? ",
            name: "cont"
        }
    ])
        .then(function (shopping) {
            if (shopping.cont) {
                checkStock();
            }
            else {
                exitBamazon();
            }
        });
};



//----  Say goodbye  ----//
function exitBamazon() {
    connection.end();
    console.log(goodbye);
};
