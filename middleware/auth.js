const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: "No token provided" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret_key_here",
    (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ error: "Forbidden", message: "Invalid or expired token" });
      }
      req.user = user;
      next();
    }
  );
};
