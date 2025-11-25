import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import MyProfile from "../pages/Dashboard/MyProfile";
import EnrolledCourses from "../pages/Dashboard/EnrolledCourses";
import Settings from "../pages/Dashboard/Settings/index"
import Error from "../pages/Error";
import OpenRoute from "./OpenRoute";
import ProtectedRoute from "./ProtectedRoutes";

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />

    {/* OPEN ROUTES – ONLY LOGGED OUT USER CAN ACCESS */}
    <Route
      path="login"
      element={
        <OpenRoute>
          <Login />
        </OpenRoute>
      }
    />

    <Route
      path="signup"
      element={
        <OpenRoute>
          <Signup />
        </OpenRoute>
      }
    />

    {/* PUBLIC – NOT OPEN ROUTE */}
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="reset-password/:id" element={<ResetPassword />} />
    <Route path="verify-email" element={<VerifyEmail />} />

    <Route
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard/my-profile" element={<MyProfile />} />
      <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
      <Route path="dashboard/settings" element={<Settings />} />
    </Route>

    {/* Page not found route */}
    <Route path="*" element={<Error />} />
  </Routes>
);

export default AppRoutes;
