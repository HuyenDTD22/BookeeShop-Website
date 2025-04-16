const Category = require("../models/category.model");

const createTreeHelper = require("../helpers/createTree");

module.exports.category = async (req, res, next) => {
  const category = await Category.find({
    deleted: false,
  });

  const newCategory = createTreeHelper.tree(category);

  res.locals.layoutCategory = newCategory;

  next();
};
