#drop db if exists -- 
DROP DATABASE IF EXISTS bamazon;
#create db
CREATE DATABASE bamazon;
#use db
USE bamazon;
# create products table
CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(200) NOT NULL,
	department_name VARCHAR(200) NOT NULL,
    price INT(10) NOT NULL,
    stock_quantity INT(10) NOT NULL,
	PRIMARY KEY(item_id)
);

# create products table
CREATE TABLE departments(
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(200) NOT NULL,
over_head_costs INT(100) NOT NULL,
PRIMARY KEY (department_id)
);


SELECT * FROM products;

SELECT * FROM departments;

# added product sales column to existing product table
ALTER TABLE products
ADD product_sales INT(100) NOT NULL;
# had to alter column, so new items could be added
ALTER TABLE products
MODIFY product_sales INT(100) DEFAULT 0; 

# insert new departments
INSERT INTO departments (department_name,over_head_costs)
VALUES ("Electronics",10000),("Clothing",60000),("Kitchen",80000), ("Shoes",20000);

# trial join
select * 
from products join departments 
on products.department_name =  departments.department_name;

# lists data by department id with sales, using alias as needed
SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(product_sales) as product_sales, (SUM(product_sales) - departments.over_head_costs) as total_profit
from products left join departments 
on products.department_name = departments.department_name
GROUP BY department_name
ORDER BY (departments.department_id) ASC


