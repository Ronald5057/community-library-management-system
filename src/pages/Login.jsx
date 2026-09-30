import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !membershipId) {
      setError("Please enter your name and membership ID.");
      return;
    }

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (user) =>
        user.name.toLowerCase() === name.toLowerCase() &&
        user.membershipId === membershipId
    );

    if (!user) {
      setError("Invalid name or membership ID.");
      return;
    }

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(user)
    );

    navigate("/");
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Community Library</h1>

        <h2>User Login</h2>

        <p>
          Login using your library membership details.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
            />

          </div>

          <div className="form-group">

            <label>Membership ID</label>

            <input
              type="text"
              value={membershipId}
              onChange={(e) =>
                setMembershipId(e.target.value)
              }
              placeholder="Enter membership ID"
            />

          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;