const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/order.controller");
const authMiddleware = require("../../middlewares/authClient.middleware");
const orderValidate = require("../../validates/client/order.validate");

router.get("/", authMiddleware.requireAuth, controller.index);

router.post(
  "/create",
  authMiddleware.requireAuth,
  orderValidate.create,
  controller.create
);

router.get(
  "/success/:orderId",
  authMiddleware.requireAuth,
  orderValidate.success,
  controller.success
);

router.get("/my-orders", authMiddleware.requireAuth, controller.getMyOrders);

router.get(
  "/detail/:orderId",
  authMiddleware.requireAuth,
  orderValidate.detail,
  controller.detail
);

router.patch(
  "/cancel/:orderId",
  authMiddleware.requireAuth,
  orderValidate.cancel,
  controller.cancel
);

module.exports = router;
