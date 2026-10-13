const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3001;
const DATA_FILE = "books.json";

app.use(express.json());

let books = JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
);

function saveBooks() {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(books, null, 2),
        "utf8"
    );
}

// GET all books
app.get("/books", (req, res) => {
    res.status(200).json(books);
});

// GET book by ID
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(item => item.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// POST a new book
app.post("/books", (req, res) => {
    const { title, author, year } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        !Number.isInteger(year) || year < 1
    ) {
        return res.status(400).json({
            message: "Valid title, author and year are required"
        });
    }

    const newId = books.length
        ? Math.max(...books.map(book => book.id)) + 1
        : 1;

    const newBook = {
        id: newId,
        title: title.trim(),
        author: author.trim(),
        year
    };

    books.push(newBook);
    saveBooks();

    res.status(201).json(newBook);
});

// PUT: Update a book
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(item => item.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, year } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        !Number.isInteger(year) || year < 1
    ) {
        return res.status(400).json({
            message: "Valid title, author and year are required"
        });
    }

    book.title = title.trim();
    book.author = author.trim();
    book.year = year;

    saveBooks();

    res.status(200).json(book);
});

// DELETE a book
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1)[0];
    saveBooks();

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});

app.listen(PORT, () => {
    console.log(`Book API running at http://localhost:${PORT}`);
});
