<script lang="ts">
    export let text: string = "", download: boolean = false;
    let buttonElement: HTMLButtonElement;

    let downloading: boolean = false;

    const handleClick = () => {
        if (download) {
            downloading = true;
            setTimeout(() => {
                downloading = false;
            }, 1500);
        }
    };
</script>

<button 
    bind:this={buttonElement}
    on:click={handleClick}
>
    {#if download}
        <i class="material-icons">expand_more</i>
    {/if}
    {#if text}
        {text}
    {:else}
        <slot />
    {/if}
    {#if downloading}
        <div class="shadow"></div>
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
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
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

    .shadow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .25);
        animation-name: shadow;
        animation-duration: 1.5s;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
    }

    @keyframes shadow {
        0% {
            width: 0;
            background-color: rgba(0, 0, 0, .25);
        }
        97% {
            width: 100%;
            background-color: rgba(0, 0, 0, .05);
        }
        100% {
            background-color: rgba(0, 0, 0, 0);
        }
    }
</style>