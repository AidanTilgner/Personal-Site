<script lang="ts">
  export let type: "from" | "to";
  export let message: string;

  const parsedMessage = () => {
    // find a tags, and insert a style attribute
    const regex = /<a href="(.+?)">(.+?)<\/a>/g;
    const matches = message.match(regex);
    if (matches) {
      matches.forEach((mtch) => {
        const href = mtch.match(/href="(.+?)"/)?.[1];
        const text = mtch?.match(/>(.+?)</)?.[1];
        message = message.replace(
          mtch,
          `<a href="${href}" style="color: #fff; text-decoration: underline;" target="_blank">${text}</a>`
        );
      });
    }
    return message;
  };
</script>

<div class="message {type}">
  <div class="message__content {type}">
    <div class="message__content__text">
      {@html parsedMessage()}
    </div>
  </div>
</div>

<style lang="scss">
  @use "../../styles/variables" as *;

  .message {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 24px 0;

    &.from {
      align-items: flex-end;
    }

    &.to {
      align-items: flex-start;
    }

    &__content {
      box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.1);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      max-width: 80%;
      padding: 14px 24px;
      border-radius: 5px;
      text-align: left;
      animation-name: bubble-in;
      animation-duration: 0.3s;
      animation-fill-mode: forwards;
      animation-timing-function: ease-out;

      &.to {
        background-color: $coolBlue;
        color: white;
      }

      &.from {
        background-color: white;
        color: $coolBlue;
      }

      &__text {
        font-size: 16px;
        font-weight: 500;
        a {
          color: white;
          text-decoration: underline;
        }
      }
    }
  }

  @keyframes bubble-in {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
