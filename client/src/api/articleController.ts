import { BACKEND_URL } from "../constants/backendURL";
import type { ArticleBody, ArticleResponse } from "../models";
import { base64ToFile, uploadFileToS3 } from "../utils/apiUtil";

async function replaceBase64ImagesWithS3(
  html: string,
  articleTitle: string
): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = Array.from(doc.querySelectorAll("img"));

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const src = img.getAttribute("src");
    if (src && src.startsWith("data:image/")) {
      const file = base64ToFile(src, `${articleTitle}-${Date.now()}-${i}.png`);
      const s3Url = await uploadFileToS3(file);
      img.setAttribute("src", s3Url);
    }
  }

  return doc.body.innerHTML;
}

export const createArticle = async (
  article: ArticleBody
): Promise<ArticleResponse> => {
  try {
    const updatedContent = await replaceBase64ImagesWithS3(
      article.content,
      article.title
    );
    const updatedArticle: ArticleBody = { ...article, content: updatedContent };

    const response = await fetch(`${BACKEND_URL}/api/articles/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedArticle),
    });
    const data: ArticleResponse = await response.json();
    return data;
  } catch (error) {
    return { error: (error as Error).message };
  }
};
