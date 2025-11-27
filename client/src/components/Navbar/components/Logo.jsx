import { Link } from "react-router-dom";
import logo from "../../../assets/Logo/Logo-Full-Light.png";

const Logo = () => (
  <Link to="/">
    <img src={logo} alt="Logo" width={160} height={32} loading="lazy" className="select-none" />
  </Link>
);

export default Logo;
