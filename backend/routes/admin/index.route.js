const systemConfig = require("../../config/system");

const authMiddleware = require("../../middlewares/auth.middleware");

const dashboardRoutes = require("./dashboard.route");
const bookRoutes = require("./book.route");
const categoryRoutes = require("./category.route");
const accountRoutes = require("./account.route");
const roleRoutes = require("./role.route");
const authRoutes = require("./auth.route");
const orderRoutes = require("./order.route");
const userRoutes = require("./user.route");
const commentRoutes = require("./comment.route");
const ratingRoutes = require("./rating.route");
const notificationRoutes = require("./notification.route");
const mySettingRoutes = require("./setting.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuthAdmin,
    dashboardRoutes
  );

  app.use(PATH_ADMIN + "/book", authMiddleware.requireAuthAdmin, bookRoutes);

  app.use(
    PATH_ADMIN + "/category",
    authMiddleware.requireAuthAdmin,
    categoryRoutes
  );

  app.use(PATH_ADMIN + "/role", authMiddleware.requireAuthAdmin, roleRoutes);

  app.use(
    PATH_ADMIN + "/account",
    authMiddleware.requireAuthAdmin,
    accountRoutes
  );

  app.use(PATH_ADMIN + "/auth", authRoutes);

  app.use(PATH_ADMIN + "/order", authMiddleware.requireAuthAdmin, orderRoutes);

  app.use(PATH_ADMIN + "/user", authMiddleware.requireAuthAdmin, userRoutes);

  app.use(
    PATH_ADMIN + "/comment",
    authMiddleware.requireAuthAdmin,
    commentRoutes
  );

  app.use(
    PATH_ADMIN + "/rating",
    authMiddleware.requireAuthAdmin,
    ratingRoutes
  );

  app.use(
    PATH_ADMIN + "/notification",
    authMiddleware.requireAuthAdmin,
    notificationRoutes
  );

  app.use(
    PATH_ADMIN + "/setting",
    authMiddleware.requireAuthAdmin,
    mySettingRoutes
  );
};
