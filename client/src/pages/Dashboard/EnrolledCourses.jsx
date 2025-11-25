import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";
import Spinner from "../../components/Spinner";

import { getUserEnrolledCourses } from "../../features/profile/profileAPI";
import { convertSecondsToDuration } from "../../utils/durationFormatter";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const FALLBACK_THUMB = "https://placehold.co/300x200/1e1e2f/ffffff?text=Course+Thumbnail";

  //Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setCourses(res || []);
    } catch (err) {
      setError("Failed to fetch courses.", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Memoize formatted courses data
  const formattedCourses = useMemo(
    () =>
      courses.map((c) => ({
        ...c,
        duration: convertSecondsToDuration(c.totalDuration),
        shortDesc: c.courseDescription 
          ? c.courseDescription.split("\n")[0].slice(0, 50) + (c.courseDescription.length > 50 ? "..." : "")
          : "No description available",
      })),
    [courses]
  );

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 mt-6">{error}</p>;
  }

  if (!formattedCourses.length) {
    return (
      <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
        You have not enrolled in any course yet.
      </p>
    );
  }

  return (
    <div>
      <div className="text-3xl text-richblack-50  lg:text-left text-center">Enrolled Course</div>

      <div className="overflow-x-auto">
        <div className="my-8 text-richblack-5 w-[650px] md:w-full">
          {/* Table Header */}
          <div className="flex rounded-t-lg bg-richblack-700 ">
            <p className="w-[45%] px-5 py-3 tracking-wider">Course Name</p>
            <p className="w-1/4 px-2 py-3 tracking-wider">Duration</p>
            <p className="flex-1 px-2 py-3 tracking-wider">Progress</p>
          </div>

          {/* Course List */}
          {formattedCourses.map((course, idx, arr) => (
            <div
              key={course._id}
              className={`flex items-center border border-richblack-700 ${
                idx === arr.length - 1 ? "rounded-b-lg" : ""
              }`}
            >
              {/* Course Info */}
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() =>
                  navigate(
                    `/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }
              >
                <img
                  src={course.thumbnail || FALLBACK_THUMB}
                  alt="course"
                  className="h-14 w-14 rounded-lg object-cover"
                />

                <div className="flex max-w-xs flex-col gap-1">
                  <p className="tracking-wider">{course.courseName}</p>

                  <p className="text-xs text-richblack-300">{course.shortDesc}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="w-1/4 px-2 py-3 tracking-wider">{course.duration}</div>

              {/* Progress */}
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3 tracking-wider">
                <p>Progress - {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                  bgColor="#3AB4F2"
                  baseBgColor="#2A2F36"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
