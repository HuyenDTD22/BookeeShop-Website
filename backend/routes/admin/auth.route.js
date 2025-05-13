const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/auth.controller");
const validate = require("../../validates/admin/auth.validate");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/login", validate.login, controller.login);

router.get("/logout", controller.logout);

router.get("/info", authMiddleware.requireAuthAdmin, controller.getAuthInfo);

router.post(
  "/password/forgot",
  validate.forgotPassword,
  controller.forgotPassword
);

router.post("/password/otp", validate.otpPassword, controller.otpPassword);

router.post(
  "/password/reset",
  authMiddleware.requireAuthAdmin,
  validate.resetPassword,
  controller.resetPassword
);

module.exports = router;
