const Book = require("../models/book.model");
const Order = require("../models/order.model");

//Tính giá mới cho nhiều sản phẩm
module.exports.priceNewBooks = (books) => {
  const newBooks = books.map((item) => {
    item.priceNew = Math.round(
      (item.price * (100 - item.discountPercentage)) / 100
    );
    return item;
  });

  return newBooks;
};

//Tính giá mới cho 1 sản phẩm
module.exports.priceNewBook = (book) => {
  book.priceNew = Math.round(
    (book.price * (100 - book.discountPercentage)) / 100
  );
};

// Tính số lượng đã bán
module.exports.soldCountBook = async (book) => {
  const soldCount = await Order.aggregate([
    { $unwind: "$books" },
    {
      $match: {
        "books.book_id": book._id,
        status: "completed",
      },
    },
    { $group: { _id: null, totalSold: { $sum: "$books.quantity" } } },
  ]);

  // Nếu có đơn hàng đã hoàn tất hoặc đã giao, lấy số lượng đã bán
  book.soldCount = soldCount.length > 0 ? soldCount[0].totalSold : 0;
};

// Tính số lượng đã bán
module.exports.soldCountBooks = async (books) => {
  const newBooks = await Promise.all(
    books.map(async (item) => {
      const soldCount = await Order.aggregate([
        { $unwind: "$books" },
        {
          $match: {
            "books.book_id": item._id,
            status: "completed",
          },
        },
        { $group: { _id: null, totalSold: { $sum: "$books.quantity" } } },
      ]);

      // Nếu có đơn hàng đã hoàn tất hoặc đã giao, lấy số lượng đã bán
      item.soldCount = soldCount.length > 0 ? soldCount[0].totalSold : 0;
      return item;
    })
  );

  return newBooks;
};
