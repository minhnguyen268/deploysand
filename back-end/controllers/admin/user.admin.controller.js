"use strict";
const { BadRequestError, UnauthorizedError } = require("../../utils/app_error");
const NguoiDung = require("../../models/NguoiDung");
const LienKetNganHang = require("../../models/LienKetNganHang");

const BienDongSoDu = require("../../models/BienDongSoDu");
const bcrypt = require("bcryptjs");
const catchAsync = require("../../utils/catch_async");
const _ = require("lodash");
const { OkResponse } = require("../../utils/successResponse");
const { default: mongoose } = require("mongoose");
const { MIN_LENGTH_PASSWORD, USER_ROLE } = require("../../configs/user.config");
const UserSocketService = require("../../services/user.socket.service");
const BienDongSoDuServiceFactory = require("../../services/biendongsodu.service");
const { TYPE_BALANCE_FLUCTUATION } = require("../../configs/balance.fluctuation.config");
const { LOAI_DEPOSIT } = require("../../configs/deposit.config");

class UserAdminController {
  static getDanhSachNganHangUser = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const results = await LienKetNganHang.find({ nguoiDung: userId }).select("-__v").sort("-_id").lean();

    return new OkResponse({
      data: results,
    }).send(res);
  });
  static getChiTietUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const result = await NguoiDung.findOne({ _id: id }).select("-__v -matKhau -refreshToken -refreshTokenUsed").lean();
    return new OkResponse({
      data: result,
    }).send(res);
  });
  static updateMoneyUser = catchAsync(async (req, res, next) => {
    const { userId, moneyUpdate } = req.body;

    console.log({ userId, moneyUpdate });

    if (!userId || !moneyUpdate || !_.isNumber(moneyUpdate)) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ và hợp lệ thông tin");
    }

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      try {
        const findUser = await NguoiDung.findByIdAndUpdate(userId, { $inc: { money: moneyUpdate } }, { new: true }).session(session);

        if (!findUser) {
          throw new BadRequestError("Không tìm thấy tài khoản");
        }

        if (findUser.money < 0) {
          throw new BadRequestError("Số dư không thể âm");
        }

        await BienDongSoDuServiceFactory.createBienDong({
          type: TYPE_BALANCE_FLUCTUATION.DEPOSIT,
          payload: {
            nguoiDung: userId,
            tienTruoc: findUser.money - moneyUpdate,
            tienSau: findUser.money,
            noiDung: moneyUpdate > 0 ? `Nhận tiền từ admin` : `Trừ tiền từ admin`,
            loaiDeposit: moneyUpdate > 0 ? LOAI_DEPOSIT.NHAN_TIEN : LOAI_DEPOSIT.TRU_TIEN,
          },
          options: {
            session,
          },
        });

        console.log("after createBienDong");

        UserSocketService.updateUserBalance({
          user: findUser.taiKhoan,
          updateBalance: moneyUpdate,
        });

        await session.commitTransaction();
      } catch (err) {
        console.error(err);
        await session.abortTransaction();
        throw err; // Re-throw the error to be caught by the catchAsync middleware
      } finally {
        await session.endSession();
      }
    });

    new OkResponse({
      message: "Update tiền thành công",
      metadata: {
        userId,
        moneyUpdate,
      },
    }).send(res);
  });
  static updatePasswordUser = catchAsync(async (req, res, next) => {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    if (newPassword.trim().length < MIN_LENGTH_PASSWORD) {
      throw new UnauthorizedError(`Mật khẩu phải từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`);
    }
    const hashPassword = await bcrypt.hash(newPassword, 12);
    const updateUser = await NguoiDung.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        matKhau: hashPassword,
      },
      { new: false }
    );
    if (!updateUser) {
      throw new BadRequestError("Không tìm thấy tài khoản");
    }

    // Xóa refresh token để logout
    await NguoiDung.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        refreshToken: [],
      }
    );

    global._io.to(`${updateUser.taiKhoan}`).emit("sign-out");

    return new OkResponse({
      message: "Update mật khẩu thành công",
      metadata: {
        userId,
        newPassword,
      },
    }).send(res);
  });
  static updatePasswordWithdrawUser = catchAsync(async (req, res, next) => {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    if (newPassword.trim().length < MIN_LENGTH_PASSWORD) {
      throw new UnauthorizedError(`Mật khẩu rút tiền phải từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`);
    }
    const hashPassword = await bcrypt.hash(newPassword, 12);
    const updateUser = await NguoiDung.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        matKhauRutTien: hashPassword,
      },
      { new: false }
    );
    if (!updateUser) {
      throw new BadRequestError("Không tìm thấy tài khoản");
    }

    return new OkResponse({
      message: "Update mật khẩu rút tiền thành công",
      metadata: {
        userId,
        newPassword,
      },
    }).send(res);
  });
  static updateInformationUser = catchAsync(async (req, res, next) => {
    const { userId, role, money, soDienThoai, taiKhoan, status = false } = req.body;
    if (!userId || !role) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    if (!Object.values(USER_ROLE).includes(role)) {
      throw new UnauthorizedError("Vui lòng nhập đầy đủ thông tin");
    }
    const findUser = await NguoiDung.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        status,
        role,
        money,
        soDienThoai,
        taiKhoan,
      },
      { new: false }
    );
    if (!findUser) {
      throw new BadRequestError("Không tìm thấy tài khoản");
    }
    if (findUser.status !== status || findUser.role !== role) {
      // Xóa refresh token để logout
      await NguoiDung.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          refreshToken: [],
        }
      );
      global._io.to(`${findUser.taiKhoan}`).emit("sign-out");
    }

    return new OkResponse({
      message: "Update thông tin thành công",
      metadata: {
        userId,
        role,
        status,
      },
    }).send(res);
  });
  static countAllUser = catchAsync(async (req, res, next) => {
    const countList = await NguoiDung.countDocuments({});
    return new OkResponse({
      data: countList,
    }).send(res);
  });

  static countAllBienDongSoDu = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const countList = await BienDongSoDu.countDocuments({
      nguoiDung: userId,
    });
    return new OkResponse({
      data: countList,
    }).send(res);
  });
  static getBienDongSoDuUser = catchAsync(async (req, res, next) => {
    const { userId } = req.query;
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    const list = await BienDongSoDu.find({ nguoiDung: userId }).select("-__v").skip(skip).limit(results).sort(sortValue).lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
      },
    }).send(res);
  });

  static getDanhSachUsers = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const results = req.query.results * 1 || 10;
    const skip = (page - 1) * results;
    const searchQuery = req.query?.query ?? "";
    let sortValue = ["-createdAt"];
    sortValue = sortValue.join(" ");
    let query = {};
    if (searchQuery) {
      query = {
        taiKhoan: {
          $eq: searchQuery,
        },
      };
    }

    const list = await NguoiDung.find(query).select("-__v").skip(skip).limit(results).sort(sortValue).lean();
    return new OkResponse({
      data: list,
      metadata: {
        results: list.length,
        page,
        limitItems: results,
        sort: sortValue,
        searchQuery,
      },
    }).send(res);
  });

  static delete = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await NguoiDung.findByIdAndDelete(id);
    return new OkResponse({
      message: "Xóa tài khoản thành công",
    }).send(res);
  });
}

module.exports = UserAdminController;
