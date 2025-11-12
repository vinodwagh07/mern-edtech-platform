import React from "react";
import { NavbarLinks } from "../data/Navbar-Link";
import { Link, matchPath } from "react-router-dom";
import Logo from "../assets/Logo/Logo-Full-Light.png";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const matchRoute = (route) => {
    //Built-in function
    // Performs pattern matching on a URL pathname and returns information about the match.
    // A path match object if the pattern matches the pathname, or null if it does not match.
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-richblack-700">
      <div className="w-11/12 flex items-center justify-between max-w-maxContent text-white">
        {/* Image */}
        <Link to="/">
          <img
            src={Logo}
            alt="StudyNotion"
            width={160}
            height={32}
            loading="lazy"
          />
        </Link>

        {/* NavLinks */}
        <nav>
          <ul className="flex gap-x-6">
            {NavbarLinks.map((element, index) => (
              <li key={index}>
                {element.title === "Catalog" ? (
                  <div></div>
                ) : (
                  <Link to={element?.path}>
                    <p
                      className={`font-semibold ${
                        matchRoute(element?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {element.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login , Signup , Dashboard*/}
        <div className="flex gap-4 p-x-4">
          <div>Login</div>
          <div>Signup</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
