import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { Box, Typography } from "@mui/material";

const ItemLichSu = ({ item }) => {
  return (
    <>
      <Box
        sx={{
          padding: "10px",
          borderBottom: "1px solid #e5e5e5",
          display: "flex",
          flexDirection: "column",
          color: "text.primary",
          gap: "10px",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
          }}
        >
          Tiển trước: {convertJSXMoney(item.tienTruoc)}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.3rem",
          }}
        >
          Tiền sau: {convertJSXMoney(item.tienSau)}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.3rem",
          }}
        >
          Thay đổi: {item.tienSau - item.tienTruoc > 0 ? "+" : ""}
          {convertJSXMoney(item.tienSau - item.tienTruoc)}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.3rem",
          }}
        >
          Nội dung: {item.noiDung}
        </Typography>

        <Typography
          sx={{
            fontSize: "1.3rem",
          }}
        >
          Thời gian: {convertDateTime(item.createdAt)}
        </Typography>
      </Box>
    </>
  );
};
export default ItemLichSu;
