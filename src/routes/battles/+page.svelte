<script lang="ts">
	import { GET } from "$lib/api/rest";
	import { toTitleCase } from "$lib/utils/string";
	import { onMount } from "svelte";
  import Navigation from "$lib/components/navigation.svelte";
	import type { Battle } from "$lib/api/model";

  let title = "battles"

  // TODO: apply reactive stream
  const limit = 10
  let offset = 0
  let isLoading = false
  let battles: Battle[] = []

  onMount(async function () {
    battles = []
    isLoading = true
    await loadBattles()
  })

  async function loadBattles() {
    try {
      const resource = await GET('battles', limit, offset).then()
      const response = await resource.json()
      const data = response.data
      console.log(data)
      battles = battles.concat(data)
      isLoading = false
      offset = offset + data.length
    } catch(err: any) {
      alert(err)
      isLoading = false
    }
  }
</script>

<svelte:head>
  <title>{toTitleCase(title)} | Pokewar - Pocket Monster Battleroyale</title> 
</svelte:head>

<!-- TODO: apply styles card UI -->
<section class="flex flex-col p-12 w-screen h-screen">
  <Navigation {title} />

  {#if battles.length > 0}
    {#each battles as battle}
      <div class="text-center">{battle.id}</div>
    {/each}
  {/if}

  {#if isLoading}
    <div class="text-center">loading please wait . . .</div>
  {/if}
</section>