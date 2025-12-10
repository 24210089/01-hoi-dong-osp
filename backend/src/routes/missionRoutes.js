const express = require("express");
const missionController = require("../controllers/missionController");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

router.use(authenticateToken);

router.get("/", missionController.getAllMissions);
router.get("/sister/:sisterId", missionController.getMissionsBySister);
router.get("/field/:field", missionController.getSistersByMissionField);
router.get("/:id", missionController.getMissionById);

router.post("/", missionController.createMission);

router.put("/:id", missionController.updateMission);
router.delete("/:id", missionController.deleteMission);

router.post("/:id/end", missionController.endMission);

module.exports = router;
