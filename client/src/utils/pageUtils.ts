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

function getFileExtensionFromKey(key: string) {
  const match = key.match(/\.(\w+)$/);
  return match ? match[1] : "png"; // default to png if no extension
}

async function downloadImage(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export { getCroppedImg, downloadImage, getFileExtensionFromKey };
