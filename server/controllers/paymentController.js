const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../Mail/Template/courseEnrollmentEmail");
const crypto = require("crypto");

const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "courseId and userId are required",
      });
    }

    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isEnrolled = await Course.exists({
      _id: courseId,
      studentsEnrolled: req.user.id,
    });

    if (isEnrolled) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled",
      });
    }

    const options = {
      amount: courseDetails.price * 100,
      currency: "INR",
      receipt: `${courseId}_${userId}_${Date.now()}`,
      notes: {
        courseId: courseId,
        userId: userId,
      },
    };

    const paymentResponse = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.error("Error creating order");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Extract Razorpay signature from headers
    // Webhooks always send x-razorpay-signature for verification
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body); //contains orderid , paymentid , etc

    //Generate expected signature using HMAC SHA256
    const expected_signature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    //Verify signature to ensure webhook is authentic
    if (signature !== expected_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    //Extract payment details from Razorpay payload
    const paymentEntity = req.body.payload.payment.entity;
    const { status, notes } = paymentEntity;
    const { courseId, userId } = notes;

    //Ignore payments not yet captured
    if (status !== "captured") {
      return res
        .status(200)
        .json({ success: true, message: "Payment not captured" });
    }

    //Idempotency check: avoid duplicate enrollment
    // If user already enrolled, just return success
    const user = await User.findById(userId);
    if (user.courses.includes(courseId)) {
      console.log(`⚡ User already enrolled in course ${courseId}`);
      return res
        .status(200)
        .json({ success: true, message: "User already enrolled" });
    }

    //Enroll user safely using $addToSet (idempotent)
    const course = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { courses: courseId },
      },
      { new: true }
    );
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { studentsEnrolled: userId },
    });

    //Send confirmation email
    try {
      const emailBody = courseEnrollmentEmail(course.name, user.name);
      await mailSender(user.email, "Course Enrolled Successfully", emailBody);
    } catch (emailError) {
      console.error("Failed to send enrollment email:", emailError.message);
    }
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during webhook processing",
    });
  }
};
