const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = "students.json";

app.use(express.json());

let students = JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
);

function saveStudents() {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(students, null, 2),
        "utf8"
    );
}

// GET: All students
app.get("/students", (req, res) => {
    res.status(200).json(students);
});

// GET: Students by department
app.get("/students/department/:department", (req, res) => {
    const department = req.params.department.toLowerCase();

    const result = students.filter(
        student => student.department.toLowerCase() === department
    );

    res.status(200).json(result);
});

// GET: Student by ID
app.get("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const student = students.find(item => item.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});

// POST: Add student
app.post("/students", (req, res) => {
    const { name, department, semester } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof department !== "string" || !department.trim() ||
        !Number.isInteger(semester) || semester < 1
    ) {
        return res.status(400).json({
            message: "Valid name, department and semester are required"
        });
    }

    const newId = students.length
        ? Math.max(...students.map(item => item.id)) + 1
        : 1;

    const newStudent = {
        id: newId,
        name: name.trim(),
        department: department.trim(),
        semester
    };

    students.push(newStudent);
    saveStudents();

    res.status(201).json(newStudent);
});

// PUT: Update student
app.put("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const student = students.find(item => item.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, department, semester } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof department !== "string" || !department.trim() ||
        !Number.isInteger(semester) || semester < 1
    ) {
        return res.status(400).json({
            message: "Valid name, department and semester are required"
        });
    }

    student.name = name.trim();
    student.department = department.trim();
    student.semester = semester;

    saveStudents();

    res.status(200).json(student);
});

// DELETE: Remove student
app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = students.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const deletedStudent = students.splice(index, 1)[0];
    saveStudents();

    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent
    });
});

app.listen(PORT, () => {
    console.log(`Student API running at http://localhost:${PORT}`);
});
