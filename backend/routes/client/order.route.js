const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/order.controller");
const authMiddleware = require("../../middlewares/authClient.middleware");

router.get("/", authMiddleware.requireAuth, controller.index);

router.post("/create", authMiddleware.requireAuth, controller.create);

router.post("/buy-now", authMiddleware.requireAuth, controller.buyNow);

router.get("/success/:orderId", authMiddleware.requireAuth, controller.success);

router.get("/my-orders", authMiddleware.requireAuth, controller.getMyOrders);

router.get("/detail/:orderId", authMiddleware.requireAuth, controller.detail);

router.patch("/cancel/:orderId", authMiddleware.requireAuth, controller.cancel);

module.exports = router;
