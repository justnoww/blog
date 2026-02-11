import { getAllPosts } from '@/lib/posts';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';

export async function GET() {
  const posts = getAllPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${SITE_URL}/posts/${post.slug}</link>
        <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.description}]]></description>
      </item>`;
      })
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
