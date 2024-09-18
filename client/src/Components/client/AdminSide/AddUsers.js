import React, { useState, useEffect } from "react";
import Header from "../Header";
import SidePanel from "../AdminSidePanel";
import Footer from "../Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import { RiArrowGoBackFill } from "react-icons/ri";
import "../navigation/newcontent.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUsers = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [office, setOffice] = useState("");
  const [offices, setOffices] = useState([]); // State to hold fetched offices

  useEffect(() => {
    // Fetch offices when the component mounts
    axios
      .get("http://localhost:3001/offices")
      .then((res) => {
        // Filter out archived offices
        const activeOffices = res.data.filter((office) => !office.isArchived);
        setOffices(activeOffices);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []); // Empty dependency array to run the effect only once when the component mounts

  const handleSubmit = (e) => {
    e.preventDefault();

    // Find the office name corresponding to the selected office ID
    const selectedOffice = offices.find(
      (officeItem) => officeItem._id === office
    );
    const officeName = selectedOffice ? selectedOffice.office : "";

    axios
      .post("http://localhost:3001/add-user", {
        firstname,
        lastname,
        email,
        password,
        position,
        office: officeName,
      })
      .then((res) => {
        toast.success("New User is added successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // Resetting form fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPosition("");
        setOffice("");
      })
      .catch((err) => {
        console.log(err);
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
      });
  };

  const handleClear = () => {
    // Clear form fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPosition("");
    setOffice("");
  };

  return (
    <>
      <Header />
      <div className="MainPanel">
        <div className="PanelWrapper">
          <div className="AddUserHeader">
            <div className="back-btn">
              <Link to="/view-user">
                <button title="Back to View Users">
                  <RiArrowGoBackFill className="back-icon" />
                </button>
              </Link>
            </div>
            <p>Add User</p>
          </div>

          <div className="FormWrapper">
            <form action="" className="AddUserForm" onSubmit={handleSubmit}>
              <div className="FormText">
                <p>First Name:</p>
                <div className="input-new">
                  <input
                    type="text"
                    id="firstname"
                    required
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <p>Last Name:</p>
                <div className="input-new">
                  <input
                    type="text"
                    id="lastname"
                    required
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <p>Office Name:</p>
                <div className="input-new">
                  <select
                    id="office"
                    className="input-field"
                    required
                    value={office}
                    onChange={(e) => setOffice(e.target.value)}
                  >
                    <option value="" disabled>
                      Select here
                    </option>
                    {offices.map((officeItem, index) => (
                      <option key={index} value={officeItem._id}>
                        {officeItem.office}
                      </option>
                    ))}
                  </select>
                </div>

                <p>Position:</p>
                <div className="input-new">
                  <input
                    type="text"
                    id="position"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>

                <p>Email:</p>
                <div className="input-new">
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <p>Password:</p>
                <div className="input-new">
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="adduserbuttons">
                <div className="ClearButton">
                  <button type="button" onClick={handleClear}>
                    Clear
                  </button>
                </div>
                <div className="SubmitButton">
                  <button type="submit">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <SidePanel /> {/* Always render the SidePanel */}
      <Footer />
      <ToastContainer />
    </>
  );
};

export default AddUsers;
