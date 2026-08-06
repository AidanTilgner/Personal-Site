import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";

export const SUBSTACK_PUBLICATION_URL =
  "https://softwareandsynapses.substack.com";
export const SUBSTACK_PUBLICATION_NAME = "Software and Synapses";

const DEFAULT_FEED_URL = `${SUBSTACK_PUBLICATION_URL}/feed`;
const DEFAULT_CACHE_TTL_MS = 15 * 60 * 1000;

export type SubstackPost = {
  title: string;
  author: string;
  description: string;
  postdate: string;
  tags: string[];
  slug: string;
  canonicalUrl: string;
  html: string;
  contentText: string;
  thumbnailUrl?: string;
  audioUrl?: string;
};

type FeedValue = string | number | Record<string, unknown> | undefined;

type FeedCache = {
  fetchedAt: number;
  posts: SubstackPost[];
};

let cache: FeedCache | undefined;
let pendingRequest: Promise<SubstackPost[]> | undefined;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false,
  processEntities: true,
  isArray: (_tagName, path) =>
    typeof path === "string" &&
    (path === "rss.channel.item" || path.endsWith(".category")),
});

const textValue = (value: FeedValue) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }
  if (
    value &&
    typeof value === "object" &&
    typeof value["#text"] === "string"
  ) {
    return value["#text"].trim();
  }
  return "";
};

const plainText = (value: string) =>
  sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();

export const substackHtmlToText = (html: string) =>
  sanitizeHtml(
    html.replace(
      /<\/(?:blockquote|div|figcaption|h[1-6]|li|ol|p|pre|table|tr|ul)>/gi,
      "$&\n",
    ),
    { allowedTags: [], allowedAttributes: {} },
  )
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/ *\r?\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const hasClass = (attributes: Record<string, string>, className: string) =>
  attributes.class?.split(/\s+/).includes(className) ?? false;

export const sanitizeSubstackHtml = (html: string) => {
  const sanitized = sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "article",
      "audio",
      "figure",
      "figcaption",
      "iframe",
      "img",
      "picture",
      "source",
      "track",
      "video",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      audio: ["controls", "preload", "src"],
      div: ["class"],
      figure: ["class"],
      figcaption: ["class"],
      iframe: [
        "allow",
        "allowfullscreen",
        "frameborder",
        "height",
        "loading",
        "src",
        "title",
        "width",
      ],
      img: [
        "alt",
        "height",
        "loading",
        "sizes",
        "src",
        "srcset",
        "title",
        "width",
      ],
      picture: ["class"],
      source: ["media", "sizes", "src", "srcset", "type"],
      span: ["class"],
      track: ["default", "kind", "label", "src", "srclang"],
      video: [
        "autoplay",
        "controls",
        "height",
        "loop",
        "muted",
        "playsinline",
        "poster",
        "preload",
        "src",
        "width",
      ],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
    exclusiveFilter: (frame) =>
      hasClass(frame.attribs, "subscription-widget-wrap-editor") ||
      hasClass(frame.attribs, "subscription-widget"),
    transformTags: {
      a: (tagName, attribs) => {
        if (!attribs.href?.startsWith("http")) return { tagName, attribs };
        return {
          tagName,
          attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
        };
      },
      iframe: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          loading: "lazy",
          title: attribs.title || "Embedded video",
        },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: "lazy" },
      }),
    },
  });

  return sanitized.replace(
    /(?:(?:<div>\s*)?<hr\s*\/?>(?:\s*<\/div>)?\s*){2,}/gi,
    "<hr />\n",
  );
};

const firstImageUrl = (html: string) => {
  const src = html.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1];
  if (!src) return undefined;
  try {
    const url = new URL(src);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
};

const postSlug = (canonicalUrl: string) => {
  try {
    const segments = new URL(canonicalUrl).pathname.split("/").filter(Boolean);
    return segments[0] === "p" ? (segments[1] ?? "") : "";
  } catch {
    return "";
  }
};

export const parseSubstackFeed = (xml: string): SubstackPost[] => {
  const parsed = parser.parse(xml) as {
    rss?: { channel?: { item?: Array<Record<string, unknown>> } };
  };
  const items = parsed.rss?.channel?.item ?? [];

  return items
    .map((item): SubstackPost | undefined => {
      const canonicalUrl = textValue(item.link as FeedValue);
      const slug = postSlug(canonicalUrl);
      const published = new Date(textValue(item.pubDate as FeedValue));
      const title = textValue(item.title as FeedValue);
      if (!slug || !title || Number.isNaN(published.getTime()))
        return undefined;

      const categories = Array.isArray(item.category)
        ? item.category.map((category) => textValue(category as FeedValue))
        : [];
      const enclosure = item.enclosure as Record<string, unknown> | undefined;
      const rawHtml = textValue(item["content:encoded"] as FeedValue);
      const html = sanitizeSubstackHtml(rawHtml);
      const audioUrl =
        enclosure &&
        typeof enclosure === "object" &&
        enclosure["@_type"] === "audio/mpeg" &&
        typeof enclosure["@_url"] === "string"
          ? enclosure["@_url"]
          : undefined;

      return {
        title,
        author: textValue(item["dc:creator"] as FeedValue) || "Aidan Tilgner",
        description: plainText(textValue(item.description as FeedValue)),
        postdate: published.toISOString().slice(0, 10),
        tags: [...new Set(categories.filter(Boolean))],
        slug,
        canonicalUrl,
        html,
        contentText: substackHtmlToText(html),
        thumbnailUrl: firstImageUrl(rawHtml),
        audioUrl,
      };
    })
    .filter((post): post is SubstackPost => post !== undefined);
};

const cacheTtl = () => {
  const configured = Number(process.env.SUBSTACK_CACHE_TTL_MS);
  return Number.isFinite(configured) && configured >= 0
    ? configured
    : DEFAULT_CACHE_TTL_MS;
};

const refreshPosts = async () => {
  const response = await fetch(
    process.env.SUBSTACK_FEED_URL ?? DEFAULT_FEED_URL,
    {
      headers: { "user-agent": "AidanTilgner.com/1.0 (Substack feed reader)" },
      signal: AbortSignal.timeout(8_000),
    },
  );
  if (!response.ok) {
    throw new Error(`Substack feed request failed with ${response.status}.`);
  }
  const posts = parseSubstackFeed(await response.text());
  cache = { fetchedAt: Date.now(), posts };
  return posts;
};

export const getSubstackPosts = async () => {
  if (cache && Date.now() - cache.fetchedAt < cacheTtl()) return cache.posts;
  if (!pendingRequest) {
    pendingRequest = refreshPosts().finally(() => {
      pendingRequest = undefined;
    });
  }
  try {
    return await pendingRequest;
  } catch (error) {
    if (cache) return cache.posts;
    throw error;
  }
};
