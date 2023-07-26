<script lang="ts">
  import { onMount } from "svelte";

  let mouseTrailerElement: HTMLElement;

  const followMouse = (e: MouseEvent) => {
    const x = e.clientX - mouseTrailerElement.offsetWidth / 2,
      y = e.clientY - mouseTrailerElement.offsetHeight / 2;

    const keyframes = {
      transform: `translate(${x}px, ${y}px)`,
    };
    mouseTrailerElement.animate(keyframes, {
      duration: 5000,
      fill: "forwards",
      easing: "ease-in-out",
    });
  };

  onMount(() => {
    window.addEventListener("mousemove", followMouse);

    // when the body's hover event is true, the mouse trailer is visible, otherwise it's hidden
    document.body.addEventListener("mouseenter", () => {
      mouseTrailerElement.style.opacity = ".35";
    });
    document.body.addEventListener("mouseleave", () => {
      mouseTrailerElement.style.opacity = "0";
    });
  });
</script>

<div id="mousetrailer" bind:this={mouseTrailerElement}>
  <div class="background" />
  <div class="overlay" />
</div>

<style lang="scss">
  @use "../../styles/variables" as *;

  #mousetrailer {
    position: fixed;
    width: 50vw;
    aspect-ratio: 1/1;
    border-radius: 50%;
    pointer-events: none;
    transition: opacity 1s ease;
    opacity: 0;
    overflow: hidden;
  }

  .background {
    width: 100%;
    height: 100%;
    background-image: radial-gradient(
      100% 100% at 50% 50%,
      rgba($primaryColor, 0.35) 0%,
      rgba($accentColor, 0.5) 35%,
      rgba(0, 0, 0, 0) 50%
    );
  }
</style>
