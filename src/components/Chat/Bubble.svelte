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
      padding: 14px 14px;
      border-radius: 10px;

      &.to {
        background-color: $cool-blue;
        color: white;
      }

      &.from {
        background-color: white;
        color: $cool-blue;
      }

      &__text {
        font-size: 1rem;
        font-weight: 400;
      }

      &__time {
        font-size: 0.75rem;
        font-weight: 300;
        margin-top: 0.25rem;
      }
    }
  }
</style>
