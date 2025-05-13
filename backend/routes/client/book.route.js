const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/book.controller");
const bookValidate = require("../../validates/client/book.validate");

router.get("/", controller.index);

router.get("/:slugCategory", bookValidate.category, controller.category);

router.get("/detail/:slugBook", bookValidate.detail, controller.detail);

module.exports = router;
