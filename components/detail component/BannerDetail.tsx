"use client";
import React, { useState, useEffect } from "react";
import ImageLoader from "../ImageLoader";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface BannerDetailProps {
    bannerCollection: string[];
}

const BannerDetail: React.FC<BannerDetailProps> = ({ bannerCollection }) => {
    const [mainImage, setMainImage] = useState(bannerCollection[0]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Preload all images to avoid delay when switching
    useEffect(() => {
        bannerCollection.forEach((image) => {
            const img = new Image();
            img.src = image;
        });
    }, [bannerCollection]);

    // Ensure at least 4 thumbnails are displayed
    const imagesToDisplay = bannerCollection.length >= 4
        ? bannerCollection
        : [...bannerCollection, ...Array(4 - bannerCollection.length).fill("v1719926754/vegan-category_rkxsoh.png")];

    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slides: {
            perView: 4,
            spacing: 16,
        },
    });

    const handleThumbnailClick = (image: string, index: number) => {
        if (mainImage !== image) {
            setMainImage(image);
            setSelectedIndex(index);
        }
    };

    const handlePrevClick = () => {
        if (instanceRef.current) {
            instanceRef.current.prev();
        }
    };

    const handleNextClick = () => {
        if (instanceRef.current) {
            instanceRef.current.next();
        }
    };

    return (
        <div className="flex flex-col">
            {/* Main Image with fade transition */}
            <div
                className="mb-4 w-full max-w-[600px] transition-opacity duration-300 ease-in-out"
                style={{
                    opacity: 1, // Keeps it fully visible during transition
                }}
            >
                <ImageLoader
                    path={mainImage}
                    alt="Banner Image"
                    height={500}
                    width={700}
                    className="rounded-md"
                    cloudinaryAttributes={{
                        crop: "fill", // Ensure the image fills the container
                        gravity: "auto", // Adjust gravity as needed
                        quality: "auto", // Let Cloudinary determine the optimal quality
                        fetch_format: "auto", // Let Cloudinary determine the optimal format
                    }}
                />
            </div>

            {/* Thumbnails */}
            <div className="relative w-full max-w-[600px]">
                <button
                    onClick={handlePrevClick}
                    className="absolute left-0 z-10 bg-custom-green-light text-black p-2"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                    &#10094;
                </button>
                <div ref={sliderRef} className="keen-slider w-full">
                    {imagesToDisplay.map((image, index) => (
                        <div
                            key={index}
                            className="keen-slider__slide flex items-center justify-center w-1/4"
                        >
                            <div
                                onClick={() => handleThumbnailClick(image, index)}
                                className={`cursor-pointer ${selectedIndex === index
                                    ? "rounded-md border-spacing-0 border-4 border-green-500"
                                    : ""
                                    }`}
                            >
                                <ImageLoader
                                    path={image}
                                    alt="Thumbnail Image"
                                    height={150}
                                    width={150}
                                    className="rounded-md"
                                    cloudinaryAttributes={{
                                        crop: "fill", // Ensure the image fills the container
                                        gravity: "auto", // Adjust gravity as needed
                                        quality: "auto", // Let Cloudinary determine the optimal quality
                                        fetch_format: "auto", // Let Cloudinary determine the optimal format
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleNextClick}
                    className="absolute right-0 z-10 bg-custom-green-light text-black p-2"
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                    &#10095;
                </button>
            </div>
        </div>
    );
};

export default BannerDetail;
