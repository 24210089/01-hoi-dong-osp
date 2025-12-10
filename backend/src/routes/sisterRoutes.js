const express = require("express");
const sisterController = require("../controllers/sisterController");
const { authenticateToken } = require("../middlewares/auth");
const {
  validateSisterCreate,
  validateSisterUpdate,
  handleValidationErrors,
} = require("../middlewares/validation");
const { uploadPhoto, uploadDocuments } = require("../middlewares/upload");
const { logAction } = require("../middlewares/auditLog");
const { cacheMiddleware } = require("../middlewares/cache");

const router = express.Router();

const logSisterAction = (action) =>
  logAction({
    action,
    tableName: "sisters",
    getRecordId: (req) => req.params.id || null,
    getNewValue: (req, res) => (res.locals.payload ? res.locals.payload : null),
  });

router.use(authenticateToken);

router.get("/", sisterController.getAllSisters);
router.get("/search", sisterController.searchSisters);
router.get("/:id", sisterController.getSisterById);

router.post(
  "/",
  validateSisterCreate,
  handleValidationErrors,
  (req, res, next) => {
    res.locals.auditAction = "CREATE";
    next();
  },
  sisterController.createSister,
  logSisterAction("CREATE")
);

router.put(
  "/:id",
  validateSisterUpdate,
  handleValidationErrors,
  (req, res, next) => {
    res.locals.auditAction = "UPDATE";
    res.locals.payload = req.body;
    next();
  },
  sisterController.updateSister,
  logSisterAction("UPDATE")
);

router.delete(
  "/:id",
  (req, res, next) => {
    res.locals.auditAction = "DELETE";
    next();
  },
  sisterController.deleteSister,
  logSisterAction("DELETE")
);

router.post(
  "/:id/photo",
  uploadPhoto,
  sisterController.updateSisterPhoto,
  logSisterAction("UPLOAD_PHOTO")
);

router.post(
  "/:id/documents",
  uploadDocuments,
  sisterController.uploadSisterDocuments,
  logSisterAction("UPLOAD_DOCUMENTS")
);

router.delete(
  "/:id/documents/:docIndex",
  sisterController.deleteSisterDocument,
  logSisterAction("DELETE_DOCUMENT")
);

module.exports = router;
