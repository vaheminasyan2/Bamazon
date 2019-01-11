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
                "View Product Sales by Department",
                "Create New Department",
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Product Sales by Department":
                    viewProductSales();
                    break;

                case "Create New Department":
                    newDepartment();
                    break;
            }
        });
}

function viewProductSales() {
    var query = "SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) as 'product_sales', (SUM(p.product_sales) - d.over_head_costs) as total_profit FROM departments AS d LEFT JOIN products AS p on d.department_name = p.department_name GROUP BY department_name";
    connection.query(query, function (err, res) {
        if (err) { throw err }
        else {
            console.log();
            console.table(res);
        }
    })
};

function newDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "Please enter the department name"
            },

            {
                name: "costs",
                type: "input",
                message: "Please enter the overhead cost"
            }
        ])
        .then(function (answer) {
            connection.query("insert into departments (department_name, over_head_costs) values (?, ?)",
                [answer.name, answer.costs],
                function (err, res) {
                    if (err) { throw err }
                    else {
                        console.log();
                        console.log("New Department has been added");
                        connection.query("select * from departments where department_name = ?",
                            [answer.name],
                            function (err, res) {
                                if (err) { throw err }
                                else {
                                    console.table(res)
                                }
                            })
                    }
                });
        });
};