import { BACKEND_URL } from "../constants/backendURL";
import type {
  ArticleCreateIn,
  ArticleDetails,
  ArticleList,
  GenericOut,
} from "../models";
import type { ArticleType } from "../pages/Admin/ArticleEditor";
import {
  replaceContentImagesWithS3,
  uploadImageSrcToS3,
} from "../services/s3Service";

const prepareArticleForUpload = async (
  article: ArticleCreateIn
): Promise<ArticleCreateIn> => {
  const updatedContent = await replaceContentImagesWithS3(
    article.content,
    article.title,
    `article/${article.title}`
  );
  const updatedThumbnail = article.thumbnail
    ? await uploadImageSrcToS3(
        article.thumbnail,
        `${article.title}-thumbnail`,
        `article/${article.title}`
      )
    : undefined;

  return {
    ...article,
    content: updatedContent,
    thumbnail: updatedThumbnail,
  };
};

export const createArticle = async (
  article: ArticleCreateIn,
  token: string
): Promise<GenericOut> => {
  const updatedArticle = await prepareArticleForUpload(article);
  const response = await fetch(`${BACKEND_URL}/api/articles/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedArticle),
  });
  if (!response.ok)
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  return response.json();
};

export const updateArticle = async (
  id: string,
  article: ArticleCreateIn,
  token: string
): Promise<GenericOut> => {
  const updatedArticle = await prepareArticleForUpload(article);
  const response = await fetch(`${BACKEND_URL}/api/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedArticle),
  });
  if (!response.ok)
    throw new Error(`Failed to update article: ${response.statusText}`);
  return response.json();
};

export const getArticles = async ({
  articleState,
  articleType,
  categoriesFilter,
}: {
  articleState: string;
  articleType?: ArticleType;
  categoriesFilter?: string;
}): Promise<ArticleList> => {
  const url = new URL(`${BACKEND_URL}/api/articles/`);
  if (articleType) url.searchParams.append("articleType", articleType);
  if (articleState) url.searchParams.append("articleState", articleState);
  if (categoriesFilter)
    url.searchParams.append("categoriesFilter", categoriesFilter);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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
): Promise<GenericOut> => {
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

  const data: GenericOut = await response.json();
  return data;
};

export const archiveArticle = async (
  token: string,
  id: string,
  archive: boolean
): Promise<GenericOut> => {
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

  const data: GenericOut = await response.json();
  return data;
};

export const readyArticle = async (
  token: string,
  id: string,
  ready: boolean
): Promise<GenericOut> => {
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

  const data: GenericOut = await response.json();
  return data;
};
