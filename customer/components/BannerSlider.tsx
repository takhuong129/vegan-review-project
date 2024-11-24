"use client";
import React, { useState, useEffect } from "react";
import ImageLoader from "./ImageLoader";
import { banner1, banner2, banner3 } from "@/container/ImageConstant";
const bannerImg = [
  {
    src: banner1.link,
    alt: banner1.alt,
  },
  {
    src: banner2.link,
    alt: banner2.alt,
  },
  {
    src: banner3.link,
    alt: banner3.alt,
  },
];

const BannerSlider: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Move to the next image
      setCurrentImage((prevIndex) =>
        prevIndex === bannerImg.length - 1 ? 0 : prevIndex + 1
      );
    }, 3500); // Change slide every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className=" overflow-hidden">
      {bannerImg.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? "opacity-100" : "opacity-0"
            }`}
        >
          <ImageLoader
            path={img.src}
            alt={img.alt}
            className="object-cover"
            cloudinaryAttributes={{ fill: "true" }}
          />
        </div>
      ))}
    </div>
  );
};

export default BannerSlider;
