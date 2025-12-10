const express = require("express");
const educationController = require("../controllers/educationController");
const { authenticateToken } = require("../middlewares/auth");
const {
  validateEducationCreate,
  handleValidationErrors,
} = require("../middlewares/validation");
const { uploadDocument } = require("../middlewares/upload");

const router = express.Router();

router.use(authenticateToken);

// List all education records
router.get("/", educationController.getAllEducation);

router.get("/sister/:sisterId", educationController.getEducationBySister);
router.get("/statistics/level", educationController.getStatisticsByLevel);
router.get("/:id", educationController.getEducationById);

router.post(
  "/",
  validateEducationCreate,
  handleValidationErrors,
  educationController.addEducation
);

router.put("/:id", educationController.updateEducation);

router.delete("/:id", educationController.deleteEducation);

router.post(
  "/:id/certificate",
  uploadDocument,
  educationController.uploadCertificate
);

module.exports = router;
