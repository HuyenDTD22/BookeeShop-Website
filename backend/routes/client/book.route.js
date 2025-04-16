const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/book.controller");

router.get("/", controller.index);

router.get("/:slugCategory", controller.category);

router.get("/detail/:slugBook", controller.detail);

module.exports = router;
