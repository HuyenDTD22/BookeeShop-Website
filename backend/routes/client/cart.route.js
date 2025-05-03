const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");

router.get("/", controller.index);

router.post("/add/:bookId", controller.add);

router.get("/update/:bookId/:quantity", controller.update);

router.get("/delete/:bookId", controller.delete);

module.exports = router;
