const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/my-account.controller");

const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get("/", (req, res) => {
  const user = res.locals.user;
  const role = res.locals.role;

  res.json({
    code: 200,
    user: user,
    role: role,
  });
});

router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.edit
);

module.exports = router;
