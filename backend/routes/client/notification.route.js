const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/notification.controller");
const authMiddleware = require("../../middlewares/authClient.middleware");

router.get("/", authMiddleware.requireAuth, controller.getNotifications);

router.get(
  "/:id",
  authMiddleware.requireAuth,
  controller.getDetailNotification
);

router.patch("/:id/read", authMiddleware.requireAuth, controller.markAsRead);

router.get(
  "/unread-count",
  authMiddleware.requireAuth,
  controller.getUnreadCount
);

module.exports = router;
