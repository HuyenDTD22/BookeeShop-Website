const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");
const authMiddleware = require("../../middlewares/authClient.middleware");

router.get("/", authMiddleware.requireAuth, controller.index);

router.post("/add/:slug", authMiddleware.requireAuth, controller.add);

router.get(
  "/update/:bookId/:quantity",
  authMiddleware.requireAuth,
  controller.update
);

router.get("/delete/:bookId", authMiddleware.requireAuth, controller.delete);

module.exports = router;
