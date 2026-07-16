import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** /robots.txt -- libera o site todo, menos as areas privadas, e aponta o sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/auth"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
