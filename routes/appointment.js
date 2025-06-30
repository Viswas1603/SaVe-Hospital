const express = require("express");
const router = express.Router();
const connectDB = require("../db");
const { ObjectId } = require("mongodb"); // Needed for delete and update

// POST - Book an Appointment
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    console.log("📦 Connected to DB:", db.databaseName);
    console.log("📥 Appointment Received:", req.body);

    const appointments = db.collection("appointments");
    const result = await appointments.insertOne(req.body);

    console.log("✅ Inserted ID:", result.insertedId);
    res.status(201).json({ message: "Appointment booked successfully!", id: result.insertedId });
  } catch (err) {
    console.error("❌ Error booking appointment:", err);
    res.status(500).json({ message: "Failed to book appointment" });
  }
});

// GET - Fetch All Appointments
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const appointments = db.collection("appointments");
    const result = await appointments.find().toArray();
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Failed to fetch appointments:", err);
    res.status(500).json({ message: "Unable to fetch appointments" });
  }
});

// PUT - Update an Appointment by ID
router.put("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const appointments = db.collection("appointments");

    const { id } = req.params;
    const updatedData = req.body;

    const result = await appointments.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Appointment updated successfully" });
    } else {
      res.status(404).json({ message: "Appointment not found or no changes made" });
    }
  } catch (err) {
    console.error("❌ Update failed:", err);
    res.status(500).json({ message: "Failed to update appointment" });
  }
});

// DELETE - Remove an Appointment by ID
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const appointments = db.collection("appointments");
    const result = await appointments.deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Appointment deleted successfully" });
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
});

module.exports = router;