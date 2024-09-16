import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuHome, LuUserSquare2 } from "react-icons/lu";
import { BsBuildingAdd } from "react-icons/bs";

import { MdLogout, MdOutlineContentPasteSearch } from "react-icons/md";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchUserDetails = () => {
      const token = localStorage.getItem("token");
      console.log("Token Retrieved", token);
      if (!token) {
        console.error("Token is missing");
        navigate("/"); // Redirect to login page if token is missing
        return;
      }

      axios
        .get("http://localhost:3001/api/user/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserDetails(response.data);
          console.log("User details fetched:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          if (error.response && error.response.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
            navigate("/");
          }
        });
    };

    fetchUserDetails();
  }, [navigate]); // Dependency array should include 'navigate'

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
      window.location.href = "/";
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

  const Tooltip = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    return (
      <div
        className="tooltip-container"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
        {isVisible && (
          <div
            className="tooltip"
            style={{
              top: `${tooltipPosition.y}px`,
              left: `${tooltipPosition.x}px`,
            }}
          >
            {text}
          </div>
        )}
      </div>
    );
  };

  const TooltipUser = ({ text, children }) => {
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    const handleMouseMove = (e) => {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    return (
      <div
        className="tooltipUser-container"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        {visible && (
          <div
            className="tooltipUser"
            style={{
              top: `${tooltipPosition.y}px`,
              left: `${tooltipPosition.x}px`,
            }}
          >
            {text}
          </div>
        )}
      </div>
    );
  };

  const firstLetter = firstname ? firstname.charAt(0).toUpperCase() : "";
  const capitalizeRole = (role) => role.toUpperCase();

  const handleGotoProfile = () => {
    navigate("/user-profile");
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
              <TooltipUser text={"View Profile"}>
                <h1>{firstLetter}</h1>
              </TooltipUser>
            </div>
            <div className="username">
              <ul>
                <li
                  className="user-fullname"
                  onClick={handleGotoProfile}
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  <TooltipUser text={"View Profile"}>{firstname}</TooltipUser>
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
                >
                  <Tooltip text={"Home"}>
                    <LuHome className="icon" />
                  </Tooltip>
                  <p>Home</p>
                </li>
              </Link>

              <Link onClick={scrollToTop} to="/document-tracking">
                <li className={isActive("/document-tracking") ? "active" : ""}>
                  <Tooltip text={"Track Document"}>
                    <MdOutlineContentPasteSearch className="icon" />
                  </Tooltip>
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

              {/* <Link to="/internal-logs">
                <li
                  onClick={scrollToTop}
                  className={isActive("/internal-logs") ? "active" : ""}
                >
                  <Tooltip text={"Internal Logs"}>
                    <GrDocumentTime className="icon" />
                  </Tooltip>
                  <p>Internal Logs</p>
                </li>
              </Link> */}

              <Link to="/view-user">
                <li
                  onClick={scrollToTop}
                  className={isActive("/view-user") ? "active" : ""}
                >
                  <Tooltip text={"View Users"}>
                    <LuUserSquare2 className="icon" />
                  </Tooltip>
                  <p>View Users</p>
                </li>
              </Link>

              <Link to="/add-office">
                <li
                  onClick={scrollToTop}
                  className={isActive("/add-office") ? "active" : ""}
                >
                  <Tooltip text={"View Offices"}>
                    <BsBuildingAdd className="icon" />
                  </Tooltip>
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
            <Tooltip text={"Logout?"}>
              <MdLogout className="icon" />
            </Tooltip>
            <button onClick={handlePopup}>Logout</button>
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
