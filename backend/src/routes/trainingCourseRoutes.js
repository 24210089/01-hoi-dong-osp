const express = require("express");
const trainingCourseController = require("../controllers/trainingCourseController");
const { authenticateToken } = require("../middlewares/auth");
const {
  validateTrainingCourseCreate,
  handleValidationErrors,
} = require("../middlewares/validation");

const router = express.Router();

router.use(authenticateToken);

router.get("/", trainingCourseController.getAllCourses);
router.get("/sister/:sisterId", trainingCourseController.getCoursesBySister);

router.post(
  "/",
  validateTrainingCourseCreate,
  handleValidationErrors,
  trainingCourseController.addCourse
);

router.put("/:id", trainingCourseController.updateCourse);

router.delete("/:id", trainingCourseController.deleteCourse);

module.exports = router;
