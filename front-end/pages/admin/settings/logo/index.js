import { useEffect, useState, useRef } from "react";
import { NextSeo } from "next-seo";
import Layout from "@/components/admin/Layout";
import { Button } from "@mui/material";
import SettingService from "@/services/admin/SettingService";
import { toast } from "react-toastify";

const Home = () => {
  const [logo, setLogo] = useState("");
  const [maGioiThieu, setMaGioiThieu] = useState("");
  const [noiDungPopup, setNoiDungPopup] = useState("");

  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  const submit = async () => {
    try {
      await SettingService.update(logo, maGioiThieu, noiDungPopup);
      toast.success("Thay đổi thành công!");
    } catch (error) {
      toast.error("Thay đổi thất bại!");
    }
  };

  const getData = async () => {
    const res = await SettingService.get();
    setLogo(res.data.data?.logo);
    setMaGioiThieu(res.data.data?.maGioiThieu);
    setNoiDungPopup(res.data.data?.noiDungPopup);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@/ckeditor5-34.1.0-8ogafsbogmr7"),
    };
    setEditorLoaded(true);
  }, []);

  if (!editorLoaded) return;

  return (
    <>
      <NextSeo title="Quản lý Logo" />
      <Layout>
        <div style={{ width: "100%" }}>
          <div style={{ color: "#000", fontSize: 30, fontWeight: 600, textAlign: "center", marginBottom: "50px" }}>
            Chỉnh sửa logo, mã giới thiệu, popup thông báo
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginBottom: 50, gap: "10px" }}>
            <div style={{ color: "#000", fontSize: 15, width: "210px" }}>Logo (đường link ảnh)</div>
            <input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              type="text"
              style={{ color: "#000", width: "100%", height: "30px", borderRadius: "3px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginBottom: 50, gap: "10px" }}>
            <div style={{ color: "#000", fontSize: 15, width: "210px" }}>Mã giới thiệu</div>
            <input
              value={maGioiThieu}
              onChange={(e) => setMaGioiThieu(e.target.value)}
              type="text"
              style={{ color: "#000", width: "100%", height: "30px", borderRadius: "3px" }}
            />
          </div>

          <div style={{ width: "100%", color: "black", fontSize: "2rem" }}>
            <div style={{ color: "#000", fontSize: 15, width: "210px", paddingBottom: "10px" }}>
              Nội dung popup thông báo
            </div>
            {editorLoaded && (
              <CKEditor
                editor={ClassicEditor}
                data={noiDungPopup ?? ""}
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setNoiDungPopup(data);
                }}
              />
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: "30px", justifyContent: "center" }}>
            <Button onClick={submit}>Cập nhật</Button>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default Home;

// value={tienCuoc}
// onChange={(e) => setTienCuoc(e.target.value)}
