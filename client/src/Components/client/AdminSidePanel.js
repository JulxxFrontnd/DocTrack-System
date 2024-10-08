import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuHome, LuUserSquare2 } from "react-icons/lu";
import { BsBuildingAdd } from "react-icons/bs";
import { MdLogout, MdOutlineContentPasteSearch } from "react-icons/md";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const SidePanel = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [arrowRotated, setArrowRotated] = useState(true);
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    role: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user details and handle token refreshing
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = Cookies.get("accessToken");
      console.log("Access Token:", token);

      // If access token is missing, try to refresh it
      if (!token) {
        console.error("Access token is missing");
        await refreshToken(); // Await refresh to ensure the token is set before retrying
        return;
      }

      try {
        const res = await axios.get("http://localhost:3001/api/user/details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(res.data);
        console.log("User details fetched:", res.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        await refreshToken();
      }
    };

    // Function to refresh the access token using the refresh token
    const refreshToken = async () => {
      const refreshToken = Cookies.get("refreshToken");
      console.log("Refresh Token:", refreshToken); // Log to verify refresh token presence

      if (!refreshToken) {
        console.error("Refresh token is missing");
        navigate("/login"); // Redirect to login if no refresh token
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:3001/api/refresh-token",
          {
            token: refreshToken,
          }
        );
        const newAccessToken = res.data.accessToken;
        console.log("New Access Token:", newAccessToken);

        // Set the new access token in cookies
        Cookies.set("accessToken", newAccessToken, {
          secure: true,
          sameSite: "Strict",
        });

        // Retry fetching user details with the new access token
        await fetchUserDetails();
      } catch (err) {
        console.error("Error refreshing token:", err);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        navigate("/login");
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    setArrowRotated(!arrowRotated);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const { firstname, role } = userDetails;

  const handleLogout = () => {
    const confirmLogout = handlePopup;
    if (confirmLogout) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const [showPopup, setShowPopup] = useState(false);

  const handlePopup = (event) => {
    event.preventDefault();
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const firstLetter = firstname ? firstname.charAt(0).toUpperCase() : "";
  const capitalizeRole = (role) => role.toUpperCase();

  const handleGotoProfile = () => {
    navigate("/user-profile-admin");
  };

  return (
    <>
      <div
        className={`spBackground ${!collapsed ? "visible" : ""}`}
        onClick={toggleCollapse}
      >
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="user">
            <div className="user-acro">
              <h1>{firstLetter}</h1>
            </div>
            <div className="username">
              <ul>
                <li
                  className="user-fullname"
                  title="Go to User Profile?"
                  onClick={handleGotoProfile}
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {firstname}
                </li>

                <li>
                  <small>{capitalizeRole(role)}</small>
                </li>
              </ul>
            </div>
          </div>
          <div className="menus">
            <ul>
              <Link to="/admin">
                <li
                  onClick={scrollToTop}
                  className={isActive("/admin") ? "active" : ""}
                  title="Home Page"
                >
                  <LuHome className="icon" />
                  <p>Home</p>
                </li>
              </Link>

              <Link onClick={scrollToTop} to="/document-tracking">
                <li
                  className={isActive("/document-tracking") ? "active" : ""}
                  title="Track Document Page"
                >
                  <MdOutlineContentPasteSearch className="icon" />
                  <p>Track Document</p>
                </li>
              </Link>

              {/* <Link onClick={scrollToTop} to="/completed">
                <li className={isActive("/completed") ? "active" : ""}>
                  <Tooltip text={"Completed"}>
                    <LuFolderCheck className="icon" />
                  </Tooltip>
                  <p>Completed</p>
                </li>
              </Link> */}

              <Link to="/view-user">
                <li
                  onClick={scrollToTop}
                  className={isActive("/view-user") ? "active" : ""}
                  title="View Users"
                >
                  <LuUserSquare2 className="icon" />

                  <p>View Users</p>
                </li>
              </Link>

              <Link to="/add-office">
                <li
                  onClick={scrollToTop}
                  className={isActive("/add-office") ? "active" : ""}
                  title="View Offices"
                >
                  <BsBuildingAdd className="icon" />

                  <p>View Offices</p>
                </li>
              </Link>
            </ul>
          </div>
          <div
            className={`wiper ${arrowRotated ? "rotated" : ""}`}
            onClick={toggleCollapse}
          >
            <BsArrowLeftCircleFill className="arrow" />
          </div>

          <div className="logout">
            <MdLogout className="icon" title="Logout?" />
            <button onClick={handlePopup} title="Logout?">
              Logout
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-container">
          <div className="popup lgt">
            <label>Are you sure you want to logout?</label>

            <button className="closebtn" onClick={closePopup}>
              <AiFillCloseCircle className="closeicon" />
            </button>

            <div className="yesnobtns">
              <div className="primarybtn" onClick={closePopup}>
                <button class="no-button" autoFocus>
                  No
                </button>
              </div>

              <div className="primarybtn" onClick={handleLogout}>
                <button class="yes-button">Yes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidePanel;