const express = require("express");
const auditLogController = require("../controllers/auditLogController");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

router.use(authenticateToken);

router.get("/", auditLogController.getAuditLogs);
router.get("/user/:userId", auditLogController.getAuditLogsByUser);
router.get("/table/:tableName", auditLogController.getAuditLogsByTable);
router.get(
  "/table/:tableName/record/:recordId",
  auditLogController.getAuditLogsByRecord
);

module.exports = router;
