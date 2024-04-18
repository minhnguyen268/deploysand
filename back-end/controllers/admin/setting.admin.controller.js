"use strict";

const catchAsync = require("../../utils/catch_async");
const _ = require("lodash");
const { OkResponse, CreatedResponse } = require("../../utils/successResponse");

const Setting = require("../../models/Setting");

class SettingAdminController {
  static get = catchAsync(async (req, res, next) => {
    const data = await Setting.findOne({}).lean();

    console.log(data);
    return new OkResponse({
      data,
    }).send(res);
  });

  static update = catchAsync(async (req, res, next) => {
    const { logo, maGioiThieu, noiDungPopup } = req.body;
    await Setting.findOneAndUpdate({}, { logo, maGioiThieu, noiDungPopup }, { upsert: true });

    return new CreatedResponse({
      message: "Cập nhật thành công",
    }).send(res);
  });
}

module.exports = SettingAdminController;
