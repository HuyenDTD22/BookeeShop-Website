const Book = require("../../models/book.model");
const Category = require("../../models/category.model");
const Order = require("../../models/order.model");

const bookHelper = require("../../helpers/book");
const categoryHelper = require("../../helpers/category");

//[GET] /book - Hiển thị ra danh sách sản phẩm
module.exports.index = async (req, res) => {
  try {
    const { rating, sortBy, sortOrder } = req.query;
    const query = { status: "active", deleted: false };

    // Lọc theo rating
    if (rating) {
      const ratingNum = parseInt(rating);
      if (ratingNum === 5) {
        query.rating_mean = 5;
      } else if (ratingNum >= 1 && ratingNum <= 4) {
        query.rating_mean = {
          $gte: ratingNum,
          $lt: ratingNum + 1,
        };
      }
    }

    // Chỉ lấy các trường cần thiết
    const selectFields = {
      _id: 1,
      title: 1,
      thumbnail: 1,
      price: 1,
      discountPercentage: 1,
      rating_mean: 1,
      slug: 1,
    };

    // Lấy toàn bộ sách, sắp xếp theo rating_mean nếu cần
    const sort = {};
    const validSortFields = ["rating_mean"];
    const validSortOrders = ["asc", "desc"];
    if (
      sortBy &&
      sortOrder &&
      validSortFields.includes(sortBy) &&
      validSortOrders.includes(sortOrder)
    ) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    let books = await Book.find(query).select(selectFields).sort(sort).lean();

    // Tính priceNew
    books = bookHelper.priceNewBooks(books);

    // Tính soldCount từ orders
    const orders = await Order.find({ status: "completed" })
      .select("books")
      .lean();
    const soldCountMap = {};
    orders.forEach((order) => {
      order.books.forEach((book) => {
        const bookId = book.book_id.toString();
        soldCountMap[bookId] = (soldCountMap[bookId] || 0) + book.quantity;
      });
    });

    books = books.map((book) => ({
      ...book,
      soldCount: soldCountMap[book._id.toString()] || 0,
    }));

    // Sắp xếp theo priceNew hoặc soldCount trong JavaScript nếu cần
    if (sortBy && validSortOrders.includes(sortOrder)) {
      if (sortBy === "priceNew") {
        books.sort((a, b) => {
          const valA = a.priceNew || 0;
          const valB = b.priceNew || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
      } else if (sortBy === "soldCount") {
        books.sort((a, b) => {
          const valA = a.soldCount || 0;
          const valB = b.soldCount || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
      }
    }

    const total = books.length;

    res.json({
      code: 200,
      books,
      total,
    });
  } catch (error) {
    console.error("Error in getAllBooks:", error);
    res.json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /book/:slugCategory - Lấy ra các sản phẩm thuộc danh mục
module.exports.category = async (req, res) => {
  try {
    const { rating, sortBy, sortOrder } = req.query;

    // Tìm danh mục
    const category = await Category.findOne({
      slug: req.params.slugCategory,
      status: "active",
      deleted: false,
    }).lean();

    if (!category) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy danh mục",
      });
    }

    // Lấy danh sách danh mục con
    const lisSubcategory = await categoryHelper.getSubCategory(category._id);
    const lisSubcategoryId = lisSubcategory.map((item) => item._id);

    // Tạo query tìm sách
    const query = {
      book_category_id: { $in: [category._id, ...lisSubcategoryId] },
      status: "active",
      deleted: false,
    };

    // Lọc theo rating
    if (rating) {
      const ratingNum = parseInt(rating);
      if (ratingNum === 5) {
        query.rating_mean = 5;
      } else if (ratingNum >= 1 && ratingNum <= 4) {
        query.rating_mean = {
          $gte: ratingNum,
          $lt: ratingNum + 1,
        };
      }
    }

    // Chỉ lấy các trường cần thiết
    const selectFields = {
      _id: 1,
      title: 1,
      thumbnail: 1,
      price: 1,
      discountPercentage: 1,
      rating_mean: 1,
      slug: 1,
    };

    // Sắp xếp trong MongoDB nếu sortBy là rating_mean
    const sort = {};
    const validSortFields = ["rating_mean"];
    const validSortOrders = ["asc", "desc"];
    if (
      sortBy &&
      sortOrder &&
      validSortFields.includes(sortBy) &&
      validSortOrders.includes(sortOrder)
    ) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    // Lấy toàn bộ sách
    let books = await Book.find(query).select(selectFields).sort(sort).lean();

    // Tính priceNew
    books = bookHelper.priceNewBooks(books);

    // Tính soldCount từ orders
    const orders = await Order.find({ status: "completed" })
      .select("books")
      .lean();
    const soldCountMap = {};
    orders.forEach((order) => {
      order.books.forEach((book) => {
        const bookId = book.book_id.toString();
        soldCountMap[bookId] = (soldCountMap[bookId] || 0) + book.quantity;
      });
    });

    books = books.map((book) => ({
      ...book,
      soldCount: soldCountMap[book._id.toString()] || 0,
    }));

    // Sắp xếp theo priceNew hoặc soldCount trong JavaScript nếu cần
    if (sortBy && validSortOrders.includes(sortOrder)) {
      if (sortBy === "priceNew") {
        books.sort((a, b) => {
          const valA = a.priceNew || 0;
          const valB = b.priceNew || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
      } else if (sortBy === "soldCount") {
        books.sort((a, b) => {
          const valA = a.soldCount || 0;
          const valB = b.soldCount || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
      }
    }

    // Tính tổng số sách
    const total = books.length;

    res.json({
      code: 200,
      books,
      total,
      category,
    });
  } catch (error) {
    console.error("Error in getCategoryBooks:", error);
    res.status(400).json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

//[GET] /book/detail/:slugBook - Làm trang chi tiết sản phẩm
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugBook,
      status: "active",
    };

    const book = await Book.findOne(find).lean();

    if (!book) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy sách",
      });
    }

    if (book.book_category_id) {
      const category = await Category.findOne({
        _id: book.book_category_id,
        status: "active",
        deleted: false,
      }).lean();

      book.category = category;
    }

    bookHelper.priceNewBook(book);

    await bookHelper.soldCountBook(book);

    res.json({
      code: 200,
      book: book,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message || JSON.stringify(error) || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /book/featured - Lấy ra các sản phẩm nổi bật
module.exports.featured = async (req, res) => {
  try {
    const { rating, sortBy, sortOrder } = req.query;

    // Tạo query tìm sách nổi bật
    const query = {
      feature: "1",
      status: "active",
      deleted: false,
    };

    // Lọc theo rating
    if (rating) {
      const ratingNum = parseInt(rating);
      if (!isNaN(ratingNum)) {
        if (ratingNum === 5) {
          query.rating_mean = 5;
        } else if (ratingNum >= 1 && ratingNum <= 4) {
          query.rating_mean = {
            $gte: ratingNum,
            $lt: ratingNum + 1,
          };
        }
      }
    }

    // Chỉ lấy các trường cần thiết
    const selectFields = {
      _id: 1,
      title: 1,
      thumbnail: 1,
      price: 1,
      discountPercentage: 1,
      rating_mean: 1,
      slug: 1,
    };

    // Sắp xếp trong MongoDB nếu sortBy là rating_mean
    const sort = {};
    const validSortFields = ["rating_mean"];
    const validSortOrders = ["asc", "desc"];
    if (
      sortBy &&
      sortOrder &&
      validSortFields.includes(sortBy) &&
      validSortOrders.includes(sortOrder)
    ) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    // Lấy toàn bộ sách
    let books = await Book.find(query).select(selectFields).sort(sort).lean();

    if (!books || books.length === 0) {
      return res.json({
        code: 200,
        books: [],
        total: 0,
        message: "Không tìm thấy sách nổi bật",
      });
    }

    // Tính priceNew
    books = bookHelper.priceNewBooks(books);

    // Tính soldCount từ orders
    const orders = await Order.find({ status: "completed" })
      .select("books")
      .lean();
    const soldCountMap = {};
    orders.forEach((order) => {
      order.books.forEach((book) => {
        const bookId = book.book_id.toString();
        soldCountMap[bookId] = (soldCountMap[bookId] || 0) + book.quantity;
      });
    });

    books = books.map((book) => ({
      ...book,
      soldCount: soldCountMap[book._id.toString()] || 0,
    }));

    // Sắp xếp theo priceNew, soldCount, hoặc rating_mean trong JavaScript nếu cần
    if (sortBy && validSortOrders.includes(sortOrder)) {
      if (sortBy === "priceNew") {
        books.sort((a, b) => {
          const valA = a.priceNew || 0;
          const valB = b.priceNew || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
      } else if (sortBy === "soldCount") {
        books.sort((a, b) => {
          const valA = a.soldCount || 0;
          const valB = b.soldCount || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
      } else if (sortBy === "rating_mean") {
        books.sort((a, b) => {
          const valA = a.rating_mean || 0;
          const valB = b.rating_mean || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
      }
    }

    // Tính tổng số sách
    const total = books.length;

    res.json({
      code: 200,
      books,
      total,
    });
  } catch (error) {
    console.error("Error in getFeaturedBooks:", error);
    res.status(400).json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};

// [GET] /book/new - Lấy ra các sản phẩm mới nhất
module.exports.new = async (req, res) => {
  try {
    const { rating, sortBy, sortOrder } = req.query;

    // Tạo query tìm sách
    const query = {
      status: "active",
      deleted: false,
    };

    // Lọc theo rating
    if (rating) {
      const ratingNum = parseInt(rating);
      if (!isNaN(ratingNum)) {
        if (ratingNum === 5) {
          query.rating_mean = 5;
        } else if (ratingNum >= 1 && ratingNum <= 4) {
          query.rating_mean = {
            $gte: ratingNum,
            $lt: ratingNum + 1,
          };
        }
      }
    }

    // Chỉ lấy các trường cần thiết
    const selectFields = {
      _id: 1,
      title: 1,
      thumbnail: 1,
      price: 1,
      discountPercentage: 1,
      rating_mean: 1,
      slug: 1,
    };

    // Sắp xếp trong MongoDB nếu sortBy là rating_mean, mặc định sắp xếp theo createdAt giảm dần
    const sort = { createdAt: -1 }; // Mới nhất trước
    const validSortFields = ["rating_mean"];
    const validSortOrders = ["asc", "desc"];
    if (
      sortBy &&
      sortOrder &&
      validSortFields.includes(sortBy) &&
      validSortOrders.includes(sortOrder)
    ) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    // Lấy toàn bộ sách
    let books = await Book.find(query).select(selectFields).sort(sort).lean();

    if (!books || books.length === 0) {
      return res.json({
        code: 200,
        books: [],
        total: 0,
        message: "Không tìm thấy sách mới",
      });
    }

    // Tính priceNew
    books = bookHelper.priceNewBooks(books);

    // Tính soldCount từ orders
    const orders = await Order.find({ status: "completed" })
      .select("books")
      .lean();
    const soldCountMap = {};
    orders.forEach((order) => {
      order.books.forEach((book) => {
        const bookId = book.book_id.toString();
        soldCountMap[bookId] = (soldCountMap[bookId] || 0) + book.quantity;
      });
    });

    books = books.map((book) => ({
      ...book,
      soldCount: soldCountMap[book._id.toString()] || 0,
    }));

    // Sắp xếp theo priceNew, soldCount, hoặc rating_mean trong JavaScript nếu cần
    if (sortBy && validSortOrders.includes(sortOrder)) {
      if (sortBy === "priceNew") {
        books.sort((a, b) => {
          const valA = a.priceNew || 0;
          const valB = b.priceNew || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
      } else if (sortBy === "soldCount") {
        books.sort((a, b) => {
          const valA = a.soldCount || 0;
          const valB = b.soldCount || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
      } else if (sortBy === "rating_mean") {
        books.sort((a, b) => {
          const valA = a.rating_mean || 0;
          const valB = b.rating_mean || 0;
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });
      }
    }

    // Tính tổng số sách
    const total = books.length;

    res.json({
      code: 200,
      books,
      total,
    });
  } catch (error) {
    console.error("Error in getNewBooks:", error);
    res.status(400).json({
      code: 400,
      message: error.message || "Đã xảy ra lỗi",
    });
  }
};
