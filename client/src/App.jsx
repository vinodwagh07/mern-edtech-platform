import React from 'react'
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar"
import { Provider } from 'react-redux';

const App = () => {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <AppRoutes/>
    </div>
  )
}

export default App