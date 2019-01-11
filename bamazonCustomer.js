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
    runSearch();
});

// create function that will provide a customer with ability to select item he'd like to checkout
function runSearch() {
    var query = "Select item_id, product_name, price, stock_quantity from products";
    connection.query(query, function (err, res) {
        if (err) { throw err }
        else {
            console.log();
            console.log("--- Welcome to Bamazon! Please make your selection below ---")
            console.table(res)
            inquirer
                .prompt([
                    {
                        name: "id",
                        type: "input",
                        message: "Please enter ID of the product you'd like to buy?",
                    },
                    {
                        name: "quantity",
                        type: "input",
                        message: "How many units of this product you'd like to buy?",
                    }
                ])
                .then(function (answer) {
                    processOrder(answer.id, answer.quantity)
                })
        }
    });
};

// create functionality to process an order with the item customer have chosen
function processOrder(id, quantity) {
    connection.query("select item_id from products where item_id = ?",
        [id],
        function (err, res) {
            if (err) { throw err }
            else {
                if (res[0] == undefined) {
                    console.log();
                    console.log("**Please choose correct product ID");
                    runSearch();
                }
                else {
                    connection.query("select stock_quantity, price from products where item_id = ?",
                        [id],
                        function (err, res) {
                            if (err) { throw err }
                            else {
                                if (quantity <= res[0].stock_quantity) {
                                    updatedStock_quantity = res[0].stock_quantity - parseInt(quantity)
                                    connection.query("update products set stock_quantity = ? where item_id = ?",
                                        [updatedStock_quantity, id],
                                        function (err, res) {
                                            if (err) { throw err }
                                        }
                                    )
                                    console.log();
                                    console.log("Confirmed! Your order has been placed.");
                                    console.log("The total cost of your purchase is:$" + (res[0].price * parseInt(quantity)).toFixed(2))
                                    connection.query("update products set product_sales = product_sales + ? where item_id = ?",
                                        [(res[0].price * parseInt(quantity)).toFixed(2), id],
                                        function (err, res) {
                                            if (err) { throw err }
                                        })
                                }
                                else {
                                    console.log();
                                    console.log("**Insufficient quantity! Please choose amount within stock quantity.");
                                    runSearch();
                                }
                            }
                        })
                }
            }
        });
};

