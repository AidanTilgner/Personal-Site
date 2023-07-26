<script lang="ts">
</script>

<div class="sidebar">sidebar</div>

<style lang="scss">
  .sidebar {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 22.4rem;
    box-sizing: border-box;
    backdrop-filter: blur(5px);
    z-index: 100;
    background-color: rgba(var(--background-color), 0.2);

    @media (min-width: 768px) {
      display: flex;
    }
  }
</style>
