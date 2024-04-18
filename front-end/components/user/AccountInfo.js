import Avatar from "@/public/assets/images/avatar.png";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import Money from "./Money";

const TitleLeft = styled(Box)(({ theme }) => ({
  backgroundColor: "#dbb579",
  height: "2.3rem",
  position: "absolute",
  top: "-12px",
  transform: "translate(-50%)",
  clipPath: "polygon(50% 0,100% 0,50% 50%,100% 100%,50% 100%,0 50%)",
  left: "calc(50% - 50px)",
  width: "1rem",
}));
const TitleCenter = styled(TitleLeft)(({ theme }) => ({
  backgroundColor: "#dbb579",
  clipPath: "polygon(7% 0,93% 0,100% 50%,93% 100%,7% 100%,0 50%)",
  width: "unset",
  fontSize: "1.5rem",
  left: "50%",
  textAlign: "center",
  padding: "0 10px",
}));
const TitleRight = styled(TitleLeft)(({ theme }) => ({
  clipPath: "polygon(50% 0,100% 0,50% 50%,100% 100%,50% 100%,0 50%)",

  left: "calc(50% + 50px)",
  transform: "translate(-50%) rotate(180deg)",

  textAlign: "center",
}));

const TransactionBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "-3.5rem",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",

  background: "linear-gradient(180deg,#efdaaf,#dbb579)",

  padding: "1rem",
  borderRadius: "1rem",
  fontSize: "1.5rem",

  "& .item": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 1.5rem",
    gap: "1rem",
    "&:first-of-type": {
      borderRight: "1px solid",
    },
    "& p": {
      textWrap: "nowrap",
    },
  },
}));

const SplitBorder = styled(Box)(({ theme }) => ({
  left: "50%",

  position: "absolute",
  textAlign: "center",
  top: 0,
  transform: "translate(-50%)",
  width: "100%",
  "& span": {
    display: "inline-block",
    position: "relative",
    top: "1rem",
    width: "2.4rem",
  },
}));

const BorderTopStyle = styled(Box)(({ theme }) => ({
  left: "50%",

  position: "absolute",
  top: 0,
  textAlign: "center",
  transform: "translate(-50%)",
  width: "100%",
  "& span": {
    position: "absolute",
    top: 0,
    "&:first-of-type": {
      borderLeft: `3px solid #dbb579`,
      borderTop: `3px solid #dbb579`,
      borderTopLeftRadius: "16px",
      height: "3rem",
      left: "0",
      width: "3rem",
      "&:after": {
        backgroundColor: "#dbb579",
        borderRadius: "50%",
        content: `""`,
        height: "0.5rem",
        left: "1rem",
        position: "absolute",
        top: "1rem",
        width: "0.5rem",
      },
    },
    "&:last-of-type": {
      borderRight: `3px solid #dbb579`,
      borderTop: `3px solid #dbb579`,
      borderTopRightRadius: "16px",
      height: "3rem",
      right: "0",
      width: "3rem",
      "&:after": {
        backgroundColor: "#dbb579",
        borderRadius: "50%",
        content: `""`,
        height: "0.5rem",
        right: "1rem",
        position: "absolute",
        top: "1rem",
        width: "0.5rem",
      },
    },
  },
}));
const AccountInfo = ({ user }) => {
  return (
    <>
      <Box
        sx={{
          borderRadius: "2rem",
          backgroundColor: "#0c192c",
          border: (theme) => `2px solid #dbb579`,
          position: "relative",
          height: "30rem",
          marginTop: "3rem",
        }}
      >
        <SplitBorder>
          <span></span>
        </SplitBorder>
        <BorderTopStyle>
          <span></span>
          <span></span>
        </BorderTopStyle>
        <TitleLeft />
        <TitleCenter>Thành viên</TitleCenter>
        <TitleRight />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "30px",
            color: (theme) => theme.palette.color.secondary,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                "& img": {
                  borderRadius: "50%",
                  objectFit: "cover",
                },
              }}
            >
              <Image
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src={Avatar}
                width={80}
                height={80}
                alt={user.taiKhoan}
              />
            </Box>
            <Typography sx={{ color: (theme) => theme.palette.text.primary }}>{user.taiKhoan}</Typography>
            <Typography
              sx={{
                fontSize: "3rem",
                color: (theme) => theme.palette.text.primary,
              }}
            >
              <small
                style={{
                  color: "#007bff",
                }}
              >
                $
              </small>{" "}
              <Money />
            </Typography>
          </Box>
        </Box>
        <TransactionBox>
          <Link href="/deposit">
            <Box
              className="item"
              sx={{
                cursor: "pointer",
              }}
            >
              <AddCardOutlinedIcon />
              <Typography>Nạp tiền</Typography>
            </Box>
          </Link>
          <Link href="/withdraw">
            <Box
              sx={{
                cursor: "pointer",
              }}
              className="item"
            >
              <PriceChangeOutlinedIcon />
              <Typography>Rút tiền</Typography>
            </Box>
          </Link>
        </TransactionBox>
      </Box>
    </>
  );
};
export default AccountInfo;
