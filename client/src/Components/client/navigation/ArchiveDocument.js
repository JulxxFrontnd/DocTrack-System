import React, { useState, useEffect } from "react";
import Header from "../Header";
import SidePanel from "../SidePanel";
import Footer from "../Footer";
import { IoSearch } from "react-icons/io5";
import { RiArrowGoBackFill } from "react-icons/ri";
import "../navigation/newcontent.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ArchiveDocument = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch archived documents from the backend
    const fetchArchivedDocuments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/archived-document"
        ); // Corrected URL
        console.log("Fetched archived documents:", response.data); // Log response data
        setData(response.data);
      } catch (error) {
        console.error("Error fetching archived documents", error);
      }
    };

    fetchArchivedDocuments();
  }, []);

  const handleRestore = async (docId) => {
    try {
      await axios.post("http://localhost:3001/restore-document", { docId }); // Corrected URL
      // Update the local state to reflect the restored document
      setData(data.filter((doc) => doc._id !== docId));
      console.log("Document restored:", docId); // Log restored document ID
      toast.success("Document Restored!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error restoring document", error);
      toast.error("Something went wrong, please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const filteredData = data.filter((val) => {
    // Check for search query match (case insensitive)
    const searchMatch =
      val.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      val.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      val.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      val.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      val.originating.toLowerCase().includes(searchQuery.toLowerCase()) ||
      val.destination.toLowerCase().includes(searchQuery.toLowerCase());

    return searchMatch;
  });

  const Tooltip = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
      <div
        className="tooltip2-container"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        {isVisible && <div className="tooltip2">{text}</div>}
      </div>
    );
  };

  const formatDateForDisplay = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;

    return `${month}/${day}/${year} - ${hours}:${minutes} ${ampm}`;
  };

  return (
    <>
      <Header />
      <SidePanel />
      <div>
        <div className="MainPanel">
          <div className="PanelWrapper">
            <div className="AddUserHeader arc">
              <div className="back-btn">
                <Link to="/home">
                  <button>
                    <Tooltip text={"Click to go back, Home page"}>
                      <RiArrowGoBackFill className="back-icon" />
                    </Tooltip>{" "}
                  </button>
                </Link>
              </div>
              <div className="filter">
                <p>Archived Document</p>
              </div>
              <div className="search">
                <div className="search-border">
                  <IoSearch className="searchIcon" />
                  <input
                    type="search"
                    name=""
                    id=""
                    placeholder="Search.."
                    className="search-bar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  ></input>
                </div>
              </div>
            </div>
            <div className="logList-container">
              <div className="contents">
                <div className="content-table">
                  <table>
                    <thead>
                      <tr>
                        <td>Date</td>
                        <td>Title</td>
                        <td>From</td>
                        <td>To</td>
                        <td>Action</td>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((val, key) => {
                        return (
                          <tr key={key}>
                            <td>{formatDateForDisplay(val.date)}</td>
                            <td>{val.title}</td>
                            <td>{val.sender}</td>
                            <td>{val.recipient}</td>
                            <td>
                              <div className="viewbtn">
                                <button onClick={() => handleRestore(val._id)}>
                                  Restore
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default ArchiveDocument;
