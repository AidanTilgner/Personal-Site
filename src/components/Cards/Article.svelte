<script lang="ts">
  import type { Article } from "@/types/main";
  export let article: Article;
</script>

<div class="article-card">
  <div class="header">
    <h4 class="title">{article.title}</h4>
    <div class="metadata">
      <p class="author">by {article.author}</p>
      <p class="date">{article.date}</p>
    </div>
  </div>
  <div class="body">
    <p>{article.caption}</p>
  </div>
  <div class="footer">
    <a href={`/blog/${article.slug}`} class="link"> read more </a>
  </div>
</div>

<style lang="scss">
  @use "../../styles/variables" as *;
  @use "../../styles/mixins" as *;

  .article-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.1);
    padding: 18px 24px;
    margin: 24px 0;
    text-align: left;

    .header {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 24px;

      .title {
        font-size: 24px;
        font-weight: 450;
        margin: 0;
        padding: 8px 0;
      }

      .metadata {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        opacity: 0.7;

        .author {
          font-size: 12px;
          font-weight: 400;
          margin: 0;
          text-align: right;
          margin-right: 8px;
        }

        .date {
          font-size: 12px;
          font-weight: 400;
          margin: 0;
          text-align: right;
        }
      }
    }

    .body {
      margin: 14px 0;

      p {
        font-size: 18px;
        font-weight: 400;
        margin: 0;
      }
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 24px;

      button {
        background-color: #fff;
        border: 1px solid $accent;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        color: $accent;

        &:hover {
          background-color: $accent;
          color: #fff;
        }
      }

      .link {
        font-size: 14px;
        font-weight: 400;
        margin: 0;
        color: $accent;
        text-decoration: none;
        transition: all 0.2s ease-in-out;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
