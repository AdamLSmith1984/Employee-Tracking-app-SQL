USE tracker_db;

INSERT INTO department (department_name)
VALUES
("Engineering"),
("Finance"),
("Legal"),
("Sales"),
("Service");

INSERT INTO role (title, salary, department_id)
VALUES
("Sales Lead", 80000, 4),
("Salesperson", 50000, 4),
("Lead Engineer", 100000, 1),
("Software Engineer", 90000, 1),
("Account Manager", 70000, 2),
("Accountant", 80000, 2),
("Legal Team Lead", 120000, 3),
("Lawyer", 100000, 3),
("Customer Service", 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("John", "Doe", 1, NULL),
("Mike", "Chan", 2, 1),
("Ashley", "Rodriguez", 3, 1),
("Kevin", "Tupik", 4, 1),
("Kunal", "Singh", 5, 1),
("Malia", "Brown", 6, 1),
("Sarah", "Lourd", 7, 1),
("Tom", "Allen", 8, 1),
("Sam", "Kash", 9, 1);

