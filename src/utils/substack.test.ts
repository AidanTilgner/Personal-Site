import { describe, expect, test } from "bun:test";
import { parseSubstackFeed, sanitizeSubstackHtml } from "./substack";

describe("Substack feed", () => {
  test("maps an RSS item to a native post", () => {
    const posts = parseSubstackFeed(`<?xml version="1.0"?>
      <rss><channel><item>
        <title><![CDATA[A useful essay]]></title>
        <description><![CDATA[About <strong>useful things</strong>.]]></description>
        <link>https://softwareandsynapses.substack.com/p/a-useful-essay</link>
        <dc:creator><![CDATA[Aidan Tilgner]]></dc:creator>
        <pubDate>Mon, 03 Feb 2025 23:37:25 GMT</pubDate>
        <category><![CDATA[Agents]]></category>
        <enclosure url="https://example.com/episode.mp3" type="audio/mpeg" />
        <content:encoded><![CDATA[<p>Hello, reader.</p><img src="https://images.example.com/cover.png">]]></content:encoded>
      </item></channel></rss>`);

    expect(posts).toEqual([
      expect.objectContaining({
        title: "A useful essay",
        description: "About useful things.",
        author: "Aidan Tilgner",
        postdate: "2025-02-03",
        slug: "a-useful-essay",
        tags: ["Agents"],
        audioUrl: "https://example.com/episode.mp3",
        thumbnailUrl: "https://images.example.com/cover.png",
        contentText: "Hello, reader.",
      }),
    ]);
    expect(posts[0].html).toContain("<img");
  });

  test("removes executable and subscription markup", () => {
    const html = sanitizeSubstackHtml(`
      <script>alert('no')</script>
      <div class="subscription-widget-wrap-editor"><p>Subscribe form</p></div>
      <p onclick="alert('no')">Safe copy</p>
      <iframe src="https://www.youtube-nocookie.com/embed/abc"></iframe>
    `);

    expect(html).not.toContain("script");
    expect(html).not.toContain("Subscribe form");
    expect(html).not.toContain("onclick");
    expect(html).toContain("www.youtube-nocookie.com/embed/abc");
  });

  test("collapses adjacent Substack section rules", () => {
    const html = sanitizeSubstackHtml(
      "<p>First section.</p><div><hr></div><div><hr></div><h2>Next section</h2>",
    );

    expect(html.match(/<hr/g)).toHaveLength(1);
  });
});
