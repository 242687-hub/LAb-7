const fs = require("fs");

const fileName = "employees.json";

// Read employee data
let employees = JSON.parse(
    fs.readFileSync(fileName, "utf8")
);

console.log("Existing Employees:");
console.log(employees);

// Add a new employee
const newEmployee = {
    id: 6,
    name: "Zunair",
    department: "BSCS",
    salary: 60000
};

employees.push(newEmployee);

// Save updated data
fs.writeFileSync(
    fileName,
    JSON.stringify(employees, null, 2),
    "utf8"
);

console.log("\nNew employee added successfully!");
console.log("Total Employees:", employees.length);
