DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(200) NOT NULL,
	department_name VARCHAR(200) NOT NULL,
    price INT(10) NOT NULL,
    stock_quantity INT(10) NOT NULL,
	PRIMARY KEY(item_id)
);

CREATE TABLE departments(
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(200) NOT NULL,
over_head_costs INT(100) NOT NULL,
PRIMARY KEY (department_id)
);


SELECT * FROM products;

SELECT * FROM departments;

ALTER TABLE products
ADD product_sales INT(100) NOT NULL;

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Electronics",10000),("Clothing",60000),("Kitchen",80000), ("Shoes",20000);

select * 
from products join departments 
on products.department_name =  departments.department_name;

SELECT SUM(product_sales), department_name
FROM products
GROUP BY department_name
ORDER BY (product_sales) DESC;

SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(product_sales)
from products right join departments 
on products.department_name = departments.department_name
GROUP BY department_name
ORDER BY (departments.department_id) ASC;
