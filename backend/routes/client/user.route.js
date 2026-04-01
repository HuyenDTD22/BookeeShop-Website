const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/user.validate");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");
const authMiddleware = require("../../middlewares/authClient.middleware");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management APIs
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             fullName: Nguyen Van A
 *             email: test@gmail.com
 *             password: 123456
 *     responses:
 *       200:
 *         description: Register success
 */
router.post("/register", validate.register, controller.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: test@gmail.com
 *             password: 123456
 *     responses:
 *       200:
 *         description: Login success
 */
router.post("/login", validate.login, controller.login);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Logout success
 */
router.post("/logout", controller.logout);

/**
 * @swagger
 * /user/password/forgot:
 *   post:
 *     summary: Send OTP to reset password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: test@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post(
  "/password/forgot",
  validate.forgotPassword,
  controller.forgotPassword,
);

/**
 * @swagger
 * /user/password/otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: test@gmail.com
 *             otp: 123456
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post("/password/otp", validate.otpPassword, controller.otpPassword);

/**
 * @swagger
 * /user/password/reset:
 *   post:
 *     summary: Reset password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             password: newpassword123
 *     responses:
 *       200:
 *         description: Password reset success
 */
router.post(
  "/password/reset",
  authMiddleware.requireAuth,
  validate.resetPassword,
  controller.resetPassword,
);

/**
 * @swagger
 * /user/info:
 *   get:
 *     summary: Get user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info retrieved
 */
router.get("/info", authMiddleware.requireAuth, controller.info);

/**
 * @swagger
 * /user/update:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Update success
 */
router.patch(
  "/update",
  authMiddleware.requireAuth,
  upload.single("avatar"),
  uploadCloud.upload,
  validate.update,
  controller.update,
);

module.exports = router;
