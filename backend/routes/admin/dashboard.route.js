const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dashboard.controller");

// API để lấy dữ liệu tổng quan cho Dashboard
router.get("/stats", controller.getDashboardStats);

module.exports = router;
