import React, { useEffect } from "react";
import type { BlogPost } from "../../../types/main";
import styles from "./Posts.module.scss";
import { getAlphanumericText, getPrettyDate } from "../../../utils/formatting";
import { XIcon } from "@phosphor-icons/react";

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
          {query && (
            <button
              type="button"
              aria-label="Clear blog search"
              onClick={() => {
                setQuery("");
                window.history.replaceState({}, "", "/blog");
              }}
            >
              <XIcon />
            </button>
          )}
        </div>
        <div className={styles.options}>
          <span className={styles.count}>
            {sortedPosts.length.toString().padStart(2, "0")} entries
          </span>
          <div className={styles.sortby}>
            <select
              aria-label="Sort posts"
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
        {sortedPosts.map((post, index) => (
          <Post key={post.url ?? post.title} post={post} index={index} />
        ))}
        {!sortedPosts.length && (
          <p className={styles.noresults}>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default Posts;

function Post({ post, index }: { post: BlogPost; index: number }) {
  return (
    <article className={styles.post}>
      <span className={styles.post__index} aria-hidden="true">
        {(index + 1).toString().padStart(2, "0")}
      </span>
      <a className={styles.post__content} href={post.url ?? "/blog"}>
        <p className={styles.post__title}>{post.title}</p>
        <p className={styles.post__description}>{post.description}</p>
        <p className={styles.post__date}>{getPrettyDate(post.postdate)}</p>
      </a>
      <div className={styles.post__tags}>
        {post.tags.map((tag) => (
          <a
            key={tag}
            className={styles.post__tag}
            href={`/blog?filter=${encodeURIComponent(tag)}`}
          >
            {tag}
          </a>
        ))}
      </div>
    </article>
  );
}
