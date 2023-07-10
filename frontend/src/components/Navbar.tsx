import React from 'react';
import "../style/components/navbar.css"
import { NavLink } from 'react-router-dom';
import Logo from "./logo";

const Navbar = () => {
  return (
    <nav>
      <Logo/>
      <ul>
        <li>
          <NavLink to="/dashboard" className="active">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/market" className="active">
            Market
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className="active">
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className="active">
            My Tickets
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
