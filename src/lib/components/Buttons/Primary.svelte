<script lang="ts">
  export let handleClick: (e: any) => void;
  export let text: string | undefined;
</script>

<button on:click={handleClick}>
  {#if text}
    {text}
  {:else}
    <slot />
  {/if}
</button>

<style lang="scss">
  button {
    background: #3d6eff;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15);
    border-radius: 99px;
    transition: all 0.2s ease-in-out;
    border: none;
    padding: 10px 0;
    width: 150px;
    color: white;
    font-size: 16px;
    font-family: "Quicksand", sans-serif;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.25);
      transform: scale(1.05);
      background-color: #3158cc;
    }

    &:active {
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.35);
      transform: scale(0.95);
    }
  }
</style>
