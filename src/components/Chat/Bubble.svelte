<script lang="ts">
  export let type: "from" | "to";
  export let message: string;
</script>

<div class="message {type}">
  <div class="message__content {type}">
    <div class="message__content__text">
      {message}
    </div>
  </div>
</div>

<style lang="scss">
  @use "../../styles/variables" as *;

  .message {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 24px 0;

    &.from {
      align-items: flex-end;
    }

    &.to {
      align-items: flex-start;
    }

    &__content {
      box-shadow: 0.2px 0.2px 10px 0 rgba($color: #000000, $alpha: 0.1);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      max-width: 80%;
      padding: 14px 24px;
      border-radius: 5px;
      text-align: left;
      animation-name: bubble-in;
      animation-duration: 0.3s;
      animation-fill-mode: forwards;
      animation-timing-function: ease-out;

      &.to {
        background-color: $cool-blue;
        color: white;
      }

      &.from {
        background-color: white;
        color: $cool-blue;
      }

      &__text {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }

  @keyframes bubble-in {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
