import { useEffect, useState } from "react";

function Books() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editingId, setEditingId] = useState(null);

  // Load books from Local Storage
  useEffect(() => {
    const savedBooks =
      JSON.parse(localStorage.getItem("books")) || [];

    setBooks(savedBooks);
  }, []);

  // Add or update a book
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !author || !genre || !isbn || !quantity) {
      alert("Please fill in all fields.");
      return;
    }

    if (Number(quantity) < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    // Update existing book
    if (editingId !== null) {
      const updatedBooks = books.map((book) => {
        if (book.id === editingId) {
          return {
            ...book,
            title: title,
            author: author,
            genre: genre,
            isbn: isbn,
            quantity: Number(quantity),
          };
        }

        return book;
      });

      setBooks(updatedBooks);

      localStorage.setItem(
        "books",
        JSON.stringify(updatedBooks)
      );

      alert("Book updated successfully.");

      clearForm();

      return;
    }

    // Add new book
    const newBook = {
      id: Date.now(),
      title: title,
      author: author,
      genre: genre,
      isbn: isbn,
      quantity: Number(quantity),
    };

    const updatedBooks = [
      ...books,
      newBook,
    ];

    setBooks(updatedBooks);

    localStorage.setItem(
      "books",
      JSON.stringify(updatedBooks)
    );

    clearForm();
  };

  // Start editing a book
  const handleEdit = (book) => {
    setEditingId(book.id);

    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setQuantity(book.quantity);
  };

  // Cancel editing
  const handleCancel = () => {
    clearForm();
  };

  // Clear form
  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
    setEditingId(null);
  };

  // Delete a book
  const handleDelete = (id) => {
  const bookToDelete = books.find(
    (book) => book.id === id
  );

  const transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

  const hasTransactions = transactions.some(
    (transaction) =>
      transaction.bookTitle === bookToDelete.title
  );

  if (hasTransactions) {
    alert(
      "This book cannot be deleted because it has transaction records."
    );
    return;
  }

  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${bookToDelete.title}"?`
  );

  if (!confirmDelete) {
    return;
  }

  const updatedBooks = books.filter(
    (book) => book.id !== id
  );

  setBooks(updatedBooks);

  localStorage.setItem(
    "books",
    JSON.stringify(updatedBooks)
  );

};
const filteredBooks = books.filter((book) =>
  book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
  book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="books-page">

      <h1>Book Management</h1>

      <p>
        Add, view and manage books in your library.
      </p>

      {/* Add / Edit Book Form */}
      <form onSubmit={handleSubmit}>

        <div>
          <label>Book Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
          />
        </div>

        <div>
          <label>Author</label>

          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
          />
        </div>

        <div>
          <label>Genre</label>

          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Enter genre"
          />
        </div>

        <div>
          <label>ISBN</label>

          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Enter ISBN"
          />
        </div>

        <div>
          <label>Quantity</label>

          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />
        </div>

        <div className="book-form-buttons">

          <button type="submit">
            {editingId !== null
              ? "Update Book"
              : "Add Book"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

        </div>

      </form>

      <hr />

      {/* Books List */}
      <h2>Books</h2>
      <div className="book-search">
        <input
          type="text"
          placeholder="Search by title, author, genre or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {books.length === 0 ? (
        <p>No books have been added.</p>
      ) : filteredBooks.length === 0 ? (
         <p>No books match your search.</p>
      ) : (

        <table>

          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredBooks.map((book) => (

              <tr key={book.id}>

                <td>{book.title}</td>

                <td>{book.author}</td>

                <td>{book.genre}</td>

                <td>{book.isbn}</td>

                <td>{book.quantity}</td>

                <td className="book-actions">

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default Books;