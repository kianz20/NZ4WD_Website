import type { Area } from "react-easy-crop";

function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      ctx?.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      const base64 = canvas.toDataURL("image/jpeg");
      resolve(base64);
    };

    image.onerror = () => resolve(null);
  });
}

export { getCroppedImg };
