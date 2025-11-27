import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { AiOutlineContacts, AiOutlineHome, AiOutlineLogin, AiOutlineShoppingCart } from "react-icons/ai";
import { BiDetail, BiCategory } from "react-icons/bi";
import { VscDashboard, VscSignIn, VscSignOut } from "react-icons/vsc";
import { logout } from "../../../features/auth/authAPI";
import { useDispatch } from "react-redux";

const MobileMenu = ({ isOpen, onClose, categories, categoryOpen, setCategoryOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);

  return (
    <nav
      className={`fixed inset-0 z-50 flex transition-transform duration-500 ease-in-out will-change-transform
  ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Overlay + Panel Wrapper */}
      <div className="flex w-full h-full">
        {/* Overlay Area (clickable space) */}
        <div className="flex-1 backdrop-blur-sm bg-black/30" onClick={onClose}></div>

        {/* Menu Panel */}
        <div className="w-3/4 max-w-xs bg-richblack-900 text-white p-5 flex flex-col gap-3 overflow-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-richblack-700 text-white text-2xl"
          >
            &times;
          </button>

          {/* Auth / Dashboard */}
          {!token && (
            <>
              <Link to={"/login"} onClick={onClose}>
                <div className="flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-yellow-25 hover:bg-richblack-700 uppercase tracking-wider">
                  <VscSignIn className="text-lg" />
                  Log In
                </div>
              </Link>
              <Link to={"/signup"} onClick={onClose}>
                <div className="flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-yellow-25 hover:bg-richblack-700 uppercase tracking-wider">
                  <AiOutlineLogin className="text-lg" />
                  Sign Up
                </div>
              </Link>
            </>
          )}
          {token && (
            <>
              <Link to="/dashboard/my-profile" onClick={onClose} className="menu-item flex items-center gap-2">
                <div className="flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-yellow-25 hover:bg-richblack-700 uppercase tracking-wider">
                  <VscDashboard className="text-lg" />
                  Dashboard
                </div>
              </Link>
              {user?.accountType === "Student" && (
                <Link to={"/dashboard/cart"} onClick={onClose}>
                  <div className="flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-yellow-25 hover:bg-richblack-700 uppercase tracking-wider">
                    <AiOutlineShoppingCart className="text-lg" />
                    Cart
                  </div>
                </Link>
              )}
              <div
                onClick={() => {
                  onClose();
                }}
                className="menu-item cursor-pointer flex items-center gap-2"
              >
                <div
                  className="flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-yellow-25 hover:bg-richblack-700 cursor-pointer uppercase tracking-wider"
                  onClick={() => dispatch(logout(navigate))}
                >
                  <VscSignOut className="text-lg" />
                  Log Out
                </div>
              </div>
            </>
          )}

          <div className="h-[1px] bg-richblack-100 my-2"></div>

          {/* Navigation */}
          <Link to={"/"} onClick={onClose}>
            <div className="flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-yellow-25 hover:bg-richblack-700 uppercase tracking-wider">
              <AiOutlineHome className="text-lg" />
              Home
            </div>
          </Link>

          <Link to={"/about"} onClick={onClose}>
            <div className="flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-yellow-25 hover:bg-richblack-700 uppercase tracking-wider">
              <BiDetail className="text-lg" />
              About
            </div>
          </Link>

          <Link to={"/contact"} onClick={onClose}>
            <div className="flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 hover:text-yellow-25 hover:bg-richblack-700 uppercase tracking-wider">
              <AiOutlineContacts className="text-lg" />
              Contact
            </div>
          </Link>

          {/* Category */}
          <div>
            {/* Header */}
            <div
              className="flex gap-x-2 items-center w-full py-2 px-3 text-richblack-100 uppercase tracking-wider cursor-pointer hover:text-yellow-25 hover:bg-richblack-700"
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <BiCategory className="text-lg" />
              Category
              {categoryOpen ? <SlArrowUp className="ml-auto" /> : <SlArrowDown className="ml-auto" />}
            </div>

            {/* Categories List */}
            <div
              className={`overflow-hidden px-4 transition-all duration-300 ease-in-out delay-75 ${categoryOpen ? "opacity-100 scale-y-100 max-h-[500px]" : "opacity-0 scale-y-0 max-h-0"}`}
              style={{ transformOrigin: "top" }}
            >
              {categories.length ? (
                <div className="flex flex-col capitalize">
                  {categories.map((category, index) => (
                    <Link
                      to={`/catalog/${category.name.split(" ").join("-").toLowerCase()}`}
                      key={index}
                      onClick={onClose}
                    >
                      <p className="rounded-lg py-2 pl-4 tracking-wider text-xs">{category.name}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg py-2 pl-4 select-none cursor-not-allowed">No Catalog Available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileMenu;
