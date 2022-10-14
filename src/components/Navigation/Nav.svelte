<script lang="ts">
    import Primary from "../Buttons/Primary.svelte";
    import Resume from "../../assets/files/aidan-tilgner-resume.pdf";
  import Secondary from "../Buttons/Secondary.svelte";

    let open = false;

    let openButton: HTMLElement | null = null;
    let overlayElement: HTMLElement | null = null;
    let closeButton: HTMLElement | null = null;

    const openMenu = async () => {
        await openButton?.animate(
            [
                {
                    opacity: 1,
                    transform: "scale(1)",
                },
                {
                    opacity: 0,
                    transform: "scale(0)",
                },
            ],
            {
                duration: 100,
                easing: "ease-in-out",
            }
        ).finished;
        open = true;
    };

    const closeMenu = async () => {
        await closeButton?.animate(
            [
                {
                    opacity: 1,
                    transform: "scale(1)",
                },
                {
                    opacity: 0,
                    transform: "scale(0)",
                },
            ],
            {
                duration: 200,
                easing: "ease-in-out",
            }
        ).finished && overlayElement?.animate(
            [
                {
                    opacity: 1,
                    transform: "translateY(0)",
                },
                {
                    opacity: 0,
                    transform: "translateY(-10%)",
                },
            ],
            {
                duration: 200,
                easing: "ease-in-out",
            }
        ).finished;
        open = false;
    };
</script>

{#if open}
    <div 
        class="overlay" 
        on:click={() => {
            closeMenu();
        }}
        bind:this={overlayElement}
    >
        <div class="nav">
            <div 
                class="close"
                on:click={() => {
                    closeMenu();
                }}
                on:keydown={(e) => {
                    if(e.key === "Enter") closeMenu();
                }}
                tabindex="0"
                role="button"
                bind:this={closeButton}
            >
                <i class="close-button material-icons">
                    close  
                </i>
            </div>
            <div class="links">
                <a href="/">Home</a>
                <a href="/skills">Skills</a>
                <a href="/projects">Projects</a>
                <a href="/contact">Contact</a>
            </div>
            <div class="buttons">
                <a href={Resume} target="_blank" >
                    <Primary 
                        text="Resume"
                        download
                    />
                </a>
                <a href="https://calendly.com/vvibrant/client-call" target="_blank" >
                    <Secondary
                        props={{
                            text: "Let's Call",
                            size: "lg"
                        }}
                    />
                </a>
            </div>
        </div>
    </div>
{:else}
    <div 
        class="menu"
        on:click={() => {
            openMenu();
        }}
        on:keydown={(e) => {
            if(e.key === "Enter") openMenu();
        }}
        tabindex="0"
        role="button"
        bind:this={openButton}
    >
        <i class="menu-button material-icons">
            menu  
        </i>
    </div>
{/if}

<style lang="scss">
    @use "../../styles/variables" as *;
    @use "../../styles/mixins" as *;

    @keyframes overlay-in {
        0% {
            opacity: 0;
            top: calc(50%);
            right: 14px;
            height: 0;
            width: 0;
            left: initial;
            bottom: initial;
            border-radius: 50%;
        }
        100% {
            opacity: 1;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            height: initial;
            width: initial;
            border-radius: 0;
        }
    }

    @keyframes link-in {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes button-in {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes open-in {
        0% {
            opacity: 0;
            transform: scale(0);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;

        animation-name: overlay-in;
        animation-duration: .2s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
    }

    .nav {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: white;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 20px;

        .links {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 20px;

            a {
                font-size: 30px;
                color: $accent;
                text-decoration: none;
                margin: 10px 0;
                animation-name: link-in;
                animation-duration: .5s;
                animation-fill-mode: forwards;
                animation-timing-function: ease-in-out;
                transition: all .2s ease-in-out;

                &:hover {
                    padding: 4px 0;
                    font-weight: 500;
                }
            }
        }

        .buttons {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 56px;

            animation-name: button-in;
            animation-duration: .4s;
            animation-fill-mode: forwards;
            animation-timing-function: ease-in;


            @include desktop {
                flex-direction: row;
                margin-top: 82px;
            }

            a {
                &:first-child {
                    margin-bottom: 14px;

                    @include desktop {
                        margin-bottom: 0;
                        margin-right: 20px;
                    }
                }
            }
        }
    }

    .close {
        position: fixed;
        top: calc(40%);
        right: 14px;
        z-index: 1000;
        cursor: pointer;
        display: flex;
        border-radius: 50%;
        background-color: white;
        border: 1px solid #eaeaea;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 56px;
        height: 56px;
        box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.1);
        
        &-button {
            font-size: 30px;
            color: $accent;
        }
    }

    .menu {
        position: fixed;
        // halfway from the top
        top: calc(40%);
        right: 14px;
        z-index: 1000;
        cursor: pointer;
        display: flex;
        border-radius: 50%;
        background-color: white;
        border: 1px solid #eaeaea;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 56px;
        height: 56px;
        box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.1);
        animation-name: open-in;
        animation-duration: .2s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
        
        &-button {
            font-size: 30px;
            color: $accent;
        }
    }
</style>