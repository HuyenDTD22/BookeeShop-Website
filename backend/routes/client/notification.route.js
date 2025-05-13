const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/notification.controller");
const authMiddleware = require("../../middlewares/authClient.middleware");
const notificationValidate = require("../../validates/client/notification.validate");

router.get("/", authMiddleware.requireAuth, controller.index);

router.get(
  "/detail/:id",
  authMiddleware.requireAuth,
  notificationValidate.detail,
  controller.detail
);

router.patch(
  "/:id/read",
  authMiddleware.requireAuth,
  notificationValidate.read,
  controller.read
);

router.get("/unread-count", authMiddleware.requireAuth, controller.unreadCount);

module.exports = router;
