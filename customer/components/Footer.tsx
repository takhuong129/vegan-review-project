"use client";
import React from "react";
import Link from "next/link";
import ImageLoader from "./ImageLoader";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { vegan, facebookIcon, instagramIcon, youtubeIcon, bctIcon } from "@/container/ImageConstant";


const Footer: React.FC = () => {

  return (
    <footer className="flex  items-center justify-around mx-auto px-24 bg-custom-grey w-full ">
      <div className="flex flex-col items-start justify-center w-full py-12">
        {/*Beginning of logo */}
        <div className="flex items-center justify-center gap-10">
          <ImageLoader
            path={vegan.link}
            alt={vegan.alt}
            height={100}
            width={100}
          />
          <h1 className=" text-2xl font-bold text-custom-green ">Vegan Review</h1>
        </div>
        {/*End of logo */}
        <div className="h-[2px] bg-white w-full rounded-md mt-10"></div>
        {/*Beginning of website info, link and social media */}
        <div className="flex justify-between w-full  mt-10">
          <div className="flex flex-col text-white text-md gap-5">
            <div className="flex items-center gap-2">
              <HiOutlineBuildingOffice2 className="text-2xl text-custom-green" />
              <h3>Công ty cổ phẩn/TNHH [Vegan]</h3>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-xl text-custom-green" />
              <h3>A35 Bạch Đằng, phường 2, quận Tân Bình, Hồ Chí Minh</h3>
            </div>
            <div className="flex items-center gap-2">
              <GoMail className="text-xl text-custom-green" />
              <h3>phamquocviet1211999@gmail.com</h3>
            </div>
            <div className="flex items-center gap-2">
              <IoPhonePortraitOutline className="text-2xl text-custom-green" />
              <h3>0909.959.619</h3>
            </div>
          </div>
          <div className="flex flex-col text-white text-md gap-5">
            <Link href="/" className="hover:underline">Về chúng tôi</Link>
            <Link href="/" className="hover:underline">Trung tâm hỗ trợ</Link>
            <Link href="/" className="hover:underline">Điều Khoản và Chính Sách
              Thông báo Bảo Mật</Link>
          </div>
          <div className="flex items-baseline right-0 gap-4">
            <ImageLoader
              className=" hover:cursor-pointer"
              path={facebookIcon.link}
              alt={facebookIcon.alt}
              height={32}
              width={32}
            />
            <ImageLoader
              className=" hover:cursor-pointer"
              path={instagramIcon.link}
              alt={instagramIcon.alt}
              height={32}
              width={32}
            />
            <ImageLoader
              className=" hover:cursor-pointer"
              path={youtubeIcon.link}
              alt={youtubeIcon.alt}
              height={32}
              width={32}
            />
          </div>
        </div>
        {/*End of website info, link and social media */}
        <div className="h-[2px] bg-white w-full rounded-md mt-10"></div>
        {/*Beginning of certificate  and release */}
        <div className="flex items-center justify-between mt-5 w-full">
          <h3 className="text-white text-sm">© [Vegan] 2024 - 2025 ALL RIGHTS RESERVED</h3>
          <div className="flex gap-5">
            <ImageLoader
              path={bctIcon.link}
              alt={bctIcon.alt}
              height={220}
              width={220}
            />
          </div>
        </div>
        {/*End of certificate  and release */}
      </div>
    </footer>
  );
};

export default Footer;
