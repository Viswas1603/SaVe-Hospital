require("dotenv").config(); // Load .env into process.env

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db"); // Required for DB connection

const appointmentRoutes = require("./routes/appointment");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve public website (main site)
app.use(express.static(path.join(__dirname, "../public-website")));

// Serve admin portal (separate login page)
app.use("/admin-portal", express.static(path.join(__dirname, "../admin-portal")));

// API route to POST appointment
app.use("/api/appointments", appointmentRoutes);

// API route to GET all appointments (for admin dashboard)
app.get("/api/appointments", async (req, res) => {
  try {
    const db = await connectDB();
    const appointments = db.collection("appointments");

    const allAppointments = await appointments.find({}).toArray();
    res.status(200).json(allAppointments);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// Fallback for 404 in public website
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public-website/404.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});