"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const pathname = usePathname();

    const links = [
        { href: "/overview", label: "Tổng quan" },
        { href: "/display-store", label: "Hiển thị cửa hàng" },
        { href: "/custom-store", label: "Chỉnh sửa cửa hàng" },
        { href: "/product-management", label: "Quản lý sản phẩm" },
        { href: "/add-new-product", label: "Thêm sản phẩm" },
        { href: "/review-management", label: "Quản lý đánh giá" },
        { href: "/notify", label: "Thông báo" }
    ];

    return (
        <div className="h-full w-full bg-white shadow-lg">
            <div className="flex flex-col pt-32 pl-4 text-md gap-10">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`font-semibold ${pathname === link.href ? 'text-[#ED3C3C]' : 'text-gray-700'} hover:text-[#ED3C3C]`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
