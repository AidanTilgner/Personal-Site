<script lang="ts">
    interface CarouselProps {
        items: {
            title: string;
            description: string;
            image: any;
            href: string;
        }[];
    }

    export let items: CarouselProps["items"];

    let current = 0;
    $: currentItem = items[current];
    let itemElement: HTMLElement;

    const fadeOutAnimation = async () => {
        await itemElement.animate(
            [
                {
                    opacity: 1,
                },
                {
                    opacity: 0,
                },
            ],
            {
                duration: 200,
                easing: "ease-in-out",
            }
        ).finished;
    };

    const slideImageAnimation = async (direction: "left" | "right") => {
        // animate itemElement sliding to the right or left
        await itemElement.animate(
            [
                {
                    transform: `translateX(${direction === "left" ? "100%" : "-100%"})`,
                    opacity: 0,
                },
                {
                    transform: "translateX(0)",
                    opacity: 1,
                },
            ],
            {
                duration: 200,
                easing: "ease-in-out",
                fill: "forwards",
            }
        ).finished;
    }

    const nextImage = async () => {
        await fadeOutAnimation();
        if (current < items.length - 1) {
            current++;
        } else {
            current = 0;
        }
        await slideImageAnimation("left");
    };

    const prevImage = async () => {
        await fadeOutAnimation();
        if (current > 0) {
            current--;
        } else {
            current = items.length - 1;
        }
        await slideImageAnimation("right");
    };
</script>

<div class="carousel">
    <div class="carousel-items">
        <div class="carousel-item" bind:this={itemElement} >
            <a href={currentItem.href || ""} target="_blank" >  
                <div class="carousel-item-image">
                    <img src={currentItem.image} alt={currentItem.title} />
                </div>
                <div class="carousel-item-overlay">   
                    <div class="carousel-item-overlay-content">
                        <h2>{currentItem.title}</h2>
                        <p>{currentItem.description}</p>
                    </div>
                </div>
            </a>
        </div>
    </div>
    <div class="buttons">
        <i 
            class="material-icons button left"
            title="Previous image"
            on:click={prevImage}
        >
            chevron_left
        </i>
        <i 
            class="material-icons button right"
            title="Next image"
            on:click={nextImage}
        >
            chevron_right
        </i>
    </div>
</div>

<style lang="scss">
    @use "../styles/mixins" as *;
    @use "../styles/variables" as *;

    .carousel {
        width: 100%;
        position: relative;
        overflow: hidden;

        &-items {
            width: 100%;
        }

        &-item {
            width: 100%;
            transition: all 0.5s ease-in-out;

            &-image {
                width: 100%;
                height: 100%;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            &-overlay {
                opacity: 0;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.45);
                transition: all 0.5s ease-in-out;

                &:hover {
                    opacity: 1;
                }

                &-content {
                    position: absolute;
                    top: 70%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    text-align: center;
                }
            }

        }

        .button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 26px;
            color: $accent;
            transition: all 0.2s ease-in-out;
            padding: 5px;
            border: 1px solid $accent;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);

            @include tablet {
                font-size: 32px;
            }

            &:hover {
                background-color: $accent;
                color: #fff;
            }

            &.left {
                left: 14px;

                @include tablet {
                    left: 24px;
                }

                @include desktop {
                    left: 36px;
                }
            }

            &.right {
                right: 14px;

                @include tablet {
                    right: 24px;
                }

                @include desktop {
                    right: 36px;
                }
            }
        }
    }
</style>
