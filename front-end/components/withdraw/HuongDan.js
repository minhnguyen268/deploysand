import { MIN_MONEY_WITHDRAW } from "@/configs/withdraw.config";
import { convertJSXMoney } from "@/utils/convertMoney";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

const HuongDan = () => {
  return (
    <>
      <Box
        className="huongdan"
        sx={{
          padding: "10px",
          boxShadow: "0 5px 5px #c5c5da40",
          marginTop: "20px",
          borderRadius: "15px",
          background: "linear-gradient(124.32deg,#102d47 12.08%,#12304d 85.02%)",

          color: "text.primary",
        }}
      >
        <h2 className="title">Hướng dẫn rút tiền</h2>
        <Typography component="ul">
          <li>
            Nếu chưa có mật khẩu rút tiền, thì click <Link href="/password-withdraw">tại đây</Link> để tiến hành cài đặt
            mật khẩu
          </li>
          <li>Nhập số tiền và chọn ngân hàng muốn rút.</li>
          <li>Số tiền rút tối thiểu {convertJSXMoney(MIN_MONEY_WITHDRAW)}.</li>
          <li>Tiền sẽ tự động vào tài khoản trong vòng 1 phút, nếu thấy lâu có thể liên hệ bộ phận hỗ trợ.</li>
        </Typography>
      </Box>
    </>
  );
};
export default HuongDan;
