import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Author = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.author.name}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.author.dob}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.author.gender}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit-author/${props.author._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteAuthor(props.author._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function authorList() {
  const [authors, setAuthors] = useState([]);
  const [genderFilter, setGenderFilter] = useState("");
  const navigateTo = useNavigate();

  // This method fetches the records from the database.
  useEffect(() => {
    async function getAuthors() {
      let url = `http://localhost:5050/author/`;
      if (genderFilter) {
        url += `?gender=${genderFilter}`;
      }
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const authors = await response.json();
      setAuthors(authors);
    }
    getAuthors();
    return;
  }, [authors.length, genderFilter]);

  // This method will delete a record
  async function deleteAuthor(id) {
    await fetch(`http://localhost:5050/author/${id}`, {
      method: "DELETE",
    });
    const newAuthors = authors.filter((el) => el._id !== id);
    setAuthors(newAuthors);
  }

  // This method will map out the records on the table
  function AuthorList() {
    return authors.map((author) => {
      return (
        <Author
          author={author}
          deleteAuthor={() => deleteAuthor(author._id)}
          key={author._id}
        />
      );
    });
  }

  const handleFilterChange = (selectedGender) => {
    setGenderFilter(selectedGender);
    navigateTo(`/author${selectedGender ? `?gender=${selectedGender}` : ""}`);
    console.log(selectedGender);
  };

  // This following section will display the table with the records of individuals.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Author Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
        <div>
            <label htmlFor="genderFilter" className="mr-2">Filter by Gender:</label>
            <select id="genderFilter" onChange={(e) => handleFilterChange(e.target.value)}>
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Nonbinary">Nonbinary</option>
            </select>
          </div>
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Birth Year
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Gender
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {AuthorList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
