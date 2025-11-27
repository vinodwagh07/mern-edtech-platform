import { useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";

import { useFetchCategories } from "../../hooks/useFetchCategories";

import Logo from "./components/Logo";
import DesktopMenu from "./components/DesktopMenu";
import MobileMenu from "./components/MobileMenu";
import ProfileDropdown from "./components/ProfileDropdown";

const Navbar = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);
  
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const { categoriesList, loading } = useFetchCategories();

  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <div className="h-14 flex items-center justify-center border-b border-richblack-700 bg-richblack-800">
      <div className="flex w-11/12 max-w-maxContent justify-between items-center">
        <Logo />

        <DesktopMenu loading={loading} categories={categoriesList} />

        <div className="hidden md:flex items-center gap-x-4">
          {user && user?.accountType !== "INSTRUCTOR" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
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
          {token !== null && <ProfileDropdown />}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden mr-4">
          <GiHamburgerMenu className="text-2xl text-richblack-100" onClick={() => setMenuOpen((prev) => !prev)} />
        </div>
      </div>

      <MobileMenu
        isMenuModalOpen={isMenuModalOpen}
        setIsMenuModalOpen={setIsMenuModalOpen}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={categoriesList}
        categoryOpen={categoryOpen}
        setCategoryOpen={setCategoryOpen}
      />
    </div>
  );
};

export default Navbar;
