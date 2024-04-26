import express from "express";
import cors from "cors";
import authors from "./routes/author.js";
import books from "./routes/book.js";
import expressSanitizer from "express-sanitizer";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSanitizer());

// sanitize user input for specific routes or fields
app.use("/author", (req, res, next) => {
  if (req.body && req.body.name) {
    // sanitize the name field
    req.body.name = req.sanitize(req.body.name);
  }
  next();
});

app.use("/book", (req, res, next) => {
  if (req.body && req.body.title) {
    // sanitize the title field
    req.body.title = req.sanitize(req.body.title);
  }
  next();
});

app.use("/author", authors);
app.use("/book", books);

// start the express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
