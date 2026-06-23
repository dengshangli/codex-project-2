import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const postsDirectory = path.join(process.cwd(), "content", "posts");
const wordsPerMinute = 200;

type Frontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
};

export type PostSummary = Frontmatter & {
  slug: string;
  readingTime: string;
};

export type Post = PostSummary & {
  html: string;
};

export function calculateReadingTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return `${minutes} 分钟阅读`;
}

export function getAllPosts(): PostSummary[] {
  return getPostFileNames()
    .map((fileName) => {
      const { content, data } = readPostFile(fileName);

      return {
        ...parseFrontmatter(data, fileName),
        slug: fileName.replace(/\.md$/, ""),
        readingTime: calculateReadingTime(content)
      };
    })
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getPostBySlug(slug: string): Post | null {
  const fileName = `${slug}.md`;
  const filePath = path.join(postsDirectory, fileName);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const { content, data } = readPostFile(fileName);
  const html = String(remark().use(remarkHtml).processSync(content));

  return {
    ...parseFrontmatter(data, fileName),
    slug,
    readingTime: calculateReadingTime(content),
    html
  };
}

function getPostFileNames(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"));
}

function readPostFile(fileName: string) {
  const filePath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");

  return matter(fileContents);
}

function parseFrontmatter(data: matter.GrayMatterFile<string>["data"], fileName: string): Frontmatter {
  const title = data.title;
  const description = data.description;
  const date = data.date;
  const tags = data.tags;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof date !== "string" ||
    !Array.isArray(tags) ||
    !tags.every((tag) => typeof tag === "string")
  ) {
    throw new Error(`${fileName} 的文章元数据无效`);
  }

  return { title, description, date, tags };
}
