<script lang="ts">
  import Bubble from "./Bubble.svelte";
  import { onDestroy, onMount } from "svelte";
  import { ButtonTypeToAction } from "./attachments";
  let messages: {
    type: "from" | "to";
    message: string;
  }[] = [];
  let buttons: {
    type: string;
    metadata?: { [key: string]: string };
  }[] = [
    {
      type: "contact_me",
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

  const addResponse = (text: string) => {
    if (!text) return;
    messages = [
      ...messages,
      {
        type: "to",
        message: text,
      },
    ];
  };

  const addChatHistoryToSession = () => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
  };

  const getChatHistoryFromSession = () => {
    const chatHistory = sessionStorage.getItem("chatHistory");
    if (chatHistory) {
      messages = JSON.parse(chatHistory);
    }
  };

  const submitMessage = async (message: string) => {
    addMessage(message);
    const session_id = sessionStorage.getItem("session_id");
    const response = await fetch("/contact/chat.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        session_id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.error(err);
        return {
          answer:
            "Sorry, I seem to be having technical difficulties. This has been reported. Please try again later.",
        };
      });

    const responseToAdd =
      response.answer ||
      "Sorry, I seem to be having technical difficulties. This has been reported. Please try again later.";

    addResponse(responseToAdd);
    buttons = response.attachments.buttons ? response.attachments.buttons : [];
  };

  const generateRandomSessionID = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  onMount(() => {
    document.body.style.overflow = "hidden";
    getChatHistoryFromSession();
    if (!sessionStorage.getItem("session_id")) {
      const session_ID = generateRandomSessionID();
      sessionStorage.setItem("session_id", session_ID);
    }
  });

  onDestroy(() => {
    document.body.style.overflow = "auto";
    addChatHistoryToSession();
  });

  let input: HTMLTextAreaElement;
  let inputSection: HTMLDivElement;
  let dialogSection: HTMLDivElement;

  const formattedButtonName = (name: string) => {
    // take a type like contact_me and turn it into Contact Me
    const formatted = name
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");

    return formatted;
  };

  // filter buttons based on whether or not they have an associated function
  $: filteredButtons = buttons.filter((button) => {
    return ButtonTypeToAction[button.type];
  });
</script>

<div class="overlay">
  <div class="dialog" bind:this={dialogSection}>
    {#each messages as { message, type }}
      <Bubble {message} {type} />
    {/each}
    <div class="dialog__buttons">
      {#each filteredButtons as { type, metadata }}
        <button
          on:click={() => {
            ButtonTypeToAction[type](metadata);
          }}
          class="dialog__button"
        >
          {formattedButtonName(type)}
        </button>
      {/each}
    </div>
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
          submitMessage(input.value);
          input.value = "";
        }
      }}
      bind:this={input}
      tabindex="0"
    />
    <i
      class="ph-arrow-right submit"
      title="Send message"
      on:click={(e) => {
        e.stopPropagation();
        if (input.value) {
          submitMessage(input.value);
          input.value = "";
        }
      }}
      tabindex="0"
      on:keydown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (input.value) {
            submitMessage(input.value);
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
    bottom: 30%;
    padding: 24px;
    overflow-y: scroll;
    box-sizing: border-box;

    @include tablet {
      padding: 24px 56px;
    }

    &__buttons {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 8px;
      position: fixed;
      bottom: 30%;
      left: 0;
      right: 0;
      padding: 8px 24px;
      box-sizing: border-box;
    }

    &__button {
      padding: 8px 16px;
      background-color: white;
      border: 1px solid rgba($color: $cool-blue, $alpha: 0.6);
      border-radius: 20px;
      color: $cool-blue;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      box-sizing: border-box;
      transition: all 0.2s ease-in-out;
      font-family: "Quicksand", sans-serif;
      box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.1);

      &:hover {
        border-radius: 0;
        box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.1);
      }

      &:active {
        border-radius: 0;
        box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.1);
        transform: translateY(2px);
      }
    }
  }

  .input {
    position: absolute;
    top: 70%;
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
      background-color: rgba($color: #fff, $alpha: 0.9);

      .input__tooltip {
        opacity: 1;
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
