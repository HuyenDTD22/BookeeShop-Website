const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/home.controller");

router.get("/", controller.index);

router.get("/search", controller.search);

module.exports = router;
