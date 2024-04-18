import useGetListSlides from "@/hooks/useGetListSlides";
import { Autoplay } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

const HomeSlide = () => {
  const { data, isLoading } = useGetListSlides();
  return (
    <>
      <Swiper
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        style={{
          borderRadius: "10px",
        }}
      >
        {data?.map((item, i) => (
          <SwiperSlide key={i}>
            <img
              src={item.hinhAnh}
              alt={""}
              style={{
                width: "100%",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
export default HomeSlide;
