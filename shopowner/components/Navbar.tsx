'use client'
import React, { useState } from 'react';
import ImageLoader from './ImageLoader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { vegan } from '@/constant/ImageConstant';
import { IoIosNotificationsOutline } from "react-icons/io";
import Cookies from 'js-cookie';
const Navbar: React.FC = () => {
  const router = useRouter()
  const logout = () => {
    Cookies.remove('token')
    router.push("/login")
  }
  return (
    <div className=" absolute top-0 left-0 right-0 w-full shadow-lg z-50 bg-white">
      <div className=" flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-5">
          <ImageLoader
            path={vegan.link}
            alt={vegan.alt}
            width={52}
            height={52}
          />
          <h1 className="font-semibold text-xl">Kênh Cửa Hàng</h1>
        </div>
        <div className="flex items-center">
          <IoIosNotificationsOutline className="text-3xl" />
          <div className="h-[2rem] w-px bg-gray-400 mx-4"></div>

          <div className="flex items-center dropdown dropdown-bottom dropdown-end dropdown-hover gap-5">
            <h1>cuongpeter</h1>
            <div tabIndex={0} role="button" className="">
              <div className="avatar">
                <div className="w-12 rounded-full hover:ring-primary ring-offset-base-100 ring">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User Avatar" />
                </div>
              </div>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 border shadow-lg">
              <li>
                <Link href="/profile">Tài khoản</Link>
              </li>
              <li>
                <button onClick={logout}>Đăng xuất</button>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Navbar;
