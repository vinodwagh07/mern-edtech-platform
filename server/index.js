const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables
const app = express();

const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const courseRoutes = require("./routes/courseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const cookieParser = require("cookie-parser");
const database = require("./config/database");
const cors = require("cors");
const cloudinary = require("./config/cloudinary");
const fileUpload = require("express-fileupload");


const PORT = process.env.PORT;

// Initialize DB connection
database.connect();

// Middleware: request parsing, cookies, and CORS
app.use(express.json()); // Parse JSON request bodies

app.use(cookieParser()); // Parse cookies into req.cookies
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Restrict CORS to frontend domain
    credentials: true, // Enable cookies/auth headers
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profiles", profileRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.get("/",(req,res)=>{
  return res.json({
    success:true,
    message:"Default Route"
  })
})

app.listen(PORT, () => {
  console.log("Server Staretd");
});
