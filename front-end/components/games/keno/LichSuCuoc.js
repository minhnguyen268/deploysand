import { USER_BET_GAME_HISTORY_PAGE_SIZE, convertLoaiCuocGame } from "@/configs/game.keno.config";
import SocketContext from "@/context/socket";
import useGetUserBetHistory from "@/hooks/useGetUserBetHistory";
import { convertJSXMoney } from "@/utils/convertMoney";
import { convertDateTime } from "@/utils/convertTime";
import { convertMaMauTinhTrangKetQuaBetGameKeno, convertTinhTrangKetQuaBetGameKeno } from "@/utils/convertTinhTrang";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useContext, useEffect } from "react";
import { Bars } from "react-loading-icons";

const LichSuCuoc = ({ TYPE_GAME }) => {
  const { socket } = useContext(SocketContext);
  const {
    data: listLichSuGame,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetUserBetHistory({ typeGame: TYPE_GAME, pageSize: USER_BET_GAME_HISTORY_PAGE_SIZE });
  const listLichSu = listLichSuGame ?? [];

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
  const theme = useTheme();
  return (
    <>
      {isLoading && (
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Bars fill={theme.palette.color.primary} width={50} height={50} speed={0.75} />
        </Box>
      )}
      {!isLoading && listLichSu && (
        <Box
          sx={{
            padding: { xs: "1rem", md: "2rem" },
            marginTop: "1rem",

            position: "relative",
            display: "flex",
            flexDirection: "column",
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          <div className="tab-content">
            <div className="award_tb">
              <table>
                <thead style={{ textAlign: "center" }}>
                  <tr>
                    <td>Phiên số</td>
                    <td>Nội dung</td>
                    <td>Thời gian</td>
                  </tr>
                </thead>
                <tbody>
                  {listLichSu.map((item, i) => (
                    <tr key={i}>
                      <td>{item.phien.phien}</td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",

                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          component={"div"}
                          sx={{
                            fontSize: "1.2rem",
                          }}
                        >
                          Bi {item.datCuoc[0].loaiBi} - {convertLoaiCuocGame(item.datCuoc[0].chiTietCuoc[0].loaiCuoc)} -{" "}
                          {convertJSXMoney(item.datCuoc[0].chiTietCuoc[0].tienCuoc)} -{" "}
                          <span
                            style={{
                              color: convertMaMauTinhTrangKetQuaBetGameKeno(item.datCuoc[0].trangThai),
                            }}
                          >
                            {convertTinhTrangKetQuaBetGameKeno(item.datCuoc[0].trangThai)}
                          </span>
                        </Typography>
                      </td>
                      <td>{convertDateTime(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
            <Button
              onClick={fetchNextPage}
              sx={{
                pointerEvents: isFetchingNextPage ? "none" : "",
                opacity: isFetchingNextPage ? "0.8" : 1,
              }}
            >
              {isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
            </Button>
          )}
        </Box>
      )}
    </>
  );
};
export default LichSuCuoc;
