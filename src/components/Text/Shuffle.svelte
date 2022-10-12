<script lang="ts">
    import { onMount } from "svelte";

    interface ShuffleTextProps {
        options: {
            text: string;
        }[];
        delay: number;
        animationType: "fade" | "text-retract";
    }

    export let options: ShuffleTextProps['options'];
    export let delay: ShuffleTextProps['delay'] = 5000;
    export let animationType: ShuffleTextProps['animationType'] = "fade";

    let currentText: string = options[0].text;
    let element: HTMLElement | null = null;

    const retractText = async () => {
        // go through each letter and remove it from the text
        for (let i = 0; i < currentText.length; i++) {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    currentText = currentText.slice(0, -1);
                    resolve();
                }, 100);
            });
        }
    }

    const placeText = async () => {
        // go through each letter and add it to the text
        for (let i = 0; i < options[0].text.length; i++) {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    currentText += options[0].text[i];
                    resolve();
                }, 100);
            });
        }
    }

    const shuffle = () => {
        if(!(options.length > 1)) {
            return;
        }
        // set currenttext to the next text in the array
        const currentIndex = options.findIndex((option) => option.text === currentText);
        const nextIndex = currentIndex + 1 >= options.length ? 0 : currentIndex + 1;
        currentText = options[nextIndex].text;
    }

    const fadeoutAnimation = async (el: HTMLElement) => {
        return new Promise<void>((resolve) => {
            el.animate([
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: 500,
                easing: "ease-in-out"
            }).onfinish = () => {
                resolve();
            }
        });
    }

    const fadeinAnimation = async (el: HTMLElement) => {
        return new Promise<void>((resolve) => {
            el.animate([
                { opacity: 0 },
                { opacity: 1 }
            ], {
                duration: 500,
                easing: "ease-in-out"
            }).onfinish = () => {
                resolve();
            }
        });
    }

    const animation = async () => {
        switch(animationType) {
            case "fade":
                await fadeoutAnimation(element!);
                shuffle();
                await fadeinAnimation(element!);
                break;
            case "text-retract":
                await retractText();
                shuffle();
                await placeText();
                break;
        }
    }
    
    onMount(() => {
        const interval = setInterval(async () => {
            if(element) {
                await fadeoutAnimation(element);
                shuffle();
                await fadeinAnimation(element);
            }
        }, delay);

        return () => {
            clearInterval(interval);
        }
    });
</script>

<span bind:this={element}>
    {@html currentText}
</span>

<style lang="scss">
    span {
        display: inline-block;
        transition: all 0.5s ease;
    }
</style>

