import { BACKEND_URL } from "../constants/backendURL";

function base64ToFile(base64: string, filename: string): File {
  const [meta, data] = base64.split(",");
  const mime = meta.match(/:(.*?);/)![1];
  const binary = atob(data);
  const u8arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) u8arr[i] = binary.charCodeAt(i);
  return new File([u8arr], filename, { type: mime });
}

async function uploadFileToS3(file: File): Promise<string> {
  const presignRes = await fetch(`${BACKEND_URL}/api/s3-presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, type: file.type }),
  });
  const { url } = await presignRes.json();

  await fetch(url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  const publicUrl = `https://nz4wd-images.s3.ap-southeast-2.amazonaws.com/${file.name}`;
  return publicUrl;
}

async function replaceBase64ImagesWithS3(
  html: string,
  articleTitle: string
): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = Array.from(doc.querySelectorAll("img"));
  const safeArticleTitle = articleTitle
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = img.getAttribute("src");
    if (src && src.startsWith("data:image/")) {
      const file = base64ToFile(
        src,
        `${safeArticleTitle}-${Date.now()}-${i}.png`
      );
      const s3Url = await uploadFileToS3(file);
      img.setAttribute("src", s3Url);
    }
  }

  return doc.body.innerHTML;
}

export { base64ToFile, uploadFileToS3, replaceBase64ImagesWithS3 };
