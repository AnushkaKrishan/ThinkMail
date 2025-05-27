import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LogIn from "../pages/Login";
import SideBar from "../components/SideBar";
import Dashboard from "../pages/Dashboard";
import NavBar from "../components/NavBar";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Compose from "../pages/Compose";
import Summary from "../pages/Summary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compose" element={<Compose />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
