import { useEffect, useState } from "react";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const loadData = () => {
    const savedBooks =
      JSON.parse(localStorage.getItem("books")) || [];

    const savedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    const savedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    setBooks(savedBooks);
    setUsers(savedUsers);
    setTransactions(savedTransactions);
  };

  useEffect(() => {
    loadData();

    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const availableCopies = books.reduce(
    (total, book) =>
      total + Number(book.quantity),
    0
  );

  const borrowedCopies = transactions
    .filter(
      (transaction) =>
        transaction.type === "Borrow"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.quantity),
      0
    );

  const returnedCopies = transactions
    .filter(
      (transaction) =>
        transaction.type === "Return"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.quantity),
      0
    );

  const currentlyBorrowed =
    borrowedCopies - returnedCopies;

  return (
    <div className="dashboard">

      {/* Dashboard Header */}
      <div className="dashboard-header">

        <h1>Dashboard</h1>

        <p>
          Welcome to the Community Library Management System.
        </p>

      </div>


      {/* Summary Cards */}
      <div className="dashboard-cards">

        <div className="dashboard-card">

          <h3>Book Titles</h3>

          <p>{books.length}</p>

        </div>


        <div className="dashboard-card">

          <h3>Available Copies</h3>

          <p>{availableCopies}</p>

        </div>


        <div className="dashboard-card">

          <h3>Registered Users</h3>

          <p>{users.length}</p>

        </div>


        <div className="dashboard-card">

          <h3>Currently Borrowed</h3>

          <p>{currentlyBorrowed}</p>

        </div>

      </div>


      {/* Library Overview */}
      <div className="dashboard-overview">

        <h2>Library Overview</h2>

        <p>
          The library currently has{" "}
          <strong>{books.length}</strong>{" "}
          different book titles.
        </p>

        <p>
          There are{" "}
          <strong>{availableCopies}</strong>{" "}
          available book copies.
        </p>

        <p>
          The system has{" "}
          <strong>{users.length}</strong>{" "}
          registered users.
        </p>

        <p>
          There are currently{" "}
          <strong>{currentlyBorrowed}</strong>{" "}
          borrowed book copies.
        </p>

        <p>
          A total of{" "}
          <strong>{transactions.length}</strong>{" "}
          transactions have been recorded.
        </p>

      </div>


      {/* Book Availability */}
      <div className="dashboard-overview">

        <h2>Book Availability</h2>

        {books.length === 0 ? (

          <p>
            No books have been added yet.
          </p>

        ) : (

          <table>

            <thead>

              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Available Copies</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {books.map((book) => {

                const quantity =
                  Number(book.quantity);

                const isLowStock =
                  quantity < 2;

                return (
                  <tr
                    key={book.id}
                    className={
                      isLowStock
                        ? "low-stock-row"
                        : ""
                    }
                  >

                    <td>{book.title}</td>

                    <td>{book.author}</td>

                    <td>{book.genre}</td>

                    <td>
                      {quantity}
                    </td>

                    <td>

                      {isLowStock ? (
                        <span className="low-stock">
                          Low Stock
                        </span>
                      ) : (
                        <span className="available-stock">
                          Available
                        </span>
                      )}

                    </td>

                  </tr>
                );

              })}

            </tbody>

          </table>

        )}

      </div>


      {/* Recent Transactions */}
      <div className="dashboard-overview recent-transactions">

        <h2>Recent Transactions</h2>

        {transactions.length === 0 ? (

          <p>
            No transactions have been recorded yet.
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
              </tr>

            </thead>

            <tbody>

              {transactions
                .slice(-5)
                .reverse()
                .map((transaction) => (

                  <tr key={transaction.id}>

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

                  </tr>

                ))}

            </tbody>

          </table>

        )}

      </div>


      {/* Dashboard Footer */}
      <div className="dashboard-footer">

        <p>
          Community Library Management System
        </p>

        <span>
          System Version 1.0
        </span>

      </div>

    </div>
  );
}

export default Dashboard;