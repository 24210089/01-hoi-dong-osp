// src/routes/lookupRoutes.js
const express = require("express");
const router = express.Router();
const lookupController = require("../controllers/lookupController");
const { authenticateToken } = require("../middlewares/auth");

// Journey Stages routes
router.get(
  "/journey-stages",
  authenticateToken,
  lookupController.getJourneyStages
);
router.get(
  "/journey-stages/all",
  authenticateToken,
  lookupController.getAllJourneyStages
);
router.post(
  "/journey-stages",
  authenticateToken,
  lookupController.createJourneyStage
);
router.put(
  "/journey-stages/:id",
  authenticateToken,
  lookupController.updateJourneyStage
);
router.delete(
  "/journey-stages/:id",
  authenticateToken,
  lookupController.deleteJourneyStage
);

// Sister Statuses routes
router.get(
  "/sister-statuses",
  authenticateToken,
  lookupController.getSisterStatuses
);
router.get(
  "/sister-statuses/all",
  authenticateToken,
  lookupController.getAllSisterStatuses
);
router.post(
  "/sister-statuses",
  authenticateToken,
  lookupController.createSisterStatus
);
router.put(
  "/sister-statuses/:id",
  authenticateToken,
  lookupController.updateSisterStatus
);
router.delete(
  "/sister-statuses/:id",
  authenticateToken,
  lookupController.deleteSisterStatus
);

// User Roles routes
router.get("/user-roles", authenticateToken, lookupController.getUserRoles);

module.exports = router;
