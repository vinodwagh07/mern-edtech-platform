import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { updateProfile } from "../features/profile/profileAPI";

export const useEditProfileForm = (user, token) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  useEffect(() => {
    if (user) {
      reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
        gender: user?.additionalDetails?.gender || "",
        contactNumber: user?.additionalDetails?.contactNumber || "",
        about: user?.additionalDetails?.about || "",
      });
    }
  }, [user, reset]);

  const submit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        await dispatch(updateProfile(token, data));
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error("Failed to update profile");
      } finally {
        setLoading(false);
      }
    },
    [dispatch, token]
  );
  return { register, handleSubmit, submit, errors, loading };
};
