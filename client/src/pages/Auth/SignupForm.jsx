import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Tab from "../../components/Tab";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendOtp } from "../../features/auth/authAPI";
import { setSignupData } from "../../features/auth/authSlice";

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Student or Instructor
  const [accountType, setAccountType] = useState("Student");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  // Handle input changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Setting signup data to redux state - To be used after otp verification for registering user
    const signupData = {
      ...formData,
      accountType,
    };
    dispatch(setSignupData(signupData));
    //console.log(signupData)
    //dispatch send otp to user for otp verification
    dispatch(sendOtp(formData.email, navigate));

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAccountType("Student");
  };

  // Data for Tab component
  const tabData = [
    { id: 1, tabName: "Student", type: "Student" },
    { id: 2, tabName: "Instructor", type: "Instructor" },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      {/* Form */}
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-4 mt-4">
        <div className="flex gap-4">
          <label className="flex-1">
            <p className="text-sm text-richblack-5 mb-1">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              className="form-style w-full"
            />
          </label>
          <label className="flex-1">
            <p className="text-sm text-richblack-5 mb-1">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              className="form-style w-full"
            />
          </label>
        </div>

        <label>
          <p className="text-sm text-richblack-5 mb-1">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="form-style w-full"
          />
        </label>

        <div className="flex gap-4">
          <label className="relative flex-1">
            <p className="text-sm text-richblack-5 mb-1">
              Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="form-style w-full !pr-10"
            />
            <span onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-10 cursor-pointer">
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>

          <label className="relative flex-1">
            <p className="text-sm text-richblack-5 mb-1">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="form-style w-full !pr-10"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-10 cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>

        <button type="submit" className="mt-4 py-2 px-4 bg-yellow-50 text-richblack-900 font-medium rounded">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
