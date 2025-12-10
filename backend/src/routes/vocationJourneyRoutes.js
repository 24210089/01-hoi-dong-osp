const express = require("express");
const vocationJourneyController = require("../controllers/vocationJourneyController");
const { authenticateToken } = require("../middlewares/auth");
const {
  validateVocationJourneyCreate,
  handleValidationErrors,
} = require("../middlewares/validation");

const router = express.Router();

router.use(authenticateToken);

// Get all journeys with pagination
router.get("/", vocationJourneyController.getAllJourneys);

// Statistics - must be before /:id
router.get("/statistics", vocationJourneyController.getStatisticsByStage);

// Get journeys by sister - must be before /:id
router.get("/sister/:sisterId", vocationJourneyController.getJourneyBySister);

// Get journey by ID - must be after specific routes
router.get("/:id", vocationJourneyController.getJourneyById);

// Create new journey with sister_id in body
router.post("/", vocationJourneyController.createJourney);

router.put("/:stageId", vocationJourneyController.updateJourneyStage);

router.delete("/:stageId", vocationJourneyController.deleteJourneyStage);

module.exports = router;
