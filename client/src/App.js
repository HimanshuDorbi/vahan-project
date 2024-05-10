import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import "./App.css";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});


function App() {
  const [users, setUsers] = useState([]); //user list
  const [selectedUser, setSelectedUser] = useState(null);  //for selsted user
  const [formData, setFormData] = useState({  //for form data
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    profileImage: null,
  });
  const [searchQuery, setSearchQuery] = useState(""); //for search/filter


  useEffect(() => {
    axiosInstance.get("/api/users").then((response) => {
      setUsers(response?.data);
    });
  }, [formData]);


  //to add data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //to add image/file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
  };

  //submit the form
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      profileImage: null,
    });
  };

  //update the selected user's info
  const handleDeleteClick = (userId) => {
    axiosInstance
      .delete(`/api/users/${userId}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const handleSubmit = (e) => {
    e.preventDefault(); //to prevent default form behaviour

    //Form validation
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dateOfBirth",
    ];
    let formValid = true;
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        alert(
          `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is mandatory to fill.`
        );
        formValid = false;
      }
    });

    if (!formValid) return;

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    const dob = new Date(formData.dateOfBirth);
    if (isNaN(dob.getTime())) {
      alert("Please enter a valid date of birth.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    formDataToSend.append(
      "profileImage",
      formData.profileImage || selectedUser.profileImage
    );

    if (selectedUser) {
      axiosInstance
        .put(`/api/users/update/${selectedUser.id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUser.id ? response.data : user
            )
          );
          setSelectedUser(null);
          setFormData({  //set input feild to null once profile created
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            profileImage: null,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axiosInstance
        .post("/api/users", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setUsers([...users, response.data]);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            profileImage: null,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-gray-900 text-white min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">CRUD Application</h1>

        <div className="mb-8">
          <h2 className="text-2xl mb-4">User Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid-cols-2 sm:grid-cols-2 gap-2">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="input-field"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              // required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input-field"
              // required
            />
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="input-field"
              // required
            />
            <input
              type="file"
              name="profileImage"
              onChange={handleFileChange}
              className="input-field"
              required
            />
            <button type="submit" className="submit-button">
              Save
            </button>
          </form>
        </div>

        <div className="abc">
          <h2 className="text-2xl mb-4 ">User's Data</h2>
          <hr className="mb-500"></hr>
          <div className="search-container mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <img
                  src={`http://localhost:3001/${user.profileImage}`}
                  alt={`${user.firstName}'s profile`}
                  className="user-avatar"
                />
                <div className="text-center">
                  <h3 className="user-name">
                    {`${user.firstName} ${user.lastName}`}
                  </h3>
                  <div className="user-details">
                    <p>
                      <span className="detail-label">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="detail-label">Phone:</span> {user.phone}
                    </p>
                    <p>
                      <span className="detail-label">Date Of Birth:</span>{" "}
                      {new Date(user.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="button-container">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <footer className="footer">
          <div className="container mx-auto px-4 text-center py-4">
            <p className="text-gray-400">
              &copy; 2024 Himanshu Dorbi. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
