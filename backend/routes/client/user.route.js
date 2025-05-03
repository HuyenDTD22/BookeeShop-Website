const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/user.validate");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");
const authMiddleware = require("../../middlewares/authClient.middleware");

router.post("/register", validate.register, controller.register);

router.post("/login", controller.login);

router.post("/logout", controller.logout);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/opt", controller.otpPassword);

router.post(
  "/password/reset",
  authMiddleware.requireAuth,
  controller.resetPassword
);

router.get("/info", authMiddleware.requireAuth, controller.info);

module.exports = router;
