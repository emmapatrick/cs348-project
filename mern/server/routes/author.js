import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

import mongoose from "mongoose";
import Author from "../../client/src/models/AuthorModel.js";


// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  try {
    const { gender } = req.query;
    const filter = gender ? { gender } : {};
    const collection = db.collection("authors");
    const results = await collection.find(filter).toArray();
    res.send(results).status(200);
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).send("Error fetching authors");
  }
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("authors");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// creating a new author
router.post("/create-author", async (req, res) => {
  try {
    let newDocument = {
        name: req.body.name,
        dob:  req.body.dob,
        gender: req.body.gender,
    };
    let collection = await db.collection("authors");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding author");
  }
});

// creating a new author using transactions when appropriate
router.post("/create-author", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const newAuthor = await Author.create([req.body], { session: session });
    await session.commitTransaction();

    res.status(200).json({ success: true, data: newAuthor });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
});

// updates author by id
router.patch("/edit-author/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        dob:  req.body.dob,
        gender: req.body.gender,
      },
    };

    let collection = await db.collection("authors");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating author");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("authors");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting author");
  }
});

export default router;
