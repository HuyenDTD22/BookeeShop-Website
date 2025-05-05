const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/notification.controller");
const authMiddleware = require("../../middlewares/authClient.middleware");

router.get("/", authMiddleware.requireAuth, controller.getNotifications);

router.patch(
  "/:id",
  authMiddleware.requireAuth,
  controller.getDetailNotification
);

module.exports = router;
