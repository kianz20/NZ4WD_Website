import { BACKEND_URL } from "../constants/backendURL";
import type {
  ArticleCreateIn,
  ArticleEditOut,
  ArticleList,
  ArticleOut,
} from "../models";
import { replaceBase64ImagesWithS3 } from "../utils/apiUtil";

export const createArticle = async (
  article: ArticleCreateIn,
  token: string
): Promise<ArticleOut> => {
  const updatedContent = await replaceBase64ImagesWithS3(
    article.content,
    article.title
  );
  const updatedArticle: ArticleCreateIn = {
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
  article: ArticleCreateIn,
  token: string
): Promise<ArticleOut> => {
  const updatedContent = await replaceBase64ImagesWithS3(
    article.content,
    article.title
  );
  const updatedArticle: ArticleCreateIn = {
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
): Promise<ArticleEditOut> => {
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

  const data: ArticleEditOut = await response.json();
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
