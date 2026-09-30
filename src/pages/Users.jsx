import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("Student");
  const [registrationDate, setRegistrationDate] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const savedUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    setUsers(savedUsers);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !name ||
      !membershipId ||
      !email ||
      !phone ||
      !userType ||
      !registrationDate
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingId !== null) {
      const updatedUsers = users.map((user) => {
        if (user.id === editingId) {
          return {
            ...user,
            name: name,
            membershipId: membershipId,
            email: email,
            phone: phone,
            userType: userType,
            registrationDate: registrationDate,
          };
        }

        return user;
      });

      setUsers(updatedUsers);

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      alert("User updated successfully.");

      clearForm();

      return;
    }

    const newUser = {
      id: Date.now(),
      name: name,
      membershipId: membershipId,
      email: email,
      phone: phone,
      userType: userType,
      registrationDate: registrationDate,
    };

    const updatedUsers = [
      ...users,
      newUser,
    ];

    setUsers(updatedUsers);

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    alert("User added successfully.");

    clearForm();
  };

  const handleEdit = (user) => {
    setEditingId(user.id);

    setName(user.name);
    setMembershipId(user.membershipId || "");
    setEmail(user.email);
    setPhone(user.phone);
    setUserType(user.userType);
    setRegistrationDate(user.registrationDate);
  };

  const handleCancel = () => {
    clearForm();
  };

  const clearForm = () => {
    setName("");
    setMembershipId("");
    setEmail("");
    setPhone("");
    setUserType("Student");
    setRegistrationDate("");
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const userToDelete = users.find(
      (user) => user.id === id
    );

    if (!userToDelete) {
      return;
    }

    const transactions =
      JSON.parse(localStorage.getItem("transactions")) || [];

    const hasTransactions = transactions.some(
      (transaction) =>
        transaction.studentName === userToDelete.name
    );

    if (hasTransactions) {
      alert(
        "This user cannot be deleted because they have transaction records."
      );
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${userToDelete.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    const updatedUsers = users.filter(
      (user) => user.id !== id
    );

    setUsers(updatedUsers);

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user.membershipId || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.phone
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.userType
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-page">

      <div className="page-header">

        <h1>Users</h1>

        <p>
          Manage library users and membership accounts.
        </p>

      </div>

      <div className="form-card">

        <h2>
          {editingId !== null
            ? "Update User"
            : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">

              <label>Full Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter full name"
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
                placeholder="e.g. LIB001"
              />

            </div>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter email"
              />

            </div>

            <div className="form-group">

              <label>Phone</label>

              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Enter phone number"
              />

            </div>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>Role</label>

              <select
                value={userType}
                onChange={(e) =>
                  setUserType(e.target.value)
                }
              >
                <option value="Student">
                  Student
                </option>

                <option value="Lecturer">
                  Lecturer
                </option>

                <option value="Staff">
                  Staff
                </option>
              </select>

            </div>

            <div className="form-group">

              <label>Registration Date</label>

              <input
                type="date"
                value={registrationDate}
                onChange={(e) =>
                  setRegistrationDate(e.target.value)
                }
              />

            </div>

          </div>

          <div className="form-buttons">

            <button
              type="submit"
              className="primary-button"
            >
              {editingId !== null
                ? "Update User"
                : "Add User"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      <div className="table-card">

        <div className="table-header">

          <h2>Registered Users</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        {users.length === 0 ? (

          <p>No users have been added.</p>

        ) : filteredUsers.length === 0 ? (

          <p>No users match your search.</p>

        ) : (

          <table>

            <thead>

              <tr>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr key={user.id}>

                  <td>{user.name}</td>

                  <td>{user.membershipId}</td>

                  <td>{user.email}</td>

                  <td>{user.phone}</td>

                  <td>{user.userType}</td>

                  <td>{user.registrationDate}</td>

                  <td>

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(user)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(user.id)
                      }
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

    </div>
  );
}

export default Users;