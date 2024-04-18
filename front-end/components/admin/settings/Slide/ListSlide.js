import useGetListSlides from "@/hooks/admin/useGetListSlides";
import { convertDateTime } from "@/utils/convertTime";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { useRouter } from "next/router";
import BreadcrumbBar from "../../BreadcrumbBar";
const BreadcrumbData = [
  {
    title: "Admin",
    href: "/admin",
  },
  {
    title: "Quản lý slide",
    href: "/admin/settings/slide",
  },
];
const ListSlide = () => {
  const router = useRouter();

  const { data: dataQuery, isLoading } = useGetListSlides({});
  const GridRowsProp =
    dataQuery?.map((item, i) => ({
      id: item._id,
      action: item._id,
      stt: i + 1,
      hinhAnh: item.hinhAnh,
      createdAt: convertDateTime(item.createdAt),
    })) ?? [];

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    {
      field: "hinhAnh",
      headerName: "Hình ảnh",
      width: 250,
      renderCell: (params) => {
        return (
          <img
            src={params.value}
            style={{
              width: "100px",
              height: "50px",
              objectFit: "cover",
            }}
          />
        );
      },
    },

    { field: "createdAt", headerName: "Thời gian tạo", width: 250 },

    {
      field: "action",
      headerName: "Thao tác",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <IconButton onClick={() => router.push(`/admin/settings/slide/${params.id}`)}>
          <InfoIcon />
        </IconButton>,
      ],
    },
  ];

  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <h1
        className="title admin"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Danh sách slide
      </h1>
      <Link href="/admin/settings/slide/new">
        <Button>Thêm mới</Button>
      </Link>

      <Box
        sx={{
          textAlign: "center",
          color: "text.secondary",
          height: 500,
          width: "100%",
          "& .trangthai_hoantat": {
            color: "#1fc67c",
          },
          "& .trangthai_dangcho": {
            color: "#1a3e72",
          },

          "& .MuiPaper-root ": {
            color: "#000000",
          },
        }}
      >
        <DataGrid
          loading={isLoading}
          rows={GridRowsProp}
          columns={GridColDef}
          componentsProps={{
            panel: {
              sx: {
                "& .MuiTypography-root": {
                  color: "dodgerblue",
                  fontSize: 20,
                },
                "& .MuiDataGrid-filterForm": {
                  bgcolor: "lightblue",
                },
              },
            },
          }}
          sx={{
            color: "#000000",
            "& .MuiDataGrid-paper": {
              color: "#000000",
            },
            "& .MuiToolbar-root": {
              color: "#000000",
            },
            "& .MuiMenuItem-root": {
              color: "#000000",
            },
          }}
        />
      </Box>
    </>
  );
};
export default ListSlide;
