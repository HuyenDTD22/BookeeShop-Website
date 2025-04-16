const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/auth.controller");
const validate = require("../../validates/auth.validate");

router.post("/login", validate.login, controller.login); //Tính năng đăng nhập

router.get("/logout", controller.logout); //Tính năng đăng xuất

module.exports = router;
