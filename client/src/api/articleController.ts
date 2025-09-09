import { BACKEND_URL } from "../constants/backendURL";
import type { ArticleDetails, ArticleList, ArticleOut } from "../models";
import { replaceBase64ImagesWithS3 } from "../utils/apiUtil";

export const createArticle = async (
  article: ArticleDetails,
  token: string
): Promise<ArticleOut> => {
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

  const data: ArticleOut = await response.json();
  return data;
};

export const updateArticle = async (
  id: string,
  article: ArticleDetails,
  token: string
): Promise<ArticleOut> => {
  const updatedContent = await replaceBase64ImagesWithS3(
    article.content,
    article.title
  );
  const updatedArticle: ArticleDetails = {
    ...article,
    content: updatedContent,
  };

  const response = await fetch(`${BACKEND_URL}/api/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedArticle),
  });

  if (!response.ok) {
    throw new Error(`Failed to update article: ${response.statusText}`);
  }

  const data: ArticleOut = await response.json();
  return data;
};

export const getArticles = async (token: string): Promise<ArticleList> => {
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

  return (await response.json()) as ArticleList;
};

export const getArticleEdit = async (
  token: string,
  id: string
): Promise<ArticleDetails> => {
  const response = await fetch(
    `${BACKEND_URL}/api/articles/getEditDetails/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.statusText}`);
  }

  const data: ArticleDetails = await response.json();
  return data;
};
