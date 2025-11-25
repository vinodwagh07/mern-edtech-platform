import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { deleteAccount } from "../../../features/auth/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../components/ConfirmationModal"
import { toast } from "react-hot-toast";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (loading) return; // prevent multiple clicks
    setLoading(true);
    try {
      await dispatch(deleteAccount(token, navigate));
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const modalData = {
    text1: "Are you sure?",
    text2: "This action is permanent and will delete all your account content, including any paid courses.",
    btn1Text: loading ? "Deleting..." : "Delete",
    btn1Handler: handleDeleteAccount,
    btn2Text: "Cancel",
    btn2Handler: () => setShowModal(false),
  };

  return (
    <div className="mt-7 rounded-md border border-pink-700 bg-pink-900 p-8 px-5 md:px-12">
      <div className="flex gap-x-5">
        <div className="grid place-items-center aspect-square h-14 w-14 rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-xl font-semibold text-richblack-5 tracking-wider">Delete Account</h2>
          <div className="lg:w-full text-pink-25 space-y-1 lg:text-md text-md tracking-wider">
            <p>Would you like to delete your account?</p>
            <p className="tracking-wider lg:text-md text-md">
              This account may contain paid courses. Deleting your account is permanent and will remove all content associated with it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="tracking-wider w-fit cursor-pointer italic text-lg py-1 font-semibold rounded-md text-pink-400
            "
          >
            I want to delete my account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && <ConfirmationModal modalData={modalData} />}
    </div>
  );
};

export default DeleteAccount;
