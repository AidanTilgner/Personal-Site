<script lang="ts">
  export let handleClick: (e: any) => void;
  export let text: string | undefined;
</script>

<button on:click={handleClick}>
  <span
    >{#if text}
      {text}
    {:else}
      <slot />
    {/if}
  </span>
  <i class="material-symbols-outlined icon">chevron_right</i>
</button>

<style lang="scss">
  button {
    background: #fff;
    border: none;
    padding: 10px 0;
    width: 150px;
    color: black;
    font-size: 16px;
    font-family: "Quicksand", sans-serif;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
    border-radius: 99px;

    span {
      margin-right: 4px;
    }

    &:hover {
      .icon {
        animation-name: slide-right;
        animation-duration: 0.2s;
        animation-fill-mode: forwards;
        transition: all 0.2s ease-in-out;
      }
    }

    &:not(hover) {
      .icon {
        animation-name: slide-left;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        // transition: all 0.2s ease-in;
      }
    }

    &:active {
      transform: scale(0.95) translateY(2px);
      transition: all 0.2s ease-in-out;
    }
  }

  .icon {
    font-size: 22px;
    color: #3d6eff;
  }

  @keyframes slide-right {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(8px);
    }
  }
</style>
