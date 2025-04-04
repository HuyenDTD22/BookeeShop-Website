const express = require("express");
const router = express.Router();

const controller = require("../controllers/book.controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

module.exports = router;