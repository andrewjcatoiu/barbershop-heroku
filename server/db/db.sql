-- for help do \?
-- to list all created databases do \l
-- to create database do CREATE DATABASE database_name
-- to list all tables do \d

CREATE TABLE customers (
    id BIGSERIAL NOT NULL, 
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone VARCHAR(30) NOT NULL,
    barber VARCHAR(50),
    date VARCHAR(10) NOT NULL,
    time VARCHAR(10) NOT NULL
);

CREATE TABLE admin (
    id BIGSERIAL NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50)
);

CREATE TABLE employees (
    id BIGSERIAL NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50),
    emp_id VARCHAR(7)
);

CREATE TABLE services (
    id BIGSERIAL NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(50),
    price smallint, 
    secondary_description VARCHAR(50),
    image bytea
);

INSERT INTO admin (username, password) VALUES ('studio95', 'admin123');

INSERT INTO employees (first_name, username, password, emp_id) VALUES ('Alla', 'barber1', 'first', 'OxYctR1');
INSERT INTO employees (first_name, username, password, emp_id) VALUES ('Bilijana', 'barber2', 'second', 'ZpLIsW2');
INSERT INTO employees (first_name, username, password, emp_id) VALUES ('Lena', 'barber3', 'third', 'AfGmKq3');
INSERT INTO employees (first_name, username, password, emp_id) VALUES ('Natalija', 'barber4', 'fourth', 'kWhvpI4');
INSERT INTO employees (first_name, username, password, emp_id) VALUES ('Olga', 'barber5', 'fifth', 'GjebtA5');
