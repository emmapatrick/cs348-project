// book model for use with mongoose
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publication_year: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;