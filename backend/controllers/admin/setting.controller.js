const Setting = require("../../models/setting.model");

// [GET] /admin/setting/
module.exports.index = async (req, res) => {
  try {
    const setting = await Setting.findOne({});

    res.json({
      code: 200,
      setting: setting,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message,
    });
  }
};

// [PATCH] /admin/setting/general
module.exports.general = async (req, res) => {
  try {
    const setting = await Setting.findOne({});

    if (setting) {
      await Setting.updateOne(
        {
          _id: Setting.id,
        },
        req.body
      );
    } else {
      const record = new Setting(req.body);
      await record.save();
    }

    res.json({
      code: 200,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: error.message,
    });
  }
};
