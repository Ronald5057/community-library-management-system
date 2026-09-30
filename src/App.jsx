import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        {/* Sidebar */}
        <aside className="sidebar">

          {/* Library Name */}
          <div className="sidebar-header">
            <h2>Community</h2>
            <h2>Library</h2>
            <p>Management System</p>
          </div>

          {/* Navigation Menu */}
          <nav className="menu">

            <p className="menu-title">MAIN MENU</p>

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/books"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              Books
            </NavLink>

            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              Transactions
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              Users
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              Login
            </NavLink>

          </nav>

          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            <p>Library Management</p>
            <small>System v1.0</small>
          </div>

        </aside>

        {/* Main Content */}
        <main className="main-content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/books"
              element={<Books />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/users"
              element={<Users />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;