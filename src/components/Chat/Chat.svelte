<script lang="ts">
  import Dialog from "./Dialog.svelte";
  let open = false;
</script>

{#if !open}
  <div
    class="chat"
    title="Chat with my digital assistant"
    on:click={() => (open = true)}
    tabindex="0"
    on:keydown={(e) => {
      if (e.key === "Enter") {
        open = true;
      }
    }}
  >
    <i class="ph-chat" />
  </div>
{:else}
  <Dialog />
  <div
    class="chat-open"
    on:click={() => (open = false)}
    tabindex="0"
    on:keydown={(e) => {
      if (e.key === "Enter") {
        open = false;
      }
    }}
  >
    <i class="ph-x" />
  </div>
{/if}

<style lang="scss">
  @use "../../styles/variables" as *;
  @use "../../styles/mixins" as *;

  .chat {
    position: fixed;
    bottom: 36px;
    right: 14px;
    height: 56px;
    width: 56px;
    background-color: $coolBlue;
    border-radius: 50%;
    cursor: pointer;
    // border: 1px solid #eaeaea;
    box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1015;

    @include desktop {
      bottom: 36px;
      right: 36px;
    }

    &:hover {
      transform: scale(1.1);
    }
  }

  i {
    font-size: 24px;
    color: white;
  }

  .chat-open {
    position: fixed;
    bottom: 36px;
    right: 14px;
    height: 56px;
    width: 56px;
    background-color: $coolBlue;
    border-radius: 50%;
    cursor: pointer;
    // border: 1px solid #eaeaea;
    box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1015;

    @include desktop {
      bottom: 36px;
      right: 36px;
    }

    &:hover {
      transform: scale(1.1);
    }
  }
</style>
