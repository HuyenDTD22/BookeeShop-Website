const categoryMiddleware = require("../../middlewares/category.middleware");
const cartMiddleware = require("../../middlewares/cart.middleware");

const homeRoutes = require("./home.route");
const userRoutes = require("./user.route");
const bookRoutes = require("./book.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");

module.exports = (app) => {
  app.use(categoryMiddleware.category);

  app.use(cartMiddleware.cartId);

  app.use("/", homeRoutes);

  app.use("/user", userRoutes);

  app.use("/book", bookRoutes);

  app.use("/search", searchRoutes);

  app.use("/cart", cartRoutes);
};
