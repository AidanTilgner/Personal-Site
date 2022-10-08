<script lang="ts">
  import Primary from "../../../lib/components/Buttons/Primary.svelte";
  import Secondary from "../../../lib/components/Buttons/Secondary.svelte";
</script>

<div class="hero">
  <div class="text">
    <div class="title">
      <p>Hello there...</p>
      <p>I'm <strong>Aidan</strong></p>
    </div>
    <div class="tagline">
      <p>A Software <span class="special">Developer</span></p>
    </div>
  </div>
  <div class="buttons">
    <div class="button-container">
      <Primary
        handleClick={() => {
          console.log("Clicked");
        }}
        text="">Let's Talk</Primary
      >
    </div>
    <div class="button-container">
      <Secondary
        handleClick={() => {
          console.log("Clicked");
        }}
        text="">My Work</Secondary
      >
    </div>
  </div>
</div>

<style lang="scss">
  .hero {
    height: 100vh;
    box-shadow: 0px 2px 56px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .title {
    text-align: center;
    p {
      font-size: 36px;
      margin: 0;
      font-weight: 300;
      margin-bottom: 24px;
    }
  }

  .tagline {
    text-align: center;
    margin-top: 56px;
    p {
      font-size: 28px;
      margin: 0;
      font-weight: 300;

      .special {
        color: #3d6eff;
      }
    }
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .button-container {
    margin-top: 20px;
  }
</style>
