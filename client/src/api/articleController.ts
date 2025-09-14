import { BACKEND_URL } from "../constants/backendURL";
import type {
  ArticleCreateIn,
  ArticleDetails,
  ArticleList,
  ArticleOut,
} from "../models";
import type { ArticleType } from "../pages/ArticleEditor";
import {
  replaceContentImagesWithS3,
  replaceThumbnailImageWithS3,
} from "../utils/apiUtil";

export const createArticle = async (
  article: ArticleCreateIn,
  token: string
): Promise<ArticleOut> => {
  const updatedContent = await replaceContentImagesWithS3(
    article.content,
    article.title
  );

  let updatedThumbail;

  if (article.thumbnail) {
    updatedThumbail = await replaceThumbnailImageWithS3(
      article.thumbnail,
      article.title
    );
  }

  const updatedArticle: ArticleCreateIn = {
    ...article,
    content: updatedContent,
    thumbnail: article.thumbnail ? updatedThumbail : undefined,
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
  article: ArticleCreateIn,
  token: string
): Promise<ArticleOut> => {
  const updatedContent = await replaceContentImagesWithS3(
    article.content,
    article.title
  );

  let updatedThumbail;

  if (article.thumbnail) {
    updatedThumbail = await replaceThumbnailImageWithS3(
      article.thumbnail,
      article.title
    );
  }

  const updatedArticle: ArticleCreateIn = {
    ...article,
    content: updatedContent,
    thumbnail: article.thumbnail ? updatedThumbail : undefined,
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

export const getArticles = async (
  activeOnly?: boolean,
  articleType?: ArticleType
): Promise<ArticleList> => {
  const url = new URL(`${BACKEND_URL}/api/articles/`);
  if (articleType) url.searchParams.append("articleType", articleType);
  if (activeOnly) url.searchParams.append("activeOnly", activeOnly.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }

  return (await response.json()) as ArticleList;
};

export const getArticle = async (id: string): Promise<ArticleDetails> => {
  const response = await fetch(`${BACKEND_URL}/api/articles/article/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.statusText}`);
  }

  const data: ArticleDetails = await response.json();
  return data;
};

export const deleteArticle = async (
  token: string,
  id: string
): Promise<ArticleOut> => {
  const response = await fetch(`${BACKEND_URL}/api/articles/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete article: ${response.statusText}`);
  }

  const data: ArticleOut = await response.json();
  return data;
};

export const archiveArticle = async (
  token: string,
  id: string,
  archive: boolean
): Promise<ArticleOut> => {
  const response = await fetch(`${BACKEND_URL}/api/articles/archive/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ archive }),
  });

  if (!response.ok) {
    throw new Error(`Failed to archive article: ${response.statusText}`);
  }

  const data: ArticleOut = await response.json();
  return data;
};

export const readyArticle = async (
  token: string,
  id: string,
  ready: boolean
): Promise<ArticleOut> => {
  const response = await fetch(`${BACKEND_URL}/api/articles/ready/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ready }),
  });

  if (!response.ok) {
    throw new Error(`Failed to ready article: ${response.statusText}`);
  }

  const data: ArticleOut = await response.json();
  return data;
};
