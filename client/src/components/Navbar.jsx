import React from "react";
import { NavbarLinks } from "../data/Navbar-Link";
import { Link, matchPath} from "react-router-dom";
import Logo from "../assets/Logo/Logo-Full-Light.png";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../utils/constants";
import { categories } from "../services/api";
import { apiConnector } from "../services/apiConnector";
import {
  AiOutlineContacts,
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { useState } from "react";
import { useEffect } from "react";
import ProfileDropDown from "./ProfileDropDown";
import HamburgerMenu from "../components/HamburgerMenu";
import { VscDashboard, VscSignIn, VscSignOut } from "react-icons/vsc";
import { BiCategory, BiDetail } from "react-icons/bi";

const Navbar = () => {
  // Fetch state from redux store
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [catalogCategories, setCatalogCategories] = useState([]);

  //Function - to fetch catalog categories
  const fetchCatalogCategories = async () => {
    try {
      const response = await apiConnector("GET", categories.CATEGORIES_API);
      setCatalogCategories(response.data.data);
    } catch (error) {
      toast.error("could not fetch Categories");
      console.log(error);
    }
  };

  //To fetch catalog categories
  useEffect(() => {
    fetchCatalogCategories();
  }, []);

  //to show active page (on which page user is present) - Home , About , Contact us
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
                  <div className="group relative flex cursor-pointer items-center gap-1">
                    <p>{element.title}</p>
                    <SlArrowDown />

                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[250px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      <div className="flex flex-col text-center font-semibold">
                        {catalogCategories.map((category, index) => (
                          <p key={index} className="p-1 text-left">
                            {category.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
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

        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {/* Dashboard cart*/}
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Login */}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}

          {/* Signup */}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 ">
                Sign Up
              </button>
            </Link>
          )}

          {/* ProfileDropdown - when user is logged in */}
          {token !== null && <ProfileDropDown />}
        </div>
      </div>

      {/* Menubar on small devices */}
      <div className="mr-4 md:hidden">
        <GiHamburgerMenu
          onClick={() => setIsMenuModalOpen((prev) => !prev)}
          className={` fill-richblack-100 `}
          fontSize={24}
        />
      </div>
    </div>
  );
};

export default Navbar;
