import React from "react";
import { CldImage } from "next-cloudinary";

interface ImageLoaderProps {
  path: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  cloudinaryAttributes?: Record<string, string>;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  path,
  alt,
  width,
  height,
  className,
  cloudinaryAttributes = {},
}) => {
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const imgLink = `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${path}`;

  return (
    <div>
      <CldImage
        src={imgLink}
        alt={alt}
        width={width}
        height={height}
        className={`${className}`}
        loading="lazy"
        {...cloudinaryAttributes}
      />
    </div>
  );
};

export default ImageLoader;
