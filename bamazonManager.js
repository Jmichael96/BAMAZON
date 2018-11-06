var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table3');
let table;
const chalk = require('chalk');
let createTable = function () {
    table = new Table({
        head: ['Item Id', 'Product Name', 'Department Name', 'Price', 'Stock Quantity', 'Product Sales'],
    });
    lowI = new Table({
        head: ['Item Id', 'Product Name', 'Stock Quantity', 'Product Sales'],
    })
    addInventory = new Table({
        head: ['Item Id', 'Product Name', 'Stock Qanutity'],
    })
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

function checkInventory() {
    inquirer.prompt([
        {
            type: "list",
            name: "managerOptions",
            message: "What would you like to do: ",
            choices: [
                'View Products For Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                'Exit',
            ]
        }
    ]).then(function (choices) {
        var a = choices.managerOptions;
        var b = 'View Products For Sale';
        var c = 'View Low Inventory';
        var d = 'Add to Inventory';
        var e = 'Add New Product';
        var f = 'Exit window';
        if (a === b) {
            connection.query('SELECT * FROM products', function (err, res) {
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
                        value.stock_quantity,
                        chalk.green('$' + value.product_sales),

                    ]);
                });
                console.log(table.toString());
                checkInventory();
            })

        }
        if (a === c) {
            connection.query('SELECT * FROM products', function (err, res) {
                res.forEach(value => {
                    if (value.stock_quantity < 5) {
                        lowI.push([
                            value.item_id,
                            value.product_name,
                            value.stock_quantity,
                            chalk.green('$' + value.product_sales),
                        ]);
                        console.log(lowI.toString());
                    } else {
                        console.log(value.product_name + ': No low inventory at this time.\n');
                    }
                });
                checkInventory();
            });
        }
        if (a === d) {
            connection.query("SELECT * FROM products", function (err, res) {
                res.forEach(value => {
                    addInventory.push([
                        value.item_id,
                        value.product_name,
                        value.stock_quantity,
                    ]);
                });
                console.log(addInventory.toString());

                inquirer.prompt([
                    {
                        type: "input",
                        name: "Item_ID",
                        message: "What is the ID of the product you wish to add to?"
                    }, {
                        type: 'input',
                        name: "add_quantity",
                        message: "How much do you want to add?"
                    }
                ]).then(function (product) {
                    var z = product.Item_ID;
                    var x = product.add_quantity;
                    var query = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: (res[z - 1].stock_quantity + Number(x))
                            }, {
                                item_id: z
                            }
                        ]
                    )
                    console.log('You fully stocked Item_Id: ' + z);
                    checkInventory();
                });
            });
        }
        if (a === e) {
            inquirer.prompt([
                {
                    type: "input",
                    name: "product_name",
                    message: "Enter Name of Product"
                }, {
                    type: "input",
                    name: "department_name",
                    message: "What department does this belong to?"
                }, {
                    type: "input",
                    name: "price",
                    message: "How much does each unit cost?"
                }, {
                    type: "input",
                    name: "stock_quantity",
                    message: "How many do we have in stock?"
                }
            ]).then(function (newProduct) {
                var l = newProduct.item_id;
                var m = newProduct.product_name;
                var n = newProduct.department_name;
                var o = newProduct.price;
                var p = newProduct.stock_quantity;

                var query = connection.query(
                    "INSERT INTO products SET ?",
                    {
                        item_id: l,
                        product_name: m,
                        department_name: n,
                        price: o,
                        stock_quantity: p
                    }
                )
                console.log('You added a new item!');
                checkInventory();

            })
        }

        if (a === f) {
            connection.end();
        }

    })

}

checkInventory();
