<script lang="ts">
  import Bubble from "./Bubble.svelte";
  import { onDestroy, onMount } from "svelte";
  let messages: {
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
    {
      type: "to",
      message: "I was wondering if everything was alright?",
    },
  ];

  const addMessage = (text: string) => {
    if (!text) return;
    messages = [
      ...messages,
      {
        type: "from",
        message: text,
      },
    ];
  };

  onMount(() => {
    document.body.style.overflow = "hidden";
  });

  onDestroy(() => {
    document.body.style.overflow = "auto";
  });

  let input: HTMLTextAreaElement;
  let inputSection: HTMLDivElement;
  let dialogSection: HTMLDivElement;
</script>

<div class="overlay">
  <div class="dialog" bind:this={dialogSection}>
    {#each messages as { message, type }}
      <Bubble {message} {type} />
    {/each}
  </div>
  <div class="input" bind:this={inputSection} on:click={() => input.focus()}>
    <span class="input__tooltip">Press enter to send</span>
    <textarea
      type="text"
      placeholder="Type a message..."
      on:click={(e) => {
        e.stopPropagation();
      }}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addMessage(e.currentTarget.value);
          e.currentTarget.value = "";
        }
      }}
      bind:this={input}
      tabindex="0"
      on:keydown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addMessage(e.currentTarget.value);
          e.currentTarget.value = "";
        }
      }}
    />
    <i
      class="ph-arrow-right submit"
      title="Send message"
      on:click={(e) => {
        e.stopPropagation();
        if (input.value) {
          addMessage(input.value);
          input.value = "";
        }
      }}
      tabindex="0"
      on:keydown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (input.value) {
            addMessage(input.value);
            input.value = "";
          }
        }
      }}
    />
  </div>
</div>

<style lang="scss">
  @use "../../styles/mixins" as *;
  @use "../../styles/variables" as *;

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
    background-color: transparent;
    box-sizing: border-box;
    overflow: hidden;

    body {
      overflow: hidden;
      height: 100vh;
    }
  }

  .dialog {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 35%;
    padding: 24px;
    overflow-y: scroll;
    box-sizing: border-box;

    @include tablet {
      padding: 24px 56px;
    }
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
    background-color: rgba($color: #fff, $alpha: 0.75);
    box-sizing: border-box;

    .submit {
      position: absolute;
      top: 36px;
      right: 24px;
      transform: translateY(-50%);
      color: #000;
      cursor: pointer;
      transition: all 0.2s ease-out;
      font-size: 18px;
      padding: 8px;
      border-radius: 50%;
      background-color: $cool-blue;
      color: white;
      box-shadow: 0 0.2px 24px 0 rgba($color: #000000, $alpha: 0.25);
    }

    // when the user inside the child input
    &:focus-within {
      top: 40%;
      background-color: rgba($color: #fff, $alpha: 0.9);

      .input__tooltip {
        opacity: 1;
      }

      @include tablet {
        top: 65%;
      }
    }

    &__tooltip {
      position: absolute;
      top: -36px;
      left: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #242424;
      opacity: 0;
      background-color: rgba($color: #fff, $alpha: 0.65);
      border: 1px solid #eaeaea;
      border-radius: 99px;
      padding: 4px 8px;
      transition: all 0.2s ease-out;
    }

    textarea {
      width: 100%;
      height: 100%;
      display: block;
      border: none;
      outline: none;
      font-size: 16px;
      font-weight: 500;
      color: #000;
      background-color: transparent;
      padding: 24px 36px;
      font-family: "Quicksand", sans-serif;
      resize: none;
      box-sizing: border-box;

      @include tablet {
        padding: 24px 56px;
      }
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
