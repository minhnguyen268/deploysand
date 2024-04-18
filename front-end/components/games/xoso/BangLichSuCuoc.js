import { convertLoaiGame } from "@/configs/game.config";
import { USER_BET_GAME_HISTORY_PAGE_SIZE, convertLoaiCuoc } from "@/configs/game.xoso.config";
import SocketContext from "@/context/socket";
import useGetUserBetHistory from "@/hooks/useGetUserBetHistory";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { convertJSXTinhTrangBetGameXoSo } from "@/utils/convertTinhTrang";
import { Box, Button, Typography, useTheme } from "@mui/material";
import _ from "lodash";
import { memo, useContext, useEffect } from "react";
import { Bars } from "react-loading-icons";
import Modal from "../../homePage/Modal";
const BangKetQua = ({ TYPE_GAME, isModal, setIsModal }) => {
  const {
    data: listLichSuGame,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetUserBetHistory({ typeGame: TYPE_GAME, pageSize: USER_BET_GAME_HISTORY_PAGE_SIZE });
  const listLichSu = listLichSuGame ?? [];

  const { socket } = useContext(SocketContext);
  useEffect(() => {
    if (socket) {
      socket.emit(`${TYPE_GAME}:join-room`);
      socket.on(`${TYPE_GAME}:update-lich-su-cuoc-ca-nhan`, (data) => {
        refetch();
      });
      return () => {
        socket.off(`${TYPE_GAME}:update-lich-su-cuoc-ca-nhan`);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (isModal) {
      refetch();
    }
  }, [isModal]);

  const theme = useTheme();

  return (
    <>
      <Modal isModal={isModal} setIsModal={setIsModal} title={"Lịch sử tham gia"}>
        {listLichSu.map((item) => (
          <Box
            key={item._id}
            sx={{
              padding: "10px",
              borderBottom: "1px solid #e5e5e5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {convertLoaiGame(TYPE_GAME)}
                </Typography>

                {convertJSXTinhTrangBetGameXoSo(item.datCuoc[0].trangThai)}
              </Box>

              <Typography
                sx={{
                  color: "#b7b7b7",
                  fontSize: "1.2rem",
                }}
              >
                Phiên cược: {item.phien.phien}
              </Typography>
              <Box
                sx={{
                  color: "#b7b7b7",
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                  }}
                  component={"div"}
                >
                  {convertLoaiCuoc(item.datCuoc[0].loaiCuoc)}: Chọn số{" "}
                  {item.datCuoc[0].chiTietCuoc.map(({ so }) => (
                    <Typography
                      key={_.uniqueId()}
                      sx={{
                        fontSize: "1.2rem",
                      }}
                      component={"span"}
                    >
                      {so}{" "}
                    </Typography>
                  ))}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                alignItems: "flex-end",
              }}
            >
              <Typography>{convertJSXMoney(item.datCuoc[0].tongTienCuoc)}</Typography>

              <Typography
                sx={{
                  color: "#b7b7b7",
                  fontSize: "1.2rem",
                }}
              >
                {convertDateTime(item.createdAt)}
              </Typography>
            </Box>
          </Box>
        ))}

        {isFetchingNextPage && (
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Bars fill={theme.palette.color.primary} width={50} height={50} speed={0.75} />
          </Box>
        )}
        {hasNextPage && (
          <Box
            sx={{
              paddingTop: "1rem",
              textAlign: "center",
            }}
          >
            <Button
              onClick={fetchNextPage}
              sx={{
                pointerEvents: isFetchingNextPage ? "none" : "",
                opacity: isFetchingNextPage ? "0.8" : 1,
              }}
            >
              {isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
            </Button>
          </Box>
        )}
      </Modal>
    </>
  );
};
export default memo(BangKetQua);
