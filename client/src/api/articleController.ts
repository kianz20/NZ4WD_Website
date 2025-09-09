import { BACKEND_URL } from "../constants/backendURL";
import type { ArticleDetails, ArticleResponse } from "../models";
import { replaceBase64ImagesWithS3 } from "../utils/apiUtil";

export const createArticle = async (
  article: ArticleDetails,
  token: string
): Promise<ArticleResponse> => {
  const updatedContent = await replaceBase64ImagesWithS3(
    article.content,
    article.title
  );
  const updatedArticle: ArticleDetails = {
    ...article,
    content: updatedContent,
  };

  const response = await fetch(`${BACKEND_URL}/api/articles/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedArticle),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }

  const data: ArticleResponse = await response.json();
  return data;
};

export const getArticles = async (
  token: string
): Promise<ArticleResponse[]> => {
  const response = await fetch(`${BACKEND_URL}/api/articles/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }

  return (await response.json()) as ArticleResponse[];
};
