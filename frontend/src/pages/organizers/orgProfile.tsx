import React, { useState } from 'react';
import axios from 'axios';
import OrgNavbar from '../../components/orgNavbar';
import Cookies from 'js-cookie';

function OrgProfile() {
  const email = Cookies.get("organizerEmail");
  //console.log(email);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    walletAddress: '',
    privateKey: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };
  

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/organizers/update/${email}`, userData);

      console.log(response.data);
      // show success message or redirect to new page
    } catch (error) {
      console.error(error);
      // show error message
    }
  };

  return (
    <div>
      <OrgNavbar />
      <h1>Profile</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
            
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
            
          />
        </div>
        <div>
          <label>Wallet Address:</label>
          <input
            type="text"
            name="walletAddress"
            value={userData.walletAddress}
            onChange={handleInputChange}
            
          />
        </div>
        <div>
          <label>Private Key:</label>
          <input
            type="text"
            name="privateKey"
            value={userData.privateKey}
            onChange={handleInputChange}
            
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default OrgProfile;
