import { Link } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";

const CategoryDropdown = ({ loading, categories }) => (
  <div className="group relative flex cursor-pointer items-center gap-1">
    <p className="tracking-wider">Catalog</p>
    <BsChevronDown />

     <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[250px]">
      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : categories.length ? (
        categories.map((cat, i) => (
          <Link
            key={i}
            to={`/catalog/${cat.name.split(" ").join("-").toLowerCase()}`}
            className="block rounded-md py-2 px-3 hover:bg-richblack-50"
          >
            {cat.name}
          </Link>
        ))
      ) : (
        <p className="text-center">No Courses Found</p>
      )}
    </div>
  </div>
);

export default CategoryDropdown;
