<script lang="ts">
    export let text: string = "";
</script>

<button>
    <span>
        {#if text}
            {text}
        {:else}
            <slot />
        {/if}
    </span>
    <i class="material-icons icon">keyboard_arrow_right</i>
</button>

<style lang="scss">
    @use "../../styles/variables" as *;

    button {
        background-color: transparent;
        color: #000;
        /* box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15); */
        border-radius: 99px;
        border: none;
        width: 150px;
        padding: 10px 0;
        font-size: 18px;
        font-family: "Quicksand", sans-serif;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        transition: all 0.2s ease-in-out;
    }

    button:hover {
        /* The icon should move to the right */
        .icon {
            transition: all 0.2s ease-in-out;
            transform: translateX(8px);
        }
        span {
            color: $accent;
        }
    }

    .icon {
        font-size: 22px;
        color: $accent;
        margin-left: 8px;
    }

    button:active {
        .icon {
            transition: all 0.1s ease-in-out;
            transform: translateX(16px) scale(0.5);
            opacity: 0;
            margin: 0;
        }

        span {
            transition: all 0.1s ease-in-out;
            transform: scale(0.95) translateX(8px)
        }
    }
</style>