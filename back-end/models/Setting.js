const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      trim: true,
    },
    maGioiThieu: {
      type: String,
      trim: true,
    },
    noiDungPopup: {
      type: String,
      trim: true,
    },
  },
  {
    collection: "Setting",
    timestamps: true,
  }
);

const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
module.exports = Setting;
