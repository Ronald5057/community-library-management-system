import { useEffect, useState } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [type, setType] = useState("Borrow");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const savedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    const savedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    const savedBooks =
      JSON.parse(localStorage.getItem("books")) || [];

    setTransactions(savedTransactions);
    setUsers(savedUsers);
    setBooks(savedBooks);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bookTitle || !type || !quantity || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    if (type === "Borrow" && !studentName) {
      alert("Please select a student.");
      return;
    }

    const transactionQuantity = Number(quantity);

    if (transactionQuantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    const selectedBook = books.find(
      (book) => book.title === bookTitle
    );

    if (!selectedBook) {
      alert("Selected book was not found.");
      return;
    }

    /* =========================
       ADD STOCK
    ========================= */

    if (type === "Add Stock") {
      const updatedBooks = books.map((book) => {
        if (book.id === selectedBook.id) {
          return {
            ...book,
            quantity:
              Number(book.quantity) + transactionQuantity,
          };
        }

        return book;
      });

      setBooks(updatedBooks);

      localStorage.setItem(
        "books",
        JSON.stringify(updatedBooks)
      );
    }

    /* =========================
       BORROW
    ========================= */

    if (type === "Borrow") {
      if (
        transactionQuantity >
        Number(selectedBook.quantity)
      ) {
        alert(
          `Only ${selectedBook.quantity} copies of this book are available.`
        );

        return;
      }

      const updatedBooks = books.map((book) => {
        if (book.id === selectedBook.id) {
          return {
            ...book,
            quantity:
              Number(book.quantity) -
              transactionQuantity,
          };
        }

        return book;
      });

      setBooks(updatedBooks);

      localStorage.setItem(
        "books",
        JSON.stringify(updatedBooks)
      );
    }

    /* =========================
       RETURN
    ========================= */

    if (type === "Return") {
      if (!studentName) {
        alert("Please select a student.");
        return;
      }

      const borrowedQuantity = transactions
        .filter(
          (transaction) =>
            transaction.bookTitle === bookTitle &&
            transaction.type === "Borrow"
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.quantity),
          0
        );

      const returnedQuantity = transactions
        .filter(
          (transaction) =>
            transaction.bookTitle === bookTitle &&
            transaction.type === "Return"
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.quantity),
          0
        );

      const currentlyBorrowed =
        borrowedQuantity - returnedQuantity;

      if (currentlyBorrowed === 0) {
        alert("This book has not been borrowed.");
        return;
      }

      if (
        transactionQuantity >
        currentlyBorrowed
      ) {
        alert(
          `Only ${currentlyBorrowed} copies of this book are currently borrowed.`
        );

        return;
      }

      const updatedBooks = books.map((book) => {
        if (book.id === selectedBook.id) {
          return {
            ...book,
            quantity:
              Number(book.quantity) +
              transactionQuantity,
          };
        }

        return book;
      });

      setBooks(updatedBooks);

      localStorage.setItem(
        "books",
        JSON.stringify(updatedBooks)
      );
    }

    /* =========================
       CREATE TRANSACTION
    ========================= */

    const newTransaction = {
      id: Date.now(),
      studentName:
        type === "Add Stock"
          ? "Library"
          : studentName,
      bookTitle: bookTitle,
      type: type,
      quantity: transactionQuantity,
      date: date,
    };

    const updatedTransactions = [
      ...transactions,
      newTransaction,
    ];

    setTransactions(updatedTransactions);

    localStorage.setItem(
      "transactions",
      JSON.stringify(updatedTransactions)
    );

    setStudentName("");
    setBookTitle("");
    setType("Borrow");
    setQuantity("");
    setDate("");

    alert("Transaction recorded successfully.");
  };

  const handleDelete = (id) => {
    const transactionToDelete =
      transactions.find(
        (transaction) =>
          transaction.id === id
      );

    if (!transactionToDelete) {
      return;
    }

    const selectedBook = books.find(
      (book) =>
        book.title ===
        transactionToDelete.bookTitle
    );

    if (selectedBook) {
      let updatedQuantity =
        Number(selectedBook.quantity);

      if (
        transactionToDelete.type === "Borrow"
      ) {
        updatedQuantity += Number(
          transactionToDelete.quantity
        );
      }

      if (
        transactionToDelete.type === "Return"
      ) {
        updatedQuantity -= Number(
          transactionToDelete.quantity
        );
      }

      if (
        transactionToDelete.type === "Add Stock"
      ) {
        updatedQuantity -= Number(
          transactionToDelete.quantity
        );
      }

      if (updatedQuantity < 0) {
        updatedQuantity = 0;
      }

      const updatedBooks = books.map(
        (book) => {
          if (book.id === selectedBook.id) {
            return {
              ...book,
              quantity: updatedQuantity,
            };
          }

          return book;
        }
      );

      setBooks(updatedBooks);

      localStorage.setItem(
        "books",
        JSON.stringify(updatedBooks)
      );
    }

    const updatedTransactions =
      transactions.filter(
        (transaction) =>
          transaction.id !== id
      );

    setTransactions(updatedTransactions);

    localStorage.setItem(
      "transactions",
      JSON.stringify(updatedTransactions)
    );
  };

  const filteredTransactions =
    transactions.filter(
      (transaction) =>
        transaction.studentName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        transaction.bookTitle
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        transaction.type
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        transaction.date
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );

  return (
    <div className="transactions-page">

      <div className="page-header">

        <h1>Transactions</h1>

        <p>
          Manage book stock, borrowing, returns,
          and transaction history.
        </p>

      </div>


      {/* Transaction Form */}
      <div className="form-card">

        <h2>Record Transaction</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">

              <label>Student</label>

              <select
                value={studentName}
                onChange={(e) =>
                  setStudentName(e.target.value)
                }
                disabled={type === "Add Stock"}
              >

                <option value="">
                  Select Student
                </option>

                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.name}
                  >
                    {user.name}
                  </option>
                ))}

              </select>

            </div>


            <div className="form-group">

              <label>Book</label>

              <select
                value={bookTitle}
                onChange={(e) =>
                  setBookTitle(e.target.value)
                }
              >

                <option value="">
                  Select Book
                </option>

                {books.map((book) => (
                  <option
                    key={book.id}
                    value={book.title}
                  >
                    {book.title} (
                    {book.quantity} available)
                  </option>
                ))}

              </select>

            </div>

          </div>


          <div className="form-row">

            <div className="form-group">

              <label>Transaction Type</label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >

                <option value="Borrow">
                  Borrow
                </option>

                <option value="Return">
                  Return
                </option>

                <option value="Add Stock">
                  Add Stock
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>Quantity</label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="Enter quantity"
              />

            </div>


            <div className="form-group">

              <label>Date</label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />

            </div>

          </div>


          <div className="form-buttons">

            <button
              type="submit"
              className="primary-button"
            >
              Record Transaction
            </button>

          </div>

        </form>

      </div>


      {/* Transaction History */}
      <div className="table-card">

        <div className="table-header">

          <h2>Transaction History</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>


        {transactions.length === 0 ? (

          <p>
            No transactions have been recorded.
          </p>

        ) : filteredTransactions.length === 0 ? (

          <p>
            No transactions match your search.
          </p>

        ) : (

          <table>

            <thead>

              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredTransactions.map(
                (transaction) => (

                  <tr
                    key={transaction.id}
                  >

                    <td>
                      {transaction.studentName}
                    </td>

                    <td>
                      {transaction.bookTitle}
                    </td>

                    <td>
                      {transaction.type}
                    </td>

                    <td>
                      {transaction.quantity}
                    </td>

                    <td>
                      {transaction.date}
                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            transaction.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default Transactions;