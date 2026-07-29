const express = require("express");

const router = express.Router();


const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
  approveEvent,
  rejectEvent,
  cancelEvent,
} = require("../controllers/eventController");


const verifyToken =
require("../middlewares/verifyToken");


const authorizeRole =
require("../middlewares/authorizeRole");


const upload =
require("../configs/multer");




// ==========================
// Public Routes
// ==========================


// Get all approved events

router.get(
  "/",
  getAllEvents
);



// Get event details

router.get(
  "/:id",
  getEventById
);




// ==========================
// Organizer + Admin Routes
// ==========================



// Create Event

router.post(
  "/",
  verifyToken,
  authorizeRole(
    "organizer",
    "admin"
  ),
  upload.single("poster"),
  createEvent
);




// Update Event

router.put(
  "/:id",
  verifyToken,
  authorizeRole(
    "organizer",
    "admin"
  ),
  upload.single("poster"),
  updateEvent
);




// Delete Event

router.delete(
  "/:id",
  verifyToken,
  authorizeRole(
    "organizer",
    "admin"
  ),
  deleteEvent
);




// Organizer My Events

router.get(
  "/organizer/my-events",
  verifyToken,
  authorizeRole(
    "organizer",
    "admin"
  ),
  getMyEvents
);




// Cancel Event

router.patch(
  "/:id/cancel",
  verifyToken,
  authorizeRole(
    "organizer",
    "admin"
  ),
  cancelEvent
);






// ==========================
// Admin Only Routes
// ==========================



// Approve Event

router.patch(
  "/:id/approve",
  verifyToken,
  authorizeRole("admin"),
  approveEvent
);




// Reject Event

router.patch(
  "/:id/reject",
  verifyToken,
  authorizeRole("admin"),
  rejectEvent
);





module.exports = router;