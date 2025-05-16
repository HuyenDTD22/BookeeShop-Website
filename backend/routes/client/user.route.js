const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/authClient.middleware");

router.post("/register", validate.register, controller.register);

router.post("/login", validate.login, controller.login);

router.post("/logout", controller.logout);

router.post(
  "/password/forgot",
  validate.forgotPassword,
  controller.forgotPassword
);

router.post("/password/otp", validate.otpPassword, controller.otpPassword);

router.post(
  "/password/reset",
  authMiddleware.requireAuth,
  validate.resetPassword,
  controller.resetPassword
);

router.get("/info", authMiddleware.requireAuth, controller.info);

router.patch(
  "/update",
  authMiddleware.requireAuth,
  validate.update,
  controller.update
);

module.exports = router;
