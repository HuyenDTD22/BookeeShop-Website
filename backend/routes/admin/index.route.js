const systemConfig = require("../../config/system");

const authMiddleware = require("../../middlewares/auth.middleware");

const bookRoutes = require("./book.route");
const categoryRoutes = require("./category.route");
const accountRoutes = require("./account.route");
const roleRoutes = require("./role.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  //   app.use(PATH_ADMIN + "/book", authMiddleware.requireAuthAdmin, bookRoutes); - Nhớ thêm authMiddleware.requireAuthAdmin cho những route khác bên dưới
  app.use(PATH_ADMIN + "/book", bookRoutes);

  app.use(PATH_ADMIN + "/category", categoryRoutes);

  app.use(PATH_ADMIN + "/role", roleRoutes);

  app.use(PATH_ADMIN + "/account", accountRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);

  app.use(PATH_ADMIN + "/my-account", myAccountRoutes);
};
