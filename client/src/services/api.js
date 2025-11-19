const BASE_URL = import.meta.env.VITE_BASE_URL;

// Auth_API EndPoints
export const authEndpoints = {
  SENDOTP_API: BASE_URL + "/auth/send-otp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSWORDTOKEN_API: BASE_URL + "/auth/request-password-reset",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  CHANGEPASSWORD_API:BASE_URL + "/auth/change-password"
}

// Categories_API EndPoints
export const categories = {
  CATEGORIES_API: "/courses/showAllCategories",
};


