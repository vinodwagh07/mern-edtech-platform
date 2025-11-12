import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />

    {/* Open Routes (login/signup) */}
    <Route path="login" element={<Login />} />
    <Route path="signup" element={<Signup />} />
  </Routes>
);

export default AppRoutes;
