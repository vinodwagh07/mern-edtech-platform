import { setLoading, setToken } from "../auth/authSlice";
import { setUser } from "../profile/profileSlice";
import { apiConnector } from "../../services/apiConnector";
import { authEndpoints } from "../../services/api";
import { toast } from "react-hot-toast";

const { SENDOTP_API, SIGNUP_API, LOGIN_API, RESETPASSWORDTOKEN_API, RESETPASSWORD_API, CHANGEPASSWORD_API } =
  authEndpoints;

//after submitting signup form send otp for email verification
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, { email });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP sent successfully");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signup(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Sign Up Successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, { email, password });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("/dashboard/my-profile");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

//Send Reset password mail attahced with  url+token
export function requestPasswordReset(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORDTOKEN_API, { email });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset password email Sent");
      setEmailSent(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

//Verify token and update password
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, { password, confirmPassword, token });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

//change password taking oldPassword and newPassword
export function changePassword(oldPassword, newPassword, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", CHANGEPASSWORD_API, { oldPassword, newPassword });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password changes successfully...");
      navigate("/dashboard/my-profile");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    //dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}
