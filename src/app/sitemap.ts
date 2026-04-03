import type { MetadataRoute } from "next"
import { BLOG_POSTS } from "@/lib/blog"

const BASE = "https://paradigmjp.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE}/services/web`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/services/meo`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/services/seo`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/services/ai`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
{ url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.9 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE}/legal`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    // LP pages
    { url: `${BASE}/lp/web`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/lp/meo`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/lp/seo`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/lp/ai`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ]

  const blogPages = BLOG_POSTS.map(post => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
