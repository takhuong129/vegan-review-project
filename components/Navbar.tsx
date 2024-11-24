'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import { PopupSearchBar } from "./PopupSearchBar";
import { IoSearchOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import ImageLoader from "./ImageLoader";
import { vegan } from "@/container/ImageConstant";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


const Navbar: React.FC = () => {
  const router = useRouter();
  // Get URL
  const pathname = usePathname();
  // State to manage navbar position
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState()
  const [user, setUser] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    changeAuth()
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [Cookies.get('token')]);
  const handleLogout = () => {
    Cookies.remove('token')
    setUser(false)
    router.push('/login');
  };
  const changeAuth = () => {
    const token = Cookies.get('token')
    console.log(token)
    setUser(!!token); // Set user to true if token exists, false otherwise
  }

  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(false);

  // Toggle function to show or hide the search bar
  const toggleSearchBar = (): void => {
    setIsSearchBarVisible(prevState => !prevState);
  };
  // Active link when it's clicked or hover
  const linkClasses = (path: string): string =>
    `hover:text-green-500 ${pathname === path ? "font-medium text-green-500 custom-underline" : ""}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 shadow-md bg-white transition-all duration-300 ${isScrolled ? "shadow-md h-16" : "h-24"
        }`}
    >
      <div className="flex h-full items-center justify-between mx-auto px-24">
        <div className="flex items-center gap-2">
          <ImageLoader
            path={vegan.link}
            alt={vegan.alt}
            width={256}
            height={256}
            className="h-14 w-14"
          />
          <h1 className="font-bold text-green-600 text-lg">Vegan Review</h1>
          <FilterDropdown />
          <nav className="mx-auto hidden gap-8 text-md font-normal ml-6 md:flex">
            <Link href="/" className={linkClasses("/")} prefetch={false}>
              Trang chủ
            </Link>
            <Link href="/store" className={linkClasses("#")} prefetch={false}>
              Quán ăn
            </Link>
            <Link href="/store" className={linkClasses("#")} prefetch={false}>
              Cửa hàng
            </Link>
            <Link href="/store" className={linkClasses("#")} prefetch={false}>
              Siêu thị chay
            </Link>
            <Link href="/store" className={linkClasses("#")} prefetch={false}>
              Đồ dùng chay
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-8">
          <IoSearchOutline className="hover:cursor-pointer" onClick={toggleSearchBar} size={30} />
          <div className="flex gap-3">
            {user ? (
              <>
                <div className="dropdown dropdown-bottom dropdown-end dropdown-hover">
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
                      <button onClick={handleLogout} >Đăng xuất</button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="btn bg-custom-green text-md text-white hover:bg-green-800">
                    Đăng Nhập
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="btn btn-outline text-md text-custom-green border border-custom-green hover:bg-green-800 px-6">
                    Đăng Ký
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
        {isSearchBarVisible && <PopupSearchBar onClose={toggleSearchBar} />}
      </div>
    </header>
  );
};

export default Navbar;
