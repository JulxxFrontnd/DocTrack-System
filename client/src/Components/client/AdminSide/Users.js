import React, { useState, useEffect } from "react";
import Header from "../Header";
import SidePanel from "../AdminSidePanel";
import Footer from "../Footer";
import { FiUserPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import { LuArchive } from "react-icons/lu";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false); // State for popup visibility
  const [popupUserData, setPopupUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users data from the database
    axios
      .get("http://localhost:3001/view-user")
      .then((response) => {
        // Filter out archived users
        const activeUsers = response.data.filter((user) => !user.isArchived);
        setUsers(activeUsers); // Set the filtered data to the state
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handlePopup = (userId) => {
    setSelectedUserId(userId); // Set the selected user id
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    if (selectedUserId !== null) {
      // Fetch details of the selected user based on the id
      axios
        .get(`http://localhost:3001/api/user/details/${selectedUserId}`)
        .then((response) => {
          setPopupUserData(response.data); // Set the fetched user data for the popup
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [selectedUserId]);

  const handleEditUser = () => {
    navigate(`/update-user/${selectedUserId}`); // Pass selectedUserId in the URL
  };

  const archiveUser = () => {
    axios
      .post(`http://localhost:3001/archive-user/${selectedUserId}`)
      .then((response) => {
        setShowPopup(false);
        setUsers(users.filter((user) => user._id !== selectedUserId));
        // alert(response.data.message);
        setShowPopup2(true);
      })
      .catch((error) => {
        console.error("Error archiving user:", error);
        alert("Failed to archive user.");
      });
    setTimeout(() => {
      setShowPopup2(false);
    }, 1000);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstname} ${user.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="MainPanel">
        <div className="PanelWrapper">
          <div className="PanelHeader">
            <div className="filter viewusers">
              <p>View Users</p>
            </div>
            <div className="navbuttons">
              <div className="adduserbtn secondarybtn">
                <Link to="/add-user" style={{ textDecoration: "none" }}>
                  <button>
                    <FiUserPlus className="icon" />
                    <p>Add User</p>
                  </button>
                </Link>
              </div>

              <div className="adduserbtn nf secondarybtn">
                <Link to="/archived-users" style={{ textDecoration: "none" }}>
                  <button>
                    <LuArchive className="icon" />
                    <p>Archived</p>
                  </button>
                </Link>
              </div>
            </div>
            <div className="search">
              <div className="search-border">
                <IoSearch className="searchIcon" />
                <input
                  type="text"
                  placeholder="Search.."
                  className="search-bar"
                  value={searchTerm} // Bind searchTerm to input value
                  onChange={handleSearchChange} // Handle input change
                ></input>
              </div>
            </div>
          </div>

          <p className="loe">List of Employees</p>

          <div className="usertable content-table">
            <table>
              <thead>
                <tr>
                  <td>#</td>
                  <td>Name</td>
                  <td>Office</td>
                  <td>Position</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>
                      {user.firstname} {user.lastname}
                    </td>
                    <td>{user.office}</td>
                    <td>{user.position}</td>
                    <td>
                      <div className="view-user">
                        <button onClick={() => handlePopup(user._id)}>
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <SidePanel />
      <Footer />

      {showPopup && (
        <div className="popup-container">
          <div className="popup pop-info">
            <p>User Information</p>
            {popupUserData && (
              <ul className="view-userinfo">
                <li>
                  Name:{" "}
                  <strong>
                    {popupUserData.firstname} {popupUserData.lastname}
                  </strong>
                </li>
                <li>
                  Position: <strong>{popupUserData.position}</strong>
                </li>
                <li>
                  Office: <strong>{popupUserData.office}</strong>
                </li>
                <li>
                  Role: <strong>{popupUserData.role}</strong>
                </li>
                <li>
                  Email: <strong>{popupUserData.email}</strong>
                </li>
              </ul>
            )}

            <button className="closebtn" onClick={closePopup}>
              <AiFillCloseCircle className="closeicon" />
            </button>
            <div className="actionbtn">
              <div className="editbtn secondarybtn">
                <button className="ed-btn" onClick={handleEditUser}>
                  Edit
                </button>{" "}
                {/* Call handleEditUser on click */}
              </div>
              <div className="archivebtn secondarybtn">
                <button className="arc-btn" onClick={archiveUser}>
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPopup2 && (
        <div className="popup-container">
          <div className="popup-received">
            <p>User Moved to Archive!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
