import React from 'react';
import "../style/components/navbar.css"
import { NavLink } from 'react-router-dom';
import Logo from "./logo"; 

const orgNavbar = () => {
  return (
    <nav>
      <div className="logo-container">
      <Logo/>
      </div>
      <ul>
        <li>
          <NavLink to="/dashboardOrganizer" className="active">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/createEvent" className="active">
            Create Tickets
          </NavLink>
        </li>
        <li>
          <NavLink to="/orgInventory" className="active">
            My Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/orgProfile" className="active">
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default orgNavbar;
