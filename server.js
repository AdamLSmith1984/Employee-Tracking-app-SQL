const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static("public"));


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tracker_db",
});


const question = () => {
    return inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "question",
            choices: [
                "Add Employee",
                "View All Employees",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit",
            ]
        }
    ])
};



const init = () => {
    question().then((answers) => {
        const { question } = answers;
        if (question === "View All Departments") {
            const sql = `SELECT id AS department_id, department_name AS department FROM department`;
            db.query(sql, (err, res) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                } else {
                    console.table(res);
                    init();
                }
            });
        } else if (question === "View All Roles") {
            const sql = `SELECT role.id AS role_id, role.title AS job_title, department.department_name AS department, role.salary FROM role JOIN department ON role.department_id = department.id`;
            db.query(sql, (err, res) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                } else {
                    console.table(res);
                    init();
                }
            });
        } else if (question === "View All Employees") {
            const sql = `SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, department.department_name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
            db.query(sql, (err, res) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                } else {
                    console.table(res);
                    init();
                }
            });
        } else if (question === "Add Department") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the name of the department?",
                    name: "department"
                }
            ])
            .then(answers => {
                const sql = `INSERT INTO department (department_name) VALUES (?)`;
                const params = [answers.department];
                db.query(sql, params, (err, res) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                } else {
                    console.log("\nDepartment has been added successfully\n");
                    init();
                }
                });
        });
    } else if (question === "Add Role") {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the role?",
                name: "role"
            },
            {
                type: "input",
                message: "What is the salary of the role?",
                name: "roleSalary"
            },
            {
                type: "list",
                message: "Which department does the role belong to?",
                name: "roleDepartment",
                choices: async function() {
                    const [rows] = await db.promise().query(
                        `SELECT id, department_name FROM department;`
                    );
                    return rows.map(row => ({
                        value: row.id,
                        name: row.department_name
                    }));
                } 
            }           
        ])
        .then(answers => {
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [answers.role, answers.roleSalary, answers.roleDepartment];
            db.query(sql, params, (err, res) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                } else {
                    console.log("\nEmployee role has been added successfully\n")
                    init();
                }
            });
        })
    } else if (question === "Add Employee") {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "employeeFirst"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "employeeLast"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "employeeRole",
                choices: async function() {
                    const [rows] = await db.promise().query(
                        `SELECT role.id AS value, role.title AS name FROM role;`
                    );
                    return rows;
            }
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            name: "employeeManager",
            choices: async function() {
                const [rows] = await db.promise().query(
                    `SELECT employee.id AS value, CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee WHERE employee.role_id IN (SELECT id FROM role WHERE manager_id = true);`
                );
                return rows;
            }
        }
        ])
        .then(answers => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            const params = [
                answers.employeeFirst,
                answers.employeeLast,
                answers.employeeRole,
                answers.employeeManager,
            ];
            db.query(sql, params, (err, res) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                } else {
                    console.log("\nEmployee has been added successfully\n")
                    init();
                }
            });
        });
    } else if (question === "Update Employee Role") {
        inquirer.prompt([
            {
                type: "list",
                message: "Which Employee's role do you want to update?",
                name: "employee_id",
                choices: async function() {
                    const [rows] = await db.promise().query(
                        `SELECT employee.id AS value, CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee;`
                    );
                    return rows;
                }
            },
            {
                type: "list",
                message: "Which role do you want to assign the selected employee?",
                name: "role_id",
                choices: async function() {
                    const [rows] = await db.promise().query(
                        `SELECT role.id AS value, role.title AS name FROM role;`
                    );
                    return rows
                }
            }
        ])
        .then(answers => {
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            const params = [answers.role_id, answers.employee_id];
            db.query(sql, params, (err, res) => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                } else {
                    console.log("\nEmployee role has been updated successfully\n")
                    init();
                }
            })
        });
    } else if (question === "Quit") {
        console.log("\nGoodbye!")
        process.exit(1);
    }    
})
}

init();


app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => console.log(`\nServer running on port ${PORT}`));