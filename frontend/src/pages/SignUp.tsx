import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../style/signUp.css"

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

  const [user2, setUser2] = useState<User>({
    email: "",
    password: "",
    username: "",
    first_name: "",
    last_name: "",
    wallet_address: "",
    secret_key: "",
  });


  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser2((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/organizers/register", user);
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  
  const handleSubmit2 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/customers/register", user2);
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="organizer">
      <h2>Register as Organizer</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Register</button>
      </form>
      </div>
      <div className="customers">
      <h2>Register as Customer</h2>
      <form onSubmit={handleSubmit2}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user2.email}
            onChange={handleChange2}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={user2.password}
            onChange={handleChange2}
          />
        </label>
        <br />
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={user2.username}
            onChange={handleChange2}
          />
        </label>
        <br />
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={user2.first_name}
            onChange={handleChange2}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={user2.last_name}
            onChange={handleChange2}
          />
        </label>
        <br />
        <label>
          Wallet Address:
          <input
            type="text"
            name="wallet_address"
            value={user2.wallet_address}
            onChange={handleChange2}
          />
        </label>
        <br />
        <label>
          Secret Key:
          <input
            type="text"
            name="secret_key"
            value={user2.secret_key}
            onChange={handleChange2}
          />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
      </div>
    </div>
  );
};

export default SignUp;
