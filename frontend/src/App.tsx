import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/login';
import Dashboard from './pages/customers/Dashboard'
import MyTickets from "./pages/customers/custInventory";
import Market from "./pages/customers/market";
import Profile from "./pages/customers/profile";
import DashboardOrganizer from "./pages/organizers/dashboardOrganizer";
import CreateEvent from "./pages/organizers/createTicket";
import OrgInventory from "./pages/organizers/orgInventory";
import OrgProfile from "./pages/organizers/orgProfile";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/orgSignUp" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/market" element={<Market />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<MyTickets />} />
        <Route path="/dashboardOrganizer" element={<DashboardOrganizer />} />
        <Route path="/orgInventory" element={<OrgInventory />} />
        <Route path="/orgProfile" element={<OrgProfile />} />
        <Route path="/createEvent" element={<CreateEvent onSubmit={(eventData) => console.log(eventData)} />} />
      </Routes>
    </Router>
  );
}

export default App;
