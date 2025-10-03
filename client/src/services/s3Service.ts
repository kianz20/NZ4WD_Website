import { BACKEND_URL } from "../constants/backendURL";

function sanitizeS3Path(path: string) {
  return path
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_/]/g, "");
}

/**
 * Uploads a file to an S3 bucket using a presigned URL.
 *
 * @param file - The File object to upload.
 * @param folderPath - Optional folder path in S3 where the file should be stored.
 * @returns A Promise that resolves to the public URL of the uploaded file.
 */
async function uploadFileToS3(file: File, folderPath: string): Promise<string> {
  const key = folderPath
    ? `${sanitizeS3Path(folderPath)}/${file.name}`
    : file.name;

  const presignRes = await fetch(`${BACKEND_URL}/api/s3`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: key, type: file.type }),
  });
  const { url } = await presignRes.json();

  await fetch(url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  const publicUrl = `https://nz4wd-images.s3.ap-southeast-2.amazonaws.com/${key}`;
  return publicUrl;
}

/**
 * Replaces all base64-encoded <img> sources in HTML with S3 URLs.
 *
 * @param html - The HTML string containing <img> elements.
 * @param objectTitle - A title used to generate unique filenames for images.
 * @param folderPath - The S3 folder path where images should be uploaded.
 * @returns A Promise that resolves to the updated HTML string with all images replaced by their S3 URLs.
 */
async function replaceContentImagesWithS3(
  html: string,
  objectTitle: string,
  folderPath: string
): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = Array.from(doc.querySelectorAll("img"));

  const safeobjectTitle = objectTitle
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = img.getAttribute("src");
    if (src && src.startsWith("data:image/")) {
      const file = base64ToFile(
        src,
        `${safeobjectTitle}-${Date.now()}-${i}.png`
      );
      const s3Url = await uploadFileToS3(file, folderPath);
      img.setAttribute("src", s3Url);
    }
  }

  return doc.body.innerHTML;
}

/**
 * Converts a base64-encoded string into a File object.
 *
 * @param base64 - The base64 string to convert. Must include the MIME type in the data URL format (e.g., "data:image/png;base64,...").
 * @param filename - The name to assign to the resulting File object.
 * @returns A File object containing the decoded binary data with the specified filename and MIME type.
 * @throws Will throw an error if the base64 string is invalid or missing a MIME type.
 */
function base64ToFile(base64: string, filename: string): File {
  const [meta, data] = base64.split(",");
  if (!meta || !data) throw new Error("Invalid base64 string");

  const match = meta.match(/:(.*?);/);
  if (!match) throw new Error("Invalid base64 MIME type");

  const mime = match[1];
  const binary = atob(data);
  const u8arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) u8arr[i] = binary.charCodeAt(i);

  return new File([u8arr], filename, { type: mime });
}

/**
 * Uploads a base64-encoded image to S3 and returns its public URL.
 * If the input is already a URL, it returns it unchanged.
 *
 * @param image - The base64 string or existing URL of the image.
 * @param objectTitle - A title used to generate a unique filename for the image.
 * @param folderName - The S3 folder path where the image should be uploaded.
 * @returns A Promise that resolves to the S3 public URL or the original URL if not base64.
 */
async function uploadImageSrcToS3(
  image: string,
  objectTitle: string,
  folderName: string
): Promise<string> {
  const isBase64 = image.startsWith("data:") && image.includes("base64,");

  if (!isBase64) {
    return image;
  }

  const safeobjectTitle = objectTitle
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");

  const file = base64ToFile(image, `${safeobjectTitle}-${Date.now()}.png`);

  const s3Url = await uploadFileToS3(file, folderName);
  return s3Url;
}

export {
  base64ToFile,
  uploadFileToS3,
  replaceContentImagesWithS3,
  uploadImageSrcToS3,
};
