<script lang="ts">
  import Secondary from "@/components/Buttons/Secondary.svelte";

  interface ProjectProps {
    title: string;
    description: string;
    tags: string[];
    link: string;
  }

  export let title: ProjectProps["title"];
  export let description: ProjectProps["description"];
  export let tags: ProjectProps["tags"];
  export let link: ProjectProps["link"];

  const formattedTitle = title.replace(/ /g, "-").toLowerCase();
</script>

<div class="card" id={formattedTitle}>
  <div class="header">
    <h2>{title}</h2>
  </div>
  <div class="body">
    <slot />
  </div>
  <div class="footer">
    <p class="desc">
      {description}
    </p>
    <div class="tags">
      {#each tags as tag}
        <a class="tag" href={`/skills#${tag}`}>
          {tag}
        </a>
      {/each}
    </div>
  </div>
  <div class="button">
    <a href={link} target="_blank">
      <Secondary
        props={{
          text: "View Project",
          padded: false,
          size: "md",
        }}
      />
    </a>
  </div>
</div>

<style lang="scss">
  @use "../../styles/mixins" as *;
  @use "../../styles/variables" as *;

  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    border-radius: 0;
    box-shadow: 0.2px 0.2px 45px rgba(0, 0, 0, 0.15);
    border: 1px solid #eaeaea;
    background-color: #fff;
    transition: box-shadow 0.2s ease-in-out;
    position: relative;
    box-sizing: border-box;

    &:hover {
      box-shadow: 0.2px 0.2px 45px rgba(0, 0, 0, 0.25);
    }

    .header {
      padding: 18px 24px;
      // background-color: #f5f5f5;
      color: #000;
      text-align: left;
      border-bottom: 1px solid #eaeaea;
      box-sizing: border-box;

      @include tablet {
        padding: 24px 56px;
      }

      @include desktop {
        padding: 24px 82px;
      }

      h2 {
        font-size: 24px;
        font-weight: 400;
        margin: 0;

        @include tablet {
          font-size: 32px;
        }

        @include desktop {
          font-size: 36px;
        }
      }
    }

    .body {
      background-color: #f7f7f7;
      box-sizing: border-box;
      height: 60%;
    }

    .footer {
      box-sizing: border-box;
      padding: 14px 24px;
      // background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      border-top: 1px solid #eaeaea;

      @include tablet {
        padding: 18px 56px;
      }

      @include desktop {
        padding: 18px 82px;
      }

      .desc {
        font-size: 16px;
        font-weight: 400;
        margin: 0;
        text-align: left;

        @include tablet {
          font-size: 20px;
        }
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        margin-top: 14px;
      }

      .tag {
        display: inline-block;
        padding: 4px 8px;
        margin: 4px 8px 4px 0;
        border-radius: 4px;
        background-color: #fff;
        font-size: 11px;
        font-weight: 500;
        color: $accent;
        border: 1px solid rgba($accent, 0.25);
        transition: all 0.2s ease-in-out;

        @include tablet {
          font-size: 14px;
          margin-right: 14px;
        }

        &:hover {
          background-color: $accent;
          color: #fff;
        }
      }
    }

    .button {
      position: absolute;
      bottom: -36px;
      right: -18px;
    }
  }
</style>
