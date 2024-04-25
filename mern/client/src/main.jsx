import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Author from "./components/Author";
import Book from "./components/Book";
import AuthorList from "./components/AuthorList";
import BookList from "./components/BookList";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <>
          <AuthorList />
          <BookList />
          </>
        ),
      },
      {
        path: "/author",
        element: <AuthorList />, // Render AuthorList component for /author path
      },
      {
        path: "/author/:gender", // Define a route to handle gender filtering
        element: <AuthorList />, // Render AuthorList component with gender filtering
      },
    ],
  },
  {
    path: "/create-author",
    element: <App />,
    children: [
      {
        path: "/create-author",
        element: <Author />,
      },
    ],
  },
  {
    path: "/edit-author/:id",
    element: <App />,
    children: [
      {
        path: "/edit-author/:id",
        element: <Author />,
      },
    ],
  },
  {
    path: "/edit-book/:id",
    element: <App />,
    children: [
      {
        path: "/edit-book/:id",
        element: <Book />,
      },
    ],
  },
  {
    path: "/create-book",
    element: <App />,
    children: [
      {
        path: "/create-book",
        element: <Book />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
