const { body, param, query, validationResult } = require("express-validator");

const bookValidation = {
  index: [
    query("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Trạng thái không hợp lệ"),
    query("sortKey")
      .optional()
      .isIn(["title", "price", "stock", "createdAt"])
      .withMessage("Khóa sắp xếp không hợp lệ"),
    query("sortValue")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Giá trị sắp xếp không hợp lệ"),
    query("keyword")
      .optional()
      .isString()
      .trim()
      .withMessage("Từ khóa phải là chuỗi"),
  ],

  detail: [param("id").isMongoId().withMessage("ID sách không hợp lệ")],

  changeStatus: [
    param("id").isMongoId().withMessage("ID sách không hợp lệ"),
    body("status")
      .isIn(["active", "inactive"])
      .withMessage("Trạng thái không hợp lệ"),
  ],

  changeMulti: [
    body("ids").isArray({ min: 1 }).withMessage("Danh sách ID không hợp lệ"),
    body("ids.*").isMongoId().withMessage("ID sách không hợp lệ"),
    body("key").isIn(["status", "delete"]).withMessage("Khóa không hợp lệ"),
    body("value")
      .if(body("key").equals("status"))
      .isIn(["active", "inactive"])
      .withMessage("Giá trị trạng thái không hợp lệ"),
  ],

  create: [
    body("title").notEmpty().withMessage("Tiêu đề sách là bắt buộc"),
    body("price")
      .isInt({ min: 0 })
      .withMessage("Giá phải là số nguyên không âm"),
    body("discountPercentage")
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage("Phần trăm giảm giá phải từ 0-100"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Số lượng tồn kho phải là số nguyên không âm"),
    body("author")
      .optional()
      .isString()
      .trim()
      .withMessage("Tác giả phải là chuỗi"),
    body("publisher")
      .optional()
      .isString()
      .trim()
      .withMessage("Nhà xuất bản phải là chuỗi"),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Trạng thái không hợp lệ"),
    body("position")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Vị trí phải là số nguyên dương"),
  ],

  edit: [
    param("id").isMongoId().withMessage("ID sách không hợp lệ"),
    body("title").notEmpty().withMessage("Tiêu đề sách là bắt buộc"),
    body("price")
      .isInt({ min: 0 })
      .withMessage("Giá phải là số nguyên không âm"),
    body("discountPercentage")
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage("Phần trăm giảm giá phải từ 0-100"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Số lượng tồn kho phải là số nguyên không âm"),
    body("author")
      .optional()
      .isString()
      .trim()
      .withMessage("Tác giả phải là chuỗi"),
    body("publisher")
      .optional()
      .isString()
      .trim()
      .withMessage("Nhà xuất bản phải là chuỗi"),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Trạng thái không hợp lệ"),
    body("position")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Vị trí phải là số nguyên dương"),
  ],

  delete: [param("id").isMongoId().withMessage("ID sách không hợp lệ")],

  handleValidationErrors: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        code: 400,
        message: errors
          .array()
          .map((err) => err.msg)
          .join(", "),
      });
    }
    next();
  },
};

module.exports = bookValidation;
