<script lang="ts"></script>

<div class="group">
    <slot/>
</div>

<style lang="scss">
    @use "../../styles/mixins" as *;

    .group {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      @include desktop {
        flex-direction: row;
        align-items: center;
      }
    }
</style>