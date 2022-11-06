<script lang="ts">
  import Bubble from "./Bubble.svelte";
  const messages: {
    type: "from" | "to";
    message: string;
  }[] = [
    {
      type: "from",
      message: "Hey, how are you?",
    },
    {
      type: "to",
      message: "I'm good, how are you?",
    },
  ];
</script>

<div class="overlay">
  <div class="dialog">
    {#each messages as { message, type }}
      <Bubble {message} {type} />
    {/each}
  </div>
  <div class="input">
    <span class="input__tooltip">Press enter to send</span>
    <textarea type="text" placeholder="Type a message..." />
  </div>
</div>

<style lang="scss">
  @use "../../styles/mixins" as *;

  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1010;
    box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.1);
    // animation
    animation-name: dialog-in;
    animation-duration: 0.2s;
    animation-fill-mode: forwards;
    animation-timing-function: ease-out;
    // add glass effect
    backdrop-filter: blur(10px);
    overflow-y: scroll;
    inset: 0;
    padding: 24px;
  }

  .dialog {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 35%;
    padding: 24px;
    overflow-y: scroll;
  }

  .input {
    position: absolute;
    top: 65%;
    right: 0;
    left: 0;
    bottom: 0;
    // background-color: #fff;
    box-shadow: 0 -0.2px 24px 0 rgba($color: #000000, $alpha: 0.1);
    border-radius: 36px 36px 0 0;
    transition: all 0.2s ease-out;

    // when the user inside the child input
    &:focus-within {
      top: 40%;

      .input__tooltip {
        opacity: 1;
      }

      @include desktop {
        top: 65%;
      }
    }

    &__tooltip {
      position: absolute;
      top: -36px;
      right: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #a0a0a0;
      opacity: 0;
      transition: all 0.2s ease-out;
    }

    textarea {
      width: 100%;
      border: none;
      outline: none;
      font-size: 16px;
      font-weight: 500;
      color: #000;
      background-color: transparent;
      padding: 24px 36px;
      font-family: "Quicksand", sans-serif;
    }
  }

  @keyframes dialog-in {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
