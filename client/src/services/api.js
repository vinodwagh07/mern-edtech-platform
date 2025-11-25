const BASE_URL = import.meta.env.VITE_BASE_URL;

// Auth_API EndPoints
export const authEndpoints = {
  SENDOTP_API: BASE_URL + "/auth/send-otp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSWORDTOKEN_API: BASE_URL + "/auth/request-password-reset",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  CHANGEPASSWORD_API: BASE_URL + "/auth/change-password",
  DELETE_ACCOUNT_API: BASE_URL + "/profiles/deleteAccount",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profiles/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profiles/getEnrolledCourses",

  //PUT APIs
  UPDATE_PROFILE_PICTURE_API: BASE_URL + "/profiles/updateProfilePicture",
  UPDATE_PROFILE_API: BASE_URL + "/profiles/updateProfile",
};

// Categories_API EndPoints
export const categories = {
  CATEGORIES_API: "/courses/showAllCategories",
};
