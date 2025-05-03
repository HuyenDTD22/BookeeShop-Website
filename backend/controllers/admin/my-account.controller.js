// const md5 = require("md5");
// const Account = require("../../models/account.model");

// // [PATCH] /admin/my-account/edit
// module.exports.edit = async (req, res) => {
//   try {
//     const id = res.locals.user.id;

//     const emailExist = await Account.findOne({
//       _id: { $ne: id },
//       email: req.body.email,
//       deleted: false,
//     });

//     if (emailExist) {
//       res.json({
//         code: 400,
//         message: `Email ${req.body.email} đã tồn tại`,
//       });
//     } else {
//       if (req.body.password) {
//         req.body.password = md5(req.body.password);
//       } else {
//         delete req.body.password;
//       }

//       await Account.updateOne({ _id: id }, req.body);

//       res.json({
//         code: 200,
//         message: "Cập nhật tài khoản thành công!",
//       });
//     }
//   } catch (error) {
//     res.json({
//       code: 400,
//       message: error,
//     });
//   }
// };
