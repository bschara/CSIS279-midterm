import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/signUp.css";

interface User {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  wallet_address: string;
  secret_key: string;
}

const SignUp: React.FC = () => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    username: "",
    first_name: "",
    last_name: "",
    wallet_address: "",
    secret_key: "",
  });
  const [userType, setUserType] = useState("customer");

  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userType === "organizer") {
      try {
        const response = await axios.post(
          "http://localhost:3000/organizers/register",
          user
        );
        console.log(response.data);
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    } else if (userType === "organizer") {
      try {
        const response = await axios.post(
          "http://localhost:3000/customers/register",
          user
        );
        console.log(response.data);
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1>SignUp</h1>
        <form className="input-fields" onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Wallet Address:
            <input
              type="text"
              name="wallet_address"
              value={user.wallet_address}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Secret Key:
            <input
              type="text"
              name="secret_key"
              value={user.secret_key}
              onChange={handleChange}
            />
          </label>
          <br />
          <div className="radio-input">
            <label>
              <input
                className="radio-buttons"
                type="radio"
                value="customer"
                checked={userType === "customer"}
                onChange={() => setUserType("customer")}
              />
              Customer
            </label>
            <label>
              <input
                type="radio"
                value="organizer"
                checked={userType === "organizer"}
                onChange={() => setUserType("organizer")}
              />
              Organizer
            </label>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
