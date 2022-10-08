<script lang="ts">
  export let url: string;
  import { onMount, onDestroy } from "svelte";
  import { Router, Route, navigate } from "svelte-routing";
  import { currentPath } from "@lib/stores/env";
  import { globalHistory } from "svelte-routing/src/history";
  import { initSocket } from "@src/bootstrap/socket.io";
  import { messages } from "@lib/stores/socket";
  import { dispatchAlert } from "@lib/stores/alerts";

  import AlertProvider from "./lib/components/Alerts/AlertProvider.svelte";
  import Navbar from "./lib/components/Navbar/Navbar.svelte";

  import Landing from "./pages/Landing/Landing.svelte";

  initSocket();

  let unsubscribe: () => void;
  onMount(() => {
    unsubscribe = globalHistory.listen(({ location, action }) => {
      $currentPath = location.pathname;
    });

    navigate($currentPath);
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<main>
  <AlertProvider />
  <Navbar />
  <Router {url}>
    <div class="content-container">
      <Route path="/" component={Landing} />
    </div>
  </Router>
</main>

<style lang="scss">
</style>
