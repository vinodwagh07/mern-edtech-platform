import { Link, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../../data/Navbar-Link";
import CategoryDropdown from "./CategoryDropdown";

const DesktopMenu = ({ loading, categories }) => {
  const location = useLocation();

  const matchRoute = (route) => location.pathname === route;

  return (
    <nav className="hidden md:block">
      <ul className="flex gap-x-6 text-richblack-25">
        {NavbarLinks.map((link, i) => (
          <li key={i}>
            {link.title === "Catalog" ? (
              <CategoryDropdown loading={loading} categories={categories} />
            ) : (
              <Link to={link.path}>
                <p className={`tracking-wider ${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                  {link.title}
                </p>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DesktopMenu;
