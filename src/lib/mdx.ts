import { readFileSync } from "node:fs";
import { join } from "node:path";

export type JournalFrontmatter = {
  title: string;
  description: string;
  date: string;
  category: string;
  slug: string;
  image: string;
  readingTime: string;
};

export type JournalContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string };

export type JournalArticle = {
  frontmatter: JournalFrontmatter;
  content: readonly JournalContentBlock[];
};

const journalFiles = [
  "line-and-light.mdx",
  "rare-color-stories.mdx",
  "choose-a-gemstone.mdx",
  "timeless-jewellery.mdx",
] as const;

const frontmatterKeys = [
  "title",
  "description",
  "date",
  "category",
  "slug",
  "image",
  "readingTime",
] as const satisfies readonly (keyof JournalFrontmatter)[];

function unquote(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseJournalFile(source: string, filename: string): JournalArticle {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`Missing frontmatter in ${filename}`);

  const values = new Map<string, string>();
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    values.set(line.slice(0, separator).trim(), unquote(line.slice(separator + 1)));
  }

  for (const key of frontmatterKeys) {
    if (!values.get(key)) throw new Error(`Missing ${key} frontmatter in ${filename}`);
  }

  const frontmatter: JournalFrontmatter = {
    title: values.get("title")!,
    description: values.get("description")!,
    date: values.get("date")!,
    category: values.get("category")!,
    slug: values.get("slug")!,
    image: values.get("image")!,
    readingTime: values.get("readingTime")!,
  };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)) {
    throw new Error(`Invalid date frontmatter in ${filename}`);
  }

  const content = match[2]
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .filter(Boolean)
    .map<JournalContentBlock>((block) =>
      block.startsWith("## ")
        ? { type: "heading", text: block.slice(3).trim() }
        : { type: "paragraph", text: block.replace(/\r?\n/g, " ").trim() },
    );

  return { frontmatter, content };
}

function loadJournalFile(filename: (typeof journalFiles)[number]) {
  const path = join(process.cwd(), "content", "journal", filename);
  return parseJournalFile(readFileSync(path, "utf8"), filename);
}

export const journalArticles: readonly JournalArticle[] = journalFiles.map(loadJournalFile);

export function getJournalArticle(slug: string) {
  return journalArticles.find((article) => article.frontmatter.slug === slug);
}
