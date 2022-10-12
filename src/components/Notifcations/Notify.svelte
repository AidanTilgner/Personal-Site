<script lang="ts">
    interface Props {
        type: "success" | "error" | "info";
        text: string;
        timeout: number;
        show: boolean;
        onClose: () => void;
    }

    export let type: Props["type"];
    export let text: Props["text"];
    export let timeout: Props["timeout"];
    export let onClose: Props["onClose"];
    export let show: Props["show"];

    let showing = show;
    let notifyElement: HTMLElement;

    const handleClose = async () => {
        await closeAnimation();
        showing = false;
        onClose();
    };

    const closeAnimation = async () => {
        if (!notifyElement) return;
        await notifyElement.animate(
            [
                {
                    transform: "translateY(0)",
                    opacity: 1,
                },
                {
                    transform: "translateY(-100%)",
                    opacity: 0,
                },
            ],
            {
                duration: 500,
                easing: "ease-in-out",
            }
        ).finished;
    }

    $: if (timeout && show) {
        setTimeout(() => {
            handleClose();
        }, timeout);
    }
</script>

{#if show}
    <div class="notification {type}" bind:this={notifyElement} >
        <p>{text}</p>
        <i 
            class="material-icons close-button"
            on:click={handleClose}
        >close</i>
    </div>
{/if}

<style lang="scss">
    @use "../../styles/mixins" as *;
    @use "../../styles/variables" as *;

    @keyframes slide-in {
        0% {
            transform: translateY(-100%);
        }
        100% {
            transform: translateY(0);
        }
    }

    .notification {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        padding: 12px;
        // background-color: white;
        // color: $accent;
        text-align: center;
        z-index: 100;
        box-shadow: .2px .2px 10px rgba(0, 0, 0, .2);
        animation: slide-in .5s ease-in;
        box-sizing: border-box;

        @include desktop {
            padding: 24px;
        }
    }

    .close-button {
        position: absolute;
        top: calc(50% - 12px);
        right: 24px;
        cursor: pointer;
        transition: all .2s ease-in-out;
        color: white;
        text-shadow: 1px 1px 1px rgba(0, 0, 0, .1);

        &:hover {
            text-shadow: 1px 1px 1px rgba(0, 0, 0, .2);
        }
    }

    .success {
        background-color: $accent;
        color: white;
    }

    .error {
        background-color: $red;
        color: white;
    }

    .info {
        background-color: white;
        color: $accent;
        // border: 1px solid $accent;

        .close-button {
            color: $accent;
        }
    }
</style>