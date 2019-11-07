var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "Bamazon"
});
connection.query("SELECT * FROM products", function (error, results) {
    if (error) throw error;
    console.log("Item Id, Product Id, Department Name, Price, Stock Quantity");
    for (var i = 0; i < results.length; i++) {
        var item_id = results[i].item_id;
        var product_name = results[i].product_name;
        var department_name = results[i].department_name;
        var price = results[i].price;
        var stock_quantity = results[i].stock_quantity;
        console.log(item_id + "    " + product_name + "     " + department_name + "    " + price + "    " + stock_quantity);


    }

    // Created a series of questions
    inquirer.prompt([

        {
            type: "input",
            name: "product",
            message: "Which product would you like to buy???"
        },

        {
            type: "input",
            name: "quantity",
            message: "how many would you like to buy???"
        }

    ]).then(function (user) {
        var product = user.product
        var quantity = user.quantity
        if (product > results.length || product < 1) {
            console.log("invalid product");
            connection.end();
            return;
        }
        if (quantity > results[product - 1].stock_quantity) {
            console.log("stop trying to hog everything!")
            connection.end();
            return
        }
        var new_quantity = results[product - 1].stock_quantity - quantity;
        connection.query("UPDATE products SET ? WHERE ?", [
            {
                stock_quantity: new_quantity
            },
            {
                item_id: product
            }

        ],
            function (error, results) {
                if (error) throw error;
                console.log("transaction complete");
                connection.end();


            });
    });




});
