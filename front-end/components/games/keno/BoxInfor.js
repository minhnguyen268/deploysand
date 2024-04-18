import { convertJSXTinhTrangGameKeno } from "@/utils/convertTinhTrang";
import { Box, Button, Typography } from "@mui/material";
import { memo, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import HuongDan from "./HuongDan";

const BoxInfor = ({ phien, countdownTime, tinhTrang }) => {
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <HuongDan isModal={isModal} setIsModal={setIsModal} />
      <Box
        sx={{
          display: "flex",

          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
          gap: "10px",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            borderRight: { md: "1px solid #eee" },

            padding: "0px 20px",
          }}
        >
          <Typography
            sx={{
              color: "#b7b7b7",
              fontSize: "1.8rem",
            }}
          >
            Phiên số
          </Typography>
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
            }}
          >
            {phien}
          </Typography>
          <Button
            sx={{
              background: "#fff !important",
              border: "0.1rem solid #13a2ba",
              color: "#0d8ea7",
            }}
            onClick={() => setIsModal(true)}
          >
            Hướng dẫn cách chơi
          </Button>
        </Box>
        <Box
          sx={{
            textAlign: "center",

            padding: "0px 20px",
          }}
        >
          <Typography
            sx={{
              color: "#b7b7b7",
              fontSize: "1.8rem",
            }}
          >
            Thời gian còn lại
          </Typography>

          <CountdownTimer countdownTime={countdownTime} />
          <div
            style={{
              paddingTop: "0.5rem",
            }}
          ></div>
          {convertJSXTinhTrangGameKeno(tinhTrang)}
        </Box>
      </Box>
    </>
  );
};
export default memo(BoxInfor);
