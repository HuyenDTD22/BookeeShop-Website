// module.exports.create = (req, res, next) => {
//     req.body.price = parseInt(req.body.price);
//     req.body.discountPercentage = parseInt(req.body.discountPercentage);
//     req.body.stock = parseInt(req.body.stock);

//     if (req.body.position == "") {
//       const countBooks = await Book.countDocuments();
//       req.body.position = countBooks + 1;
//     } else {
//       req.body.position = parseInt(req.body.position);
//     }
//     next();
//   };
