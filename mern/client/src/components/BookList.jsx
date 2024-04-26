import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Book = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.book.title}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.book.author}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.book.publication_year}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.book.genre}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit-book/${props.book._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteBook(props.book._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function bookList() {
  const [books, setBooks] = useState([]);
  const [genreFilter, setGenreFilter] = useState("");
  const navigateTo = useNavigate();

  // fetches books from db
  useEffect(() => {
    async function getBooks() {
      let url = `http://localhost:5050/book/`;
      if (genreFilter) {
        url += `?genre=${genreFilter}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const books = await response.json();
      setBooks(books);
    }
    getBooks();
    return;
  }, [books.length, genreFilter]);

  // deletes book by id
  async function deleteBook(id) {
    await fetch(`http://localhost:5050/book/${id}`, {
      method: "DELETE",
    });
    const newBooks = books.filter((el) => el._id !== id);
    setBooks(newBooks);
  }

  // maps out books on the table
  function BookList() {
    return books.map((book) => {
      return (
        <Book
          book={book}
          deleteBook={() => deleteBook(book._id)}
          key={book._id}
        />
      );
    });
  }

  const handleFilterChange = (selectedGenre) => {
    setGenreFilter(selectedGenre);
    navigateTo(`/book${selectedGenre ? `?genre=${selectedGenre}` : ""}`);
  };

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Book Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
        <div>
          <label htmlFor="genreFilter">Filter by Genre:</label>
            <select id="genreFilter" onChange={(e) => handleFilterChange(e.target.value)}>
              <option value="">All</option>
              <option value="Romance">Romance</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Fiction">Fiction</option>
            </select>
          </div>
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Title
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Author
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Publication Year
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Genre
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {BookList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
