import React, { ImgHTMLAttributes, useState } from "react";

const ImageWithFallback: React.FC<
  ImgHTMLAttributes<any> & { fallbackSrc?: string }
> = (props) => {
  const { src, fallbackSrc, ...rest } = props;

  return (
    <img
      {...rest}
      src={src}
      onError={({ currentTarget }) => {
        if (fallbackSrc) {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = fallbackSrc;
        }
      }}
    />
  );
};

export default ImageWithFallback;
