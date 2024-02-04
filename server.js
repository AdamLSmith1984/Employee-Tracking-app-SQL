const express = require("express");
const mysql = require("mysql2");
const inquier = require("inquirer");

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
    return inquier.prompt([
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