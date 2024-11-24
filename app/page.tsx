"use client";
import React from "react";
import Link from "next/link";
import { CategorySlider, BannerSlider } from "@/components";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { HiOutlineLightBulb } from "react-icons/hi";
import { PiShootingStar } from "react-icons/pi";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { ImageLoader } from "@/components";
import { searchBanner, reviewBanner, promptBanner, promptStoreBanner, googlePlay, appStore, appGallery, qrCode, appPhone } from "@/container/ImageConstant";
import StoreSlider from "@/components/StoreSlider";


const Page: React.FC = () => {

  return (
    <div className=" overflow-hidden pt-0">
      <header className="relative flex items-center justify-center w-full h-[36rem]">
        <BannerSlider />
        <div className="absolute inset-0 w-full h-full bg-black bg-opacity-50 "></div>
        <div className="absolute bottom-0 left-0 flex flex-col items-start justify-start w-full p-24">
          <h1 className="text-white text-3xl font-bold w-[32rem]">
            Khám Phá Ẩm Thực Chay
          </h1>
          <p className="text-white text-lg w-[32rem] my-6">
            Nạp đầy năng lượng và nâng cao sức khỏe mỗi ngày với thực phẩm chay
            tự nhiên, tận hưởng hương vị tươi ngon và lợi ích bền vững từ thiên
            nhiên.
          </p>
          <div className="mt-6">
            <button className="btn btn-wide bg-white rounded-md  font-bold">
              Khám Phá Ngay!
            </button>
          </div>
        </div>
      </header>
      <div>
        {/*Beginning of the round img introduction */}
        <div className="flex items-center justify-center gap-4 mt-10 space-x-32">
          <div className="avatar flex flex-col items-center text-center">
            <div className="w-48 rounded-full overflow-hidden">
              <ImageLoader
                path={searchBanner.link}
                alt={searchBanner.link}
                width={300}  // Adjust width and height to be the same
                height={300} // for a perfect circle
                cloudinaryAttributes={{
                  crop: "fill",   // Ensure the image fills the container
                  gravity: "auto", // Adjust gravity as needed
                  radius: "max",  // Apply rounded corners
                }}
                className="object-cover w-full h-full"
              />
            </div>
            <h6 className="mt-2 font-medium text-2xl  text-green-600">
              Tìm Kiếm
            </h6>
            <p className="mt-1  w-[15rem] text-lg">
              Đa dạng lựa chọn trong vài nút bấm
            </p>
          </div>
          <div className="avatar flex flex-col items-center text-center">
            <div className="w-48 rounded-full overflow-hidden">
              <ImageLoader
                path={reviewBanner.link}
                alt={reviewBanner.link}
                width={300}  // Adjust width and height to be the same
                height={300} // for a perfect circle
                cloudinaryAttributes={{
                  crop: "fill",   // Ensure the image fills the container
                  gravity: "auto", // Adjust gravity as needed
                  radius: "max",  // Apply rounded corners
                }}
                className="object-cover w-full h-full"
              />
            </div>
            <h6 className="mt-2 font-medium text-2xl  text-green-600">
              Review
            </h6>
            <p className="mt-1 w-[15rem] text-lg">
              Tham khảo, và trực tiếp đánh giá cửa hàng
            </p>
          </div>
          <div className="avatar flex flex-col items-center text-center">
            <div className="w-48 rounded-full overflow-hidden">
              <ImageLoader
                path={promptBanner.link}
                alt={promptBanner.link}
                width={300}  // Adjust width and height to be the same
                height={300} // for a perfect circle
                cloudinaryAttributes={{
                  crop: "fill",   // Ensure the image fills the container
                  gravity: "auto", // Adjust gravity as needed
                  radius: "max",  // Apply rounded corners
                }}
                className="object-cover w-full h-full"
              />
            </div>
            <h6 className="mt-2 font-medium text-2xl text-green-600">
              Quảng Bá
            </h6>
            <p className="mt-1 w-[15rem] text-lg">
              Quảng bá cửa hàng của bạn đến với mọi người
            </p>
          </div>
        </div>
        {/*End of the round img introduction*/}
        {/*Beginning of website statistics */}
        <div className="flex items-center justify-between w-[calc(100%+2rem)] -mx-4 bg-custom-green h-32 p-32 mt-10">
          <div className="flex flex-col">
            <h1 className=" text-4xl text-white font-bold">1000+</h1>
            <p className="text-lg text-white mt-4 w-64">
              Cửa hàng/quán ăn được đăng ký trên toàn quốc
            </p>
          </div>
          <div className="flex flex-col">
            <h1 className=" text-4xl text-white font-bold">2000+</h1>
            <p className="text-lg text-white mt-4 w-72">
              Người dùng mới tham gia đánh giá mỗi tháng
            </p>
          </div>
          <div className="flex flex-col">
            <h1 className=" text-4xl text-white font-bold">15,000+</h1>
            <p className="text-lg text-white mt-4 w-72">
              Các lượt đánh giá và bình luận hằng ngày
            </p>
          </div>
          <div className="flex flex-col">
            <h1 className=" text-4xl text-white font-bold">53+</h1>
            <p className="text-lg text-white mt-4 w-72">
              Các tỉnh thành có sự hiện diện của dịch vụ Vegan
            </p>
          </div>
        </div>
        {/*End of website statistics */}
        {/*Beginning of the category */}
        <div className="flex flex-col items-center w-full justify-between mt-10 px-24">
          <div className="mt-5 mb-14">
            <h1 className="text-4xl font-bold"> Danh Mục</h1>
          </div>
          <CategorySlider />
        </div>
        {/*End of the category */}
        {/*Beginning of the trending store */}
        <div className="flex flex-col items-center w-full justify-between mt-10 px-24">
          <div className="mt-5 mb-14">
            <h1 className="text-4xl font-bold"> Đang Thịnh Hành</h1>
          </div>
          <StoreSlider />
          <div>
            <Link href="/store">
              <button className="btn btn-wide bg-custom-grey text-white hover:bg-gray-700 mt-10">Xem thêm</button>
            </Link>
          </div>
        </div>
        {/*End of the trending store */}
        {/*Beginning of the nearby store */}
        <div className="flex flex-col items-center w-full justify-between mt-10 px-24">
          <div className="mt-5 mb-14">
            <h1 className="text-4xl font-bold"> Gần Đây</h1>
          </div>
          <StoreSlider />
          <div>
            <div>
              <Link href="/store">
                <button className="btn btn-wide bg-custom-grey text-white hover:bg-gray-700 mt-10">Xem thêm</button>
              </Link>
            </div>
          </div>
        </div>
        {/*End of the nearby store */}
        {/*Beginning of the store creation */}
        <div className="flex items-center w-full justify-between mt-10 px-24">
          <div className="flex items-center justify-center">
            <ImageLoader
              path={promptStoreBanner.link}
              alt={promptStoreBanner.alt}
              width={800}
              height={800}
              className=" object-fill rounded-xl"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="grid grid-cols-2 grid-rows-4  w-full gap-4 ">
              <div className="col-span-2 flex items-center justify-center">
                <h1 className="text-center text-3xl font-bold">Quảng bá thương hiệu của bạn</h1>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <HiOutlineClipboardDocumentList className="text-4xl text-black  hover:text-white hover:bg-custom-green  duration-100 rounded-md" />

                <h4 className="text-xl">Đăng ký đơn giản và dễ dàng</h4>
                <p className="w-42">Chúng tôi sẽ liên lạc để hỗ trợ sau khi bạn điền thông tin</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <HiOutlineLightBulb className="text-4xl text-black  hover:text-white hover:bg-custom-green  duration-100 rounded-md" />

                <h4 className="text-xl">Thỏa sức sáng tạo</h4>
                <p className="w-42">Điền thông tin và tùy chỉnh dịch vụ theo ý bạn</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <PiShootingStar className="text-4xl text-black  hover:text-white hover:bg-custom-green  duration-100 rounded-md" />
                <h4 className="text-xl">Gia tăng nhận thức</h4>
                <p className="w-42">Được nhiều người biết đến và quan tâm</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <RiVerifiedBadgeLine className="text-4xl text-black  hover:text-white hover:bg-custom-green  duration-100 rounded-md" />
                <h4 className="text-xl">Xác minh thương hiệu</h4>
                <p className="w-42">Xác thực tính chính chủ thông qua vài yêu cầu cần thiết</p>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <button className="btn btn-neutral px-10 bg-custom-grey text-white border-none">Đăng ký ngay</button>
              </div>
            </div>
          </div>
        </div>
        {/*End of the store creation */}
      </div>
      {/*Beginning of the mobile app*/}
      <div className="relative flex items-center justify-around w-full h-[28rem] bg-custom-green-light mt-10 ">
        <div className="absolute flex flex-col items-start justify-center w-full p-24 h-full">
          <h1 className="text-4xl font-bold w-[32rem]">
            Khám phá và đánh giá theo phong cách của bạn, mọi lúc, mọi nơi.
          </h1>
          <p className="text-xl font-medium my-6">
            Tải ứng dụng ngay để tối ưu trải nghiệm
          </p>
          <div className="flex gap-8">
            <div>
              <ImageLoader path={qrCode.link} alt={qrCode.alt} width={150} height={150} />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <ImageLoader
                path={googlePlay.link}
                alt={googlePlay.alt}
                width={150}
                height={150}
              />
              <ImageLoader
                path={appStore.link}
                alt={appStore.alt}
                width={150}
                height={150}
              />
              <ImageLoader
                path={appGallery.link}
                alt={appGallery.alt}
                width={150}
                height={150}
              />
            </div>
          </div>
        </div>
        <div className="absolute flex right-0 p-24">
          <ImageLoader path={appPhone.link} alt={appPhone.alt} width={450} height={450} />
        </div>
      </div>
      {/*End of the mobile app */}
    </div>
  );
}

export default Page;
