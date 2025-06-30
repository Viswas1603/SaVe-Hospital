require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const connectDB = require("./db");
const appointmentRoutes = require("./routes/appointment");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public-website"))); // Adjust if folder name is different

// API routes
app.use("/api/appointments", appointmentRoutes);

// Admin portal static files (optional)
app.use("/admin", express.static(path.join(__dirname, "admin-portal"))); // Adjust accordingly

// Fallback for 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public-website", "404.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});