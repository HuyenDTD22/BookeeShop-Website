const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

//[GET] /admin/account
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const accounts = await Account.find(find).select("-password -token");

  for (const account of accounts) {
    const role = await Role.findOne({
      _id: account.role_id,
      deleted: false,
    });
    account.role = role;
  }

  res.json(accounts);
};

//[POST] /admin/account/create - Thêm mới 1 tài khoản
module.exports.create = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại!`,
      });
    } else {
      req.body.password = md5(req.body.password);

      const account = new Account(req.body);

      await account.save();

      res.json({
        code: 200,
        message: "Tạo tài khoản thành công!",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: error,
    });
  }
};

//[PATCH] /admin/account/edit/:id - //Tính năng chỉnh sửa tài khoản
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const emailExist = await Account.findOne({
      _id: { $ne: id }, //Tìm các bản ghi có _id khác id
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      res.json({
        code: 400,
        message: `Email ${req.body.email} đã tồn tại!`,
      });
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }

      await Account.updateOne({ _id: id }, req.body);

      res.json({
        code: 200,
        message: "Cập nhật tài khoản thành công!",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: error,
    });
  }
};
