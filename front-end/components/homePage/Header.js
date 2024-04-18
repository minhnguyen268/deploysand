import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AccountBalance from "../user/AccountBalance";
import { useEffect, useState } from "react";
import SettingService from "@/services/admin/SettingService";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { setCloseDialog, setLogo, setNoiDungPopup } from "@/redux/actions/setting";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const { data: session, status } = useSession();
  const { isDialogOpen, logoUrl, noiDungPopup } = useSelector((state) => state.setting);
  const dispatch = useDispatch();

  const getData = async () => {
    const res = await SettingService.get();
    dispatch(setLogo(res.data.data?.logo));
    dispatch(setNoiDungPopup(res.data.data?.noiDungPopup));
  };

  const handleClose = () => {
    dispatch(setCloseDialog());
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {noiDungPopup && (
        <Dialog PaperProps={{ sx: { borderRadius: "10px" } }} open={isDialogOpen} onClose={handleClose}>
          <DialogTitle style={{ color: "white", backgroundColor: "red", textAlign: "center" }}>
            Thông báo hệ thống
          </DialogTitle>
          <DialogContent style={{ width: "100%", maxWidth: "450px" }}>
            <div style={{ fontSize: "13px" }} dangerouslySetInnerHTML={{ __html: noiDungPopup }}></div>
          </DialogContent>
          <DialogActions style={{ display: "flex", justifyContent: "center", paddingBottom: "20px" }}>
            <button
              onClick={handleClose}
              style={{
                color: "white",
                backgroundColor: "red",
                fontSize: "20px",
                borderRadius: "10px",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Đóng
            </button>
          </DialogActions>
        </Dialog>
      )}
      <div className="header" style={{ paddingTop: 10 }}>
        <div className="header-top">
          <Link href="/">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <img
                src={logoUrl}
                alt="logo"
                style={{ height: "50px", borderRadius: 5 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://store-images.s-microsoft.com/image/apps.57673.14334732404981543.8ee705ad-da86-43ad-a676-5167a879f939.e5cafa8c-2a95-4252-a86b-bdaaa051cce8";
                }}
              />
            </Box>
          </Link>
          <Box
            className="header-right"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {status === "unauthenticated" && (
              <>
                <Link href="/login">
                  <Button
                    className="btn-login"
                    sx={{
                      background: "linear-gradient(124.32deg, #ffce1f 12.08%, #ccd26d 85.02%)",
                    }}
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="btn-register"
                    sx={{
                      background: "linear-gradient(124.32deg, #50a1f2 12.08%, #85daff 85.02%)",
                    }}
                  >
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
            {status === "authenticated" && <AccountBalance />}
          </Box>
        </div>
      </div>
    </>
  );
};
export default Header;
