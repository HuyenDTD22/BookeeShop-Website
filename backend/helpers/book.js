//Tính giá mới cho nhiều sản phẩm
module.exports.priceNewBooks = (books) => {
  const newBooks = books.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });

  return newBooks;
};

//Tính giá mới cho 1 sản phẩm
module.exports.priceNewBook = (book) => {
  book.priceNew = (
    (book.price * (100 - book.discountPercentage)) /
    100
  ).toFixed(0);
};
