const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/user.validate");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.post("/register", validate.register, controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/opt", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

router.get("/detail", controller.detail);

module.exports = router;
