// const express = require("express");
// const multer = require("multer");
// const router = express.Router();

// const upload = multer();

// const controller = require("../../controllers/admin/book.controller");
// const uploadCloud = require("../../middlewares/uploadCloud.middleware");

// router.get("/", controller.index);

// router.get("/detail/:id", controller.detail);

// router.patch("/change-status/:id", controller.changeStatus);

// router.patch("/change-multi", controller.changeMulti);

// router.post(
//   "/create",
//   upload.single("thumbnail"),
//   uploadCloud.upload,
//   controller.create
// );

// router.patch(
//   "/edit/:id",
//   upload.single("thumbnail"),
//   uploadCloud.upload,
//   controller.edit
// );

// router.delete("/delete/:id", controller.delete);

// module.exports = router;

const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();
const controller = require("../../controllers/admin/book.controller");
const bookValidate = require("../../validates/admin/book.validate");
const uploadCloud = require("../../middlewares/uploadCloud.middleware");

router.get(
  "/",
  bookValidate.index,
  bookValidate.handleValidationErrors,
  controller.index
);

router.get(
  "/detail/:id",
  bookValidate.detail,
  bookValidate.handleValidationErrors,
  controller.detail
);

router.patch(
  "/change-status/:id",
  bookValidate.changeStatus,
  bookValidate.handleValidationErrors,
  controller.changeStatus
);

router.patch(
  "/change-multi",
  bookValidate.changeMulti,
  bookValidate.handleValidationErrors,
  controller.changeMulti
);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  bookValidate.create,
  bookValidate.handleValidationErrors,
  controller.create
);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  bookValidate.edit,
  bookValidate.handleValidationErrors,
  controller.edit
);

router.delete(
  "/delete/:id",
  bookValidate.delete,
  bookValidate.handleValidationErrors,
  controller.delete
);

module.exports = router;
