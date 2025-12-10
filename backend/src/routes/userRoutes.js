const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/auth");
const {
  validateUserCreate,
  handleValidationErrors,
} = require("../middlewares/validation");

const router = express.Router();

router.use(authenticateToken);

// Profile routes (must be before /:id routes)
router.put("/profile", userController.updateProfile);
router.post("/change-password", userController.changePassword);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

router.post(
  "/",
  validateUserCreate,
  handleValidationErrors,
  userController.createUser
);

router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

router.post(
  "/:id/reset-password",
  body("newPassword")
    .notEmpty()
    .withMessage("newPassword is required")
    .isLength({ min: 6 })
    .withMessage("newPassword must be at least 6 characters"),
  handleValidationErrors,
  userController.resetPassword
);

router.post("/:id/toggle-status", userController.toggleUserStatus);

router.get("/:id/activities", userController.getUserActivities);

module.exports = router;
