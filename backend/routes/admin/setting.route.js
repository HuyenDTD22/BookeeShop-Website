const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/setting.controller");

router.get("/", controller.index);

router.patch("/general", controller.general);

module.exports = router;
