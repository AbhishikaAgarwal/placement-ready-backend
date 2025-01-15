// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/placementReadyDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  college: String,
  program: String,
  passoutYear: Number,
});

const User = mongoose.model("User", userSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your email from .env
    pass: process.env.PASSWORD, // Your email password from .env
  },
});

// Routes
app.get("/", (req, res) => {
  res.send("Placement Ready Backend is running!");
});

// Register Route
app.post("/register", async (req, res) => {
  const { name, email, phone, college, program, passoutYear } = req.body;

  // Save user to MongoDB
  const newUser = new User({
    name,
    email,
    phone,
    college,
    program,
    passoutYear,
  });

  try {
    await newUser.save();
    console.log("User registered successfully:", newUser);

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL,
      to: "agarwalabhishika2024@gmail.com", // Your email
      subject: "New Registration on Placement Ready",
      text: `A new user has registered on Placement Ready:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCollege: ${college}\nProgram: ${program}\nPassout Year: ${passoutYear}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login Route
app.post("/send-otp", async (req, res) => {
  const { email_phone } = req.body;

  // Dummy OTP generation
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("Generated OTP:", otp);

  // Send OTP via email
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email_phone,
      subject: "Your OTP for Placement Ready",
      text: `Your OTP for logging in to Placement Ready is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
