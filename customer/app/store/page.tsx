'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Store from '@/components/Store';
import Sidebar from '@/components/Sidebar';
import { getRestaurantHome, getSearchRestaurant } from '@/container/RestaurantAPI';
import { StoreData } from '@/container/RestaurantData';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const StorePage: React.FC = () => {
    const [storeList, setStoreList] = useState<StoreData[]>([]);


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const searchParams = useSearchParams(); // Get query parameters
    const query = searchParams.get('query'); // Get the 'query' parameter

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        if (!sidebarOpen) {
            document.body.style.overflow = 'hidden'; // Disable parent page scrolling
        } else {
            document.body.style.overflow = 'auto'; // Enable parent page scrolling
        }
    };

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (query) {
                // Fetch search results when there's a query
                console.log('Fetching results for:', query);
                const searchData = await getSearchRestaurant(query);
                setStoreList(searchData || []);
            } else {
                // Fetch default restaurants when no query
                console.log('Fetching default restaurants');
                const data = await getRestaurantHome(1, 20);
                setStoreList(data || []);
            }
        };
        fetchRestaurants();
    }, [query]);

    const handleApplyFilter = (filters: any) => {
        setStoreList(filters); // Update filtered data
        setCurrentPage(1); // Reset to the first page
        toggleSidebar()
    };
    const totalPages = Math.ceil((storeList?.length || 0) / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const currentItems = storeList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="flex flex-col items-center justify-center px-24 py-12 w-full">
            <div className="flex items-center justify-between w-full mb-20 px-20">
                <h2 className="text-4xl font-bold">Cửa hàng</h2>
                <button onClick={toggleSidebar} className="btn btn-wide bg-custom-grey text-white hover:bg-gray-700">Bộ lọc</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full px-16">
                {currentItems.map((item) => (
                    <Link key={item.restaurantId} href={`/store/${item.restaurantId}`}>
                        <Store store={item} />
                    </Link>
                ))}
            </div>
            <div className="flex justify-center mt-10">
                <div className="btn-group flex gap-3">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} applyFilter={handleApplyFilter} />
            {sidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed top-0 left-0 h-full w-full z-40 bg-black opacity-30"
                ></div>
            )}
        </div>
    );
};

export default StorePage;
