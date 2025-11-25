import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../../../features/auth/authAPI";
import IconBtn from "../../../components/IconBtn";

export default function UpdatePassword() {
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // -----------------------
  // FAANG-Standard Submit
  // -----------------------
  const submitPassForm = async (data) => {
    try {
      await dispatch(changePassword(token, data));
      reset(); // clear form after success (optional)
      setShowOldPassword(false);
      setShowNewPassword(false);
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitPassForm)}>
      <div className="my-5 rounded-xl border border-richblack-600 bg-richblack-800 p-8">
        <h1 className="text-xl font-semibold text-white mb-6  tracking-wider">Password</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Current Password */}
          <div className="w-full">
            <label htmlFor="oldPassword" className="text-sm text-gray-300  tracking-wider">
              Current Password <span className="text-pink-400">*</span>
            </label>

            <div className="relative mt-2">
              <input
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter Current Password"
                className="w-full bg-richblack-700 border border-richblack-600 text-white px-4 py-3 rounded-lg placeholder-gray-500 text-sm tracking-wider pr-12"
                {...register("oldPassword", { required: true })}
              />

              <span
                onClick={() => setShowOldPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible size={22} color="#B4B6BF" />
                ) : (
                  <AiOutlineEye size={22} color="#B4B6BF" />
                )}
              </span>
            </div>

            {errors.oldPassword && <p className="text-red-400 text-xs mt-1">{errors.oldPassword.message}</p>}
          </div>

          {/* New Password */}
          <div className="w-full">
            <label htmlFor="newPassword" className="text-sm text-gray-300  tracking-wider">
              New Password <span className="text-pink-400">*</span>
            </label>

            <div className="relative mt-2">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter New Password"
                className="w-full bg-richblack-700 border border-richblack-600 text-white px-4 py-3 rounded-lg placeholder-gray-500 text-sm tracking-wider pr-12"
                {...register("newPassword", { required: true })}
              />

              <span
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible size={22} color="#B4B6BF" />
                ) : (
                  <AiOutlineEye size={22} color="#B4B6BF" />
                )}
              </span>
            </div>

            {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>
        </div>
      </div>
      
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

        <IconBtn type="submit" disabled={loading} text={loading ? "Updating..." : "Update"} customClasses="py-2 px-5" />
      </div>
    </form>
  );
}
