DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id integer (5) not null auto_increment,
    product_name varchar (100),
    department_name varchar (100),
    price decimal (10,2),
    stock_quantity integer (5),
    product_sales decimal (10,2) default 0,
    primary key (item_id)
);

insert into products 
(product_name, department_name, price, stock_quantity) 
values
("headlight", "car_parts", 25.50, 2),
("tire", "car_parts", 103.25, 16),
("mufler", "car_parts", 52.65, 8),
("Space", "books", 15, 13),
("Human", "books", 17, 1),
("cookie", "food", 5, 78),
("chocolate bar", "food", 3.5, 53),
("coffee", "food", 13, 100),
("soap", "household_items", 3.25, 145),
("shampoo", "household_items", 12.50, 135),
("toothpaste", "household_items", 6.4, 3),
("PC", "electronics", 200, 20),
("laptop", "electronics", 300, 4);


CREATE TABLE departments (
	department_id integer(5) not null auto_increment,
    department_name varchar (100),
    over_head_costs decimal (20,2),
    primary key (department_id)
);

Insert into departments (department_name, over_head_costs) values 
("car_parts", 100),
("books", 25),
("food", 20),
("household_items", 50),
("electronics", 75);

-- select * from products;
-- select * from departments;


-- 1
-- SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales
-- FROM departments AS d
-- LEFT JOIN products AS p on d.department_name = p.department_name;

-- 2
-- SELECT d.department_id, d.department_name, d.over_head_costs, 
-- SUM(p.product_sales) as 'product_sales'
-- FROM departments AS d
-- LEFT JOIN products AS p on d.department_name = p.department_name GROUP BY department_name;


-- 3
-- SELECT d.department_id, d.department_name, d.over_head_costs, 
-- SUM(p.product_sales) as 'product_sales', (SUM(p.product_sales) - d.over_head_costs) as total_profit 
-- FROM departments AS d
-- LEFT JOIN products AS p on d.department_name = p.department_name GROUP BY department_name;

-- delete from departments where department_id = 6;

-- delete from products where item_id = 5;

-- select department_name from departments;

-- alter table products add product_sales varchar(100);

-- Select item_id, product_name, price, stock_quantity from products where stock_quantity < 5;

-- select stock_quantity, price from products where item_id = 11;

-- update products set stock_quantity = stock_quantity + 100 where item_id = 6;

-- update products set product_sales = product_sales + 50 where item_id = 6; 
