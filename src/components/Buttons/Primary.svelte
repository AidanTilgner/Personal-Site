<script lang="ts">
    export let text: string = "";
</script>

<button>
    {#if text}
        {text}
    {:else}
        <slot />
    {/if}
</button>

<style lang="scss">
    @use "../../styles/variables" as *;

    button {
        background-color: $accent;
        color: #fff;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15);
        border-radius: 99px;
        border: none;
        width: 150px;
        padding: 10px 0;
        font-size: 18px;
        font-family: "Quicksand", sans-serif;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        font-weight: 500;
    }

    button:hover {
        background-color: #2B55D8;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.25);
        transform: scale(1.02);
    }

    button:active {
        background-color: #1A3DA1;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.35);
        transform: scale(0.98) translateY(2px);
    }
</style>