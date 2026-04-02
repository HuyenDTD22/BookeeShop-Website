const jwt = require("jsonwebtoken");

module.exports.setAuthCookie = (res, userId) => {
  const token = jwt.sign(
    { _id: userId },
    process.env.JWT_SECRET || "your-secret-key",
    {
      expiresIn: "7d",
    },
  );

  return token;
};
