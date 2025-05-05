const categoryMiddleware = require("../../middlewares/category.middleware");
const cartMiddleware = require("../../middlewares/cart.middleware");
const settingMiddleware = require("../../middlewares/setting.middleware");

const homeRoutes = require("./home.route");
const userRoutes = require("./user.route");
const bookRoutes = require("./book.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const orderRoutes = require("./order.route");
const commentRoutes = require("./comment.route");
const ratingRoutes = require("./rating.route");
const notificationRoutes = require("./notification.route");

module.exports = (app) => {
  app.use(categoryMiddleware.category);

  app.use(cartMiddleware.cartId);

  app.use(settingMiddleware.setting);

  app.use("/", homeRoutes);

  app.use("/user", userRoutes);

  app.use("/book", bookRoutes);

  app.use("/search", searchRoutes);

  app.use("/cart", cartRoutes);

  app.use("/order", orderRoutes);

  app.use("/comment", commentRoutes);

  app.use("/rating", ratingRoutes);

  app.use("/notification", notificationRoutes);
};
