const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/comment.controller");

router.get("/:bookId", controller.index);

router.post("/reply/:commentId", controller.reply);

router.delete("/delete/:commentId", controller.delete);

router.patch("/delete-multi", controller.deleteMulti);

router.patch("/delete-all/:bookId", controller.deleteAll);

module.exports = router;
