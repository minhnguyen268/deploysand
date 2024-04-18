const express = require("express");
const heThongController = require("../controllers/hethong_controller");
const authController = require("../controllers/auth_controller");
const router = express.Router();

router.route("/ngan-hang").get(authController.protect, heThongController.getNganHang);
router.route("/slide").get(heThongController.getSlide);
router.route("/tawk-to").get(authController.protect, heThongController.getConfigTawk);

module.exports = router;
