import { profileEndpoints } from "../../services/api";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../services/apiConnector";
import { setUser } from "../profile/profileSlice";
//import { setLoading } from "./profileSlice";

const { GET_USER_ENROLLED_COURSES_API, UPDATE_PROFILE_PICTURE_API, UPDATE_PROFILE_API } = profileEndpoints;

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Error while getting enrolled course", error);
  }
  toast.dismiss(toastId);
  return result;
}

export function updateProfilePicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_PICTURE_API, formData, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Profile Picture Updated Successfully");
      dispatch(setUser(response.data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
  };
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Profile Updated Successfully");
      dispatch(setUser(response.data.data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
  };
}
