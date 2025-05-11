const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/rating.controller");

router.get("/:bookId", controller.index);

router.patch("/delete-all/:bookId", controller.deleteAll);

module.exports = router;
