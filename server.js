const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const sequelize = require("./config/database");
const swaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const aspirationRoutes = require("./routes/aspirations");
const newsRoutes = require("./routes/news");
const forumRoutes = require("./routes/forum");
const pollRoutes = require("./routes/polls");
const notificationRoutes = require("./routes/notifications");
const chatRoutes = require("./routes/chat");
const activityRoutes = require("./routes/activity");

app.use("/v1/auth", authRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/products", productRoutes);
app.use("/v1/aspirations", aspirationRoutes);
app.use("/v1/news", newsRoutes);
app.use("/v1/forum", forumRoutes);
app.use("/v1/polls", pollRoutes);
app.use("/v1/notifications", notificationRoutes);
app.use("/v1/chat", chatRoutes);
app.use("/v1/activity-log", activityRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).json({
    error: "Validation Error",
    message: err.message || "Something went wrong",
    fields: err.fields || {},
  });
});

// Database Sync and Server Initiation
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API Base URL: https://api.pbi-dashboard.example.com/v1`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
