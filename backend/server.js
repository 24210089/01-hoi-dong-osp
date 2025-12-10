const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/permissions", require("./routes/permissions"));
app.use("/api/communities", require("./routes/communities"));
app.use("/api/sisters", require("./routes/sisters"));

// ============================================
// NEW ROUTES - Features liên quan đến Nữ Tu
// ============================================

app.use("/api/journeys", require("./routes/journeys"));
app.use("/api/education", require("./routes/education"));
app.use("/api/missions", require("./routes/missions"));
app.use("/api/health", require("./routes/health"));
app.use("/api/evaluations", require("./routes/evaluations"));

// Reports
app.use("/api/reports", require("./routes/reports"));

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✅ Community-based filtering is enabled for all features`);
});
const startServer = async () => {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log("Database connection verified successfully.");

    app.listen(PORT, () => {
      console.log(
        `HR Records Management API listening on port ${PORT} (env: ${
          process.env.NODE_ENV || "development"
        })`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
