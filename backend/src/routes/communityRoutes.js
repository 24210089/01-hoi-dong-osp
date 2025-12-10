const express = require("express");
const communityController = require("../controllers/communityController");
const { authenticateToken } = require("../middlewares/auth");
const {
  validateCommunityCreate,
  handleValidationErrors,
} = require("../middlewares/validation");
const { cacheMiddleware } = require("../middlewares/cache");

const router = express.Router();

router.use(authenticateToken);

router.get("/", cacheMiddleware(600), communityController.getAllCommunities);
router.get("/:id", communityController.getCommunityById);
router.get("/:id/members", communityController.getCommunityMembers);

router.post(
  "/",
  validateCommunityCreate,
  handleValidationErrors,
  communityController.createCommunity
);

router.put(
  "/:id",
  validateCommunityCreate,
  handleValidationErrors,
  communityController.updateCommunity
);

router.delete("/:id", communityController.deleteCommunity);

// Member management routes
router.post("/:id/members", communityController.addMember);

router.put("/:id/members/:memberId", communityController.updateMemberRole);

router.delete("/:id/members/:memberId", communityController.removeMember);

module.exports = router;
