export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author?: string;
  readTime?: string;
}
