import React from "react";
import { useEditProfileForm } from "../../../hooks/useEditProfileForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../../components/IconBtn";
import { GENDERS } from "../../../utils/constants";

const EditProfile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.profile.user);
  const token = useSelector((state) => state.auth.token);
  const { register, handleSubmit, submit, errors, loading } = useEditProfileForm(user, token);

  return (
    <form onSubmit={handleSubmit(submit)}>
      {/* Card */}
      <section className="rounded-xl border border-richblack-600 bg-richblack-800 py-8 px-6 md:px-12 mt-5">
        <h1 className="text-xl font-semibold text-white mb-6  tracking-wider">Profile Information</h1>

        <div className="flex flex-col gap-y-8">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* First Name */}
            <label className="w-full">
              <p className="text-sm  text-gray-300  tracking-wider mb-1">
                First Name <span className="text-pink-400">*</span>
              </p>
              <input
                type="text"
                className="w-full bg-richblack-700 border border-richblack-600 text-white px-4 py-3 rounded-lg placeholder-gray-500 text-sm tracking-wider"
                {...register("firstName", { required: true })}
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">Please enter your first name</p>}
            </label>

            {/* Last Name */}
            <label className="w-full">
              <p className="text-sm  text-gray-300  tracking-wider mb-1">
                Last Name <span className="text-pink-400">*</span>
              </p>
              <input
                type="text"
                className="w-full  bg-richblack-700 border border-richblack-600 text-white px-4 py-3 rounded-lg placeholder-gray-500 text-sm tracking-wider"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">Please enter your last name</p>}
            </label>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* DOB */}
            <label className="w-full">
              <p className="text-sm  text-gray-300  tracking-wider mb-1">
                Date of Birth <span className="text-pink-400">*</span>
              </p>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className="w-full  bg-richblack-700 border border-richblack-600 text-white px-4 py-3 rounded-lg text-sm tracking-wider"
                {...register("dateOfBirth", { required: true })}
              />
              {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth.message}</p>}
            </label>

            {/* Gender */}
            <label className="w-full">
              <p className="text-sm text-gray-300 tracking-wider mb-1">
                Gender <span className="text-pink-400">*</span>
              </p>

              <div className="flex items-center gap-6 bg-richblack-700 border border-richblack-600 px-4 py-3 rounded-lg">
                {/* Male */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Male"
                    {...register("gender", { required: true })}
                    className="appearance-none w-3 h-3 rounded-full border-2 border-gray-400  checked:border-yellow-50 checked:bg-yellow-50 checked:ring-2 checked:ring-yellow-50 checked:ring-offset-2 ring-offset-richblack-700"
                  />
                  <span className="text-gray-300">Male</span>
                </label>

                {/* Female */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Female"
                    {...register("gender", { required: true })}
                    className="appearance-none w-3 h-3 rounded-full border-2 border-gray-400  checked:border-yellow-50 checked:bg-yellow-50 checked:ring-2 checked:ring-yellow-50 checked:ring-offset-2 ring-offset-richblack-700"
                  />
                  <span className="text-gray-300">Female</span>
                </label>

                {/* Other */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Other"
                    {...register("gender", { required: true })}
                    className="appearance-none w-3 h-3 rounded-full border-2 border-gray-400  checked:border-yellow-50 checked:bg-yellow-50 checked:ring-2 checked:ring-yellow-50 checked:ring-offset-2 ring-offset-richblack-700"
                  />
                  <span className="text-gray-300">Other</span>
                </label>
              </div>

              {errors.gender && <p className="text-red-400 text-xs mt-1">Please select gender</p>}
            </label>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Contact Number */}
            <label className="w-full">
              <p className="text-sm  text-gray-300  tracking-wider mb-1">
                Contact Number <span className="text-pink-400">*</span>
              </p>
              <input
                type="tel"
                className="w-full  bg-richblack-700 border border-richblack-600 text-white px-4 py-3 rounded-lg placeholder-gray-500 text-sm tracking-wider"
                {...register("contactNumber", {
                  required: true,
                  minLength: 10,
                  maxLength: 12,
                })}
              />
              {errors.contactNumber && <p className="text-red-400 text-xs mt-1">{errors.contactNumber.message}</p>}
            </label>

            {/* About */}
            <label className="w-full">
              <p className="text-sm  text-gray-300  tracking-wider mb-1">
                About <span className="text-pink-400">*</span>
              </p>
              <input
                type="text"
                className="w-full  bg-richblack-700 border border-richblack-600 text-white px-4 py-3 rounded-lg placeholder-gray-500 text-sm tracking-wider"
                {...register("about", { required: true })}
              />
              {errors.about && <p className="text-red-400 text-xs mt-1">Please enter your bio</p>}
            </label>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => navigate("/dashboard/my-profile")}
          className={`rounded-md bg-richblack-800 py-2 px-5 border border-richblack-600  text-richblack-50  tracking-wider
            ${loading ? "cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          Cancel
        </button>

        <IconBtn type="submit" disabled={loading} text={loading ? "Saving..." : "Save"} customClasses="py-2 px-5" />
      </div>
    </form>
  );
};

export default EditProfile;
