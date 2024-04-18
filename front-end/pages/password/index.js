import Layout from "@/components/Layout";
import Button from "@/components/button/Button";
import LoadingBox from "@/components/homePage/LoadingBox";
import ErrorMessageLabel from "@/components/input/ErrorMessageLabel";
import OutlinedInput from "@/components/input/OutlinedInput";
import { MIN_LENGTH_PASSWORD } from "@/configs/user.config";
import UserService from "@/services/UserService";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormControl, IconButton, InputAdornment } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";

const ChangePassword = () => {
  const { data: session, status } = useSession();
  const [loginStatus, setLoginStatus] = useState(null);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  // form validation rules
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required("Vui lòng nhập mật khẩu hiện tại")
      .min(MIN_LENGTH_PASSWORD, `Mật khẩu phải từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`)
      .trim("Mật khẩu không hợp lệ")
      .matches(/^\S*$/, "Mật khẩu không hợp lệ")
      .strict(true),
    newPassword: Yup.string()
      .required("Vui lòng nhập mật khẩu mới")
      .min(MIN_LENGTH_PASSWORD, `Mật khẩu phải từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`)
      .trim("Mật khẩu không hợp lệ")
      .matches(/^\S*$/, "Mật khẩu không hợp lệ")
      .strict(true),
    confirmNewPassword: Yup.string()
      .required("Vui lòng nhập nhập lại mật khẩu mới")
      .min(MIN_LENGTH_PASSWORD, `Nhập lại mật khẩu phải từ ${MIN_LENGTH_PASSWORD} kí tự trở lên`)
      .trim("Nhập lại mật khẩu không hợp lệ")
      .matches(/^\S*$/, "Nhập lại mật khẩu không hợp lệ")
      .oneOf([Yup.ref("newPassword"), null], "Mật khẩu mới không khớp với nhau")
      .strict(true),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm(formOptions);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  const onSubmit = async (data) => {
    try {
      setLoginStatus("loading");
      const { currentPassword, newPassword } = data;
      const result = await UserService.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success(result?.data?.message ?? "Đổi mật khẩu thành công");
      setLoginStatus("success");
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(err);
    } finally {
      setLoginStatus(null);
    }
  };

  return (
    <>
      <NextSeo title="Đổi mật khẩu" />
      <LoadingBox isSuccess={loginStatus === "success"} isLoading={loginStatus === "loading"} />
      <Layout>
        <h1 className="title-h1">Đổi mật khẩu</h1>

        <form
          style={{
            paddingTop: "5rem",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "1.5rem",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Controller
              name="currentPassword"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Mật khẩu hiện tại"
                  type={showPassword.currentPassword ? "text" : "password"}
                  size="small"
                  fullWidth
                  error={errors.currentPassword ? true : false}
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() =>
                          setShowPassword((prev) => ({ ...prev, currentPassword: !showPassword.currentPassword }))
                        }
                        edge="end"
                      >
                        {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.currentPassword ? errors.currentPassword.message : ""}</ErrorMessageLabel>
          </FormControl>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Controller
              name="newPassword"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Mật khẩu mới"
                  type={showPassword.newPassword ? "text" : "password"}
                  size="small"
                  fullWidth
                  error={errors.newPassword ? true : false}
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() => setShowPassword((prev) => ({ ...prev, newPassword: !showPassword.newPassword }))}
                        edge="end"
                      >
                        {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.newPassword ? errors.newPassword.message : ""}</ErrorMessageLabel>
          </FormControl>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Controller
              name="confirmNewPassword"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Mật khẩu mới"
                  type={showPassword.confirmNewPassword ? "text" : "password"}
                  size="small"
                  fullWidth
                  error={errors.confirmNewPassword ? true : false}
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() =>
                          setShowPassword((prev) => ({ ...prev, confirmNewPassword: !showPassword.confirmNewPassword }))
                        }
                        edge="end"
                      >
                        {showPassword.confirmNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  inputRef={ref}
                  {...field}
                />
              )}
              defaultValue=""
            />
            <ErrorMessageLabel>{errors.confirmNewPassword ? errors.confirmNewPassword.message : ""}</ErrorMessageLabel>
          </FormControl>

          <Button type="submit" onClick={handleSubmit(onSubmit)} variant="contained">
            Xác nhận
          </Button>
        </form>
      </Layout>
    </>
  );
};

export default ChangePassword;
