import React, { useEffect } from "react";
import type { BlogPost } from "../../../types/main";
import styles from "./Posts.module.scss";
import { getAlphanumericText, getPrettyDate } from "../../../utils/formatting";
import { X } from "@phosphor-icons/react";

interface PostsProps {
  posts: BlogPost[];
}

function Posts({ posts }: PostsProps) {
  const [query, setQueryState] = React.useState<string>("");
  const setQuery = (query: string) => {
    setQueryState(getAlphanumericText(query));
  };

  const [sortBy, setSortByState] = React.useState<string>("recent");

  const filteredPosts = posts.filter((post) => {
    if (post.draft) return false;

    const passes = () => {
      const passesTitle = post.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const passesDescription = post.description
        .toLowerCase()
        .includes(query.toLowerCase());
      const passesDate = post.postdate
        .toLowerCase()
        .includes(query.toLowerCase());
      const passesTags = post.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLowerCase()),
      );
      return passesTitle || passesDescription || passesDate || passesTags;
    };
    return query === "" ? true : passes();
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sortBy === "recent") {
      const aDate = new Date(a.postdate);
      const bDate = new Date(b.postdate);
      return bDate.getTime() - aDate.getTime();
    }
    if (sortBy === "oldest") {
      const aDate = new Date(a.postdate);
      const bDate = new Date(b.postdate);
      return aDate.getTime() - bDate.getTime();
    }
    return 0;
  });

  useEffect(() => {
    // look for "filter" search param
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get("filter");
    if (filter) {
      setQuery(filter);
    }
  }, []);

  return (
    <div className={styles.posts}>
      <div className={styles.header}>
        <div className={styles.search}>
          <input
            placeholder="Search posts..."
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => {
              setQuery("");
              window.location.href = "/blog";
            }}
          >
            <X />
          </button>
        </div>
        <div className={styles.options}>
          <div className={styles.sortby}>
            <select
              name="sortby"
              value={sortBy}
              onChange={(e) => setSortByState(e.target.value)}
              className={`select`}
            >
              <option value="recent">Recent</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>
      <div className={styles.allposts}>
        {sortedPosts.map((post) => (
          <Post key={post.description} post={post} />
        ))}
        {!sortedPosts.length && (
          <p className={styles.noresults}>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default Posts;

function Post({ post }: { post: BlogPost }) {
  return (
    <button
      className={styles.post}
      onClick={() => {
        if (!post.url) return;
        window.location.href = post.url;
      }}
    >
      <p className={styles.post__title}>{post.title}</p>
      <p className={styles.post__description}>{post.description}</p>
      <p className={styles.post__date}>{getPrettyDate(post.postdate)}</p>
      <div className={styles.post__tags}>
        {post.tags.map((tag) => (
          <a
            key={tag}
            className={styles.post__tag}
            href={`/blog?filter="${tag}"`}
          >
            {tag}
          </a>
        ))}
      </div>
    </button>
  );
}
