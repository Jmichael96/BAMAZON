CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (50),
	department_name VARCHAR(50),
    price DECIMAL(10,2) NULL,
    stock_quantity INT NOT NULL,
    product_sales INT NOT NULL,
    PRIMARY KEY(item_id)
    );
    
    INSERT products (product_name, department_name, price, stock_quantity, product_sales)
VALUES 
('Barbell', 'Workout Equipment', 200.0, 100, 0),
('Squat Rack', 'Workout Equipment', 280.0, 100, 0),
('Creatine', 'Athletics Nutrition', 10.0, 100, 0),
('Pre-Workout', 'Athletics Nutrition', 30.0, 100, 0),
('Post-Workout', 'Athletics Nutrition', 25.0, 100, 0),
('Tank Top', 'Sports Wear', 20.0, 100, 0),
('Leggings', 'Sports Wear', 50.0, 100, 0),
('Knee Brace', 'Workout Accessories', 28.0, 100, 0),
('Wrist Wraps', 'Workout Accessories', 15.0, 100, 0),
('Back Belt', 'Workout Accessories', 90.0, 100, 0);
SELECT * FROM products;

CREATE TABLE departments (
	department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR (50) NULL,
    over_head_costs NUMERIC(10,2),
    PRIMARY KEY(department_id)
    );
        
        INSERT INTO departments (department_name, over_head_costs)
    VALUES ('Workout Equipment', 3000),
    ('Athletics Nutrition', 500),
    ('Sports Wear', 275),
    ('Workout Accessories', 350);

    SELECT * FROM departments;