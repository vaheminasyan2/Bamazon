require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys");


// create connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys.mysql.password,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    runApp();
});

function runApp() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInv();
                    break;

                case "Add to Inventory":
                    addInv();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }
        });
}

function viewProducts() {
    var query = "Select item_id, product_name, price, stock_quantity from products";
    connection.query(query, function (err, res) {
        if (err) { throw err }
        else {
            console.table(res);
        }
    });
};

function viewLowInv() {
    var query = "Select item_id, product_name, price, stock_quantity from products where stock_quantity < 5";
    connection.query(query, function (err, res) {
        if (err) { throw err }
        else {
            if (res[0] == undefined) {
                console.log("Your inventory isn't low")
            }
            else {
                console.table(res)
            }
        }
    });
};

function addInv() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "Please enter ID of the product you'd like to add more to Inventory?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units of this product you'd like to add to Inventory?"
            }
        ])
        .then(function (answer) {
            processAddInv(answer.id, answer.quantity);
        });

    function processAddInv(id, quantity) {
        connection.query("select item_id from products where item_id = ?",
            [id],
            function (err, res) {
                if (err) { throw err }
                else {
                    if (res[0] == undefined) {
                        console.log();
                        console.log("**Please choose correct product ID");
                        addInv();
                    }
                    else {
                        connection.query("update products set stock_quantity = stock_quantity + ? where item_id = ?;",
                            [parseInt(quantity), id],
                            function (err, res) {
                                if (err) { throw err }
                            });
                        console.log();
                        console.log("Inventory has been updated!");
                        connection.query("select * from products where item_id = ?",
                            [id],
                            function (err, res) {
                                if (err) { throw err }
                                else {
                                    console.table(res);
                                }
                            })
                    }
                }
            });
    };
};

// Scan through the product table and pick unique department names. Store them in the departments array
function addProduct() {  
    var departments = [];
    connection.query("select department_name from departments", function (err, res) {
        if (err) { throw err }
        else {
            for (var i = 0; i < res.length; i++) {
                departments.push(res[i].department_name);
            }
        }
    });

    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Please enter the product name"
            },

            {
                name: "department",
                type: "list",
                message: "Please select department this product belongs to",
                choices: departments,
            },

            {
                name: "price",
                type: "input",
                message: "Please enter price of the product"
            },

            {
                name: "quantity",
                type: "input",
                message: "Please enter stock quanitity"
            }
        ])
        .then(function (answer) {
            connection.query("insert into products (product_name, department_name, price, stock_quantity) values (?, ?, ?, ?)",
                [answer.name, answer.department, answer.price, answer.quantity],
                function (err, res) {
                    if (err) { throw err }
                    else {
                        console.log();
                        console.log("Inventory has been updated!");
                        connection.query("select * from products where product_name = ?",
                            [answer.name],
                            function (err, res) {
                                if (err) { throw err }
                                else {
                                    console.table(res);
                                }
                            })
                    }
                })
        })
};