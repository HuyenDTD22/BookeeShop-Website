const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");
const authMiddleware = require("../../middlewares/authClient.middleware");
const cartValidate = require("../../validates/client/cart.validate");

router.get("/", authMiddleware.requireAuth, controller.index);

router.post(
  "/add/:slug",
  authMiddleware.requireAuth,
  cartValidate.add,
  controller.add
);

router.patch(
  "/update/:bookId",
  authMiddleware.requireAuth,
  cartValidate.update,
  controller.update
);

router.get(
  "/delete/:bookId",
  authMiddleware.requireAuth,
  cartValidate.delete,
  controller.delete
);

module.exports = router;
