const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

//[POST] /admin/auth/login - Tính năng đăng nhập
module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      res.json({
        code: 400,
        message: "Email không tồn tại!",
      });
      return;
    }

    if (md5(password) != user.password) {
      res.json({
        code: 400,
        message: "Sai mật khẩu!",
      });
      return;
    }

    if (user.status == "inactive") {
      res.json({
        code: 400,
        message: "tài khoản đã bị khoá!",
      });
      return;
    }

    const token = user.tokenUser;
    res.cookie("token", token);

    res.json({
      code: 200,
      message: "Đăng nhập thành công!",
      token: token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error,
    });
    return;
  }
};

//[GET] /admin/auth/logout - Tính năng đăng xuất
module.exports.logout = (req, res) => {
  res.clearCookie("token"); //Xoá token trong cookie
  res.json({
    code: 200,
    message: "Đăng xuất thành công!",
  });
};
