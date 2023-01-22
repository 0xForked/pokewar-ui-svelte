<script lang="ts">
	import { toTitleCase } from "$lib/utils/string";
  import Navigation from "../../lib/components/navigation.svelte";
  let title = "playground"
</script>

<svelte:head>
  <title>{toTitleCase(title)} | Pokewar - Pocket Monster Battleroyale</title> 
</svelte:head>

<section class="flex flex-col p-12 w-screen h-screen">
  <Navigation {title} />

  playground
</section>