<script lang="ts">
    import type { Size } from "@/types/main";
    interface SecondaryButtonProps {
        // passes an event to handle the click
        handleClick: (event: MouseEvent) => void
        size: Size
        text?: string;
        align?: "right" | "left" | "center";
        padded?: boolean;
    }

    export let props: SecondaryButtonProps;
    console.log("Props: ", props);
    const {
        text,
        handleClick,
        size = "lg",
        align = "center",
        padded = true
    } = props; 

    const alignMappings = {
        right: "flex-end",
        left: "flex-start",
        center: "center",
    }
    const paddedMappings: {
        [key: string]: string;
    } = {
        true: "10px 0",
        false: "0",
    }
</script>

<button
    class="secondary"
    on:click={(e) => {
        if(!handleClick) return;
        handleClick(e);
    }}
    style="justify-content: {alignMappings[align]};padding: {paddedMappings[padded.toString()]};"
>
    <span
        class="text-{size}"
    >
        {#if text}
            {text}
        {:else}
            <slot />
        {/if}
    </span>
    <i 
        class="material-icons icon material-icon-{size}"
    >
        keyboard_arrow_right
    </i>
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
        font-family: "Quicksand", sans-serif;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        display: flex;
        align-items: center;
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
        color: $accent;
        margin-left: 8px;
    }

    button:active {
        .icon {
            transition: all 0.05s ease-in-out;
            transform: translateX(16px) scale(0.5);
            opacity: 0;
            margin: 0;
        }

        span {
            transition: all 0.05s ease-in-out;
            transform: scale(0.95) translateX(8px)
        }
    }
</style>