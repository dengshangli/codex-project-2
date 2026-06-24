import type { PostSummary } from "./posts";

export const postsPerPage = 6;

type ArchiveParams = {
  query?: string;
  page?: string;
};

export type PostArchive = {
  posts: PostSummary[];
  query: string;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
};

export function buildPostArchive(posts: PostSummary[], params: ArchiveParams): PostArchive {
  const query = normalizeQuery(params.query);
  const filteredPosts = query ? posts.filter((post) => matchesQuery(post, query)) : posts;
  const totalPosts = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));
  const currentPage = clampPage(params.page, totalPages);
  const pageStart = (currentPage - 1) * postsPerPage;

  return {
    posts: filteredPosts.slice(pageStart, pageStart + postsPerPage),
    query,
    currentPage,
    totalPages,
    totalPosts
  };
}

function matchesQuery(post: PostSummary, query: string): boolean {
  const searchableText = [post.title, post.description, ...post.tags].join(" ").toLocaleLowerCase();

  return searchableText.includes(query.toLocaleLowerCase());
}

function normalizeQuery(query: string | undefined): string {
  return query?.trim() ?? "";
}

function clampPage(page: string | undefined, totalPages: number): number {
  const parsedPage = Number(page);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return Math.min(parsedPage, totalPages);
}
