import React from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import * as Icons1 from "react-icons/ai";
import * as Icons2 from "react-icons/vsc";

const SidebarLink = ({ data }) => {
  const Icon = Icons1[data.icon] || Icons2[data.icon];
  const location = useLocation();

  const matchRoute = (linkPath) => {
    return matchPath({ path: linkPath }, location.pathname);
  };

  return (
    <div>
      <Link
        to={data.path}
        className={`relative flex gap-x-2 items-center text-sm font-medium px-3 md:px-8 py-2 cursor-pointer transition-all duration-200
        ${matchRoute(data.path) ? "text-yellow-50 bg-yellow-800" : "text-richblack-300"}`}
      >
        <span
          className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${matchRoute(data.path) ? " opacity-100 " : "opacity-0"}`}
        ></span>

        <span className="relative group flex items-center gap-x-2">
          <Icon
            className={`text-lg transition-colors duration-300
            ${matchRoute(data.path) ? "text-yellow-100" : "text-richblack-300 group-hover:text-yello-200"}`}
          />

          {/* Tooltip */}
          <span
            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 min-w-max 
            bg-richblack-400 text-richblack-900 text-xs font-medium rounded-md shadow-lg
            opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 
            translate-x-1 transition-all duration-300 pointer-events-none whitespace-nowrap"
          >
            {data.name}
          </span>
        </span>

        <p className="hidden md:block uppercase tracking-wider">{data.name}</p>
      </Link>
    </div>
  );
};

export default SidebarLink;
