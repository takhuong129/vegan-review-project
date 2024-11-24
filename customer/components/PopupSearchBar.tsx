import React, { useState, useEffect, useRef } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
interface PopupSearchBarProps {
    onClose: () => void;  // Function to close the search bar
}

export const PopupSearchBar: React.FC<PopupSearchBarProps> = ({ onClose }) => {
    const popupRef = useRef<HTMLDivElement | null>(null); // Reference to the popup container
    const [searchString, setSearchString] = useState<string>('')
    const router = useRouter()
    const runConsole = () => {
        if (searchString.trim() !== '') {
            router.push(`/store?query=${encodeURIComponent(searchString)}`); // Navigate to storepage with the search string in the query
        }
    };
    useEffect(() => {
        // Function to handle clicks outside the popup
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose(); // Close the popup if clicked outside
            }
        };

        // Add the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className=" fixed h-screen w-screen inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-50 gap-5">
            <h1 className="text-white text-4xl font-semibold">Tìm kiếm quán ăn, địa chỉ gần nơi bạn ở!</h1>
            <div
                ref={popupRef} // Attach the ref to the popup container
                className="relative w-[64rem] p-4 rounded-lg shadow-lg"
            >
                <IoIosCloseCircle
                    onClick={onClose}
                    className="absolute top-0 right-0 text-white text-2xl"
                />
                <div className="flex bg-white items-center px-2 rounded-full">
                    <IoSearchOutline className=" text-gray-400 text-3xl" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        size={100}
                        className="w-full px-2 py-4 rounded-full focus:outline-none"
                        onChange={(e) => setSearchString(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                runConsole(); // Run the function when Enter is pressed
                                onClose();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
