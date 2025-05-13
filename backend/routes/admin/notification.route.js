const express = require("express");
const router = express.Router();

const notificationValidate = require("../../validates/admin/notification.validate");
const notificationController = require("../../controllers/admin/notification.controller");

router.get("/", notificationController.index);

router.get(
  "/detail/:id",
  notificationValidate.detail,
  notificationController.detail
);

router.post(
  "/create",
  notificationValidate.create,
  notificationController.create
);

router.put("/edit/:id", notificationValidate.edit, notificationController.edit);

router.patch(
  "/change-status/:id",
  notificationValidate.changeStatus,
  notificationController.changeStatus
);

router.patch(
  "/change-multi",
  notificationValidate.changeMulti,
  notificationController.changeMulti
);

router.post(
  "/send/:id",
  notificationValidate.send,
  notificationController.send
);

router.post(
  "/schedule/:id",
  notificationValidate.schedule,
  notificationController.schedule
);

router.delete(
  "/delete/:id",
  notificationValidate.delete,
  notificationController.delete
);

router.delete(
  "/delete-multi",
  notificationValidate.deleteMulti,
  notificationController.deleteMulti
);

router.get("/read/:id", notificationValidate.read, notificationController.read);

router.get("/stats", notificationController.stats);

module.exports = router;
