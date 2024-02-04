SELECT department.department_name, department.id AS department_id
FROM department;
SELECT role.title AS job_title, role.id AS role_id, department.department_name AS department, role.salary
FROM role
JOIN department ON role.department_id = department_id;
SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, department.department_name AS department, role.salary, manager.first_name AS manager_first_name, manager_last_name AS manager_last_name
FROM employee
JOIN role ON employee.role_id = role_id
JOIN department ON role.department_id = department_id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
