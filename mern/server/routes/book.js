import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import Book from "../../client/src/models/BookModel.js";

// router used to define routes
const router = express.Router();

// gets list of all books, including genre filtering
router.get("/", async (req, res) => {
  try {
    const { genre } = req.query;
    const filter = genre ? { genre } : {};
    const collection = db.collection("books");
    const results = await collection.find(filter).toArray();
    res.send(results).status(200);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Error fetching books");
  }
});

// gets book based on id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("books");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// create a new book
router.post("/create-book", async (req, res) => {
  try {
    let newDocument = {
        title: req.body.title,
        author: req.body.author,
        publication_year: req.body.publication_year,
        genre: req.body.genre,
    };
    let collection = await db.collection("books");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding book");
  }
});

// creates a new book using transactions when appropriate
router.post("/create-book", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const newBook = await Book.create([req.body], { session: session });
    await session.commitTransaction();

    res.status(200).json({ success: true, data: newBook });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
});

// updates book by id
router.patch("/edit-book/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        title: req.body.title,
        author: req.body.author,
        publication_year: req.body.publication_year,
        genre: req.body.genre,
      },
    };

    let collection = await db.collection("books");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating book");
  }
});

// deletes book by id
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("books");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});

export default router;
