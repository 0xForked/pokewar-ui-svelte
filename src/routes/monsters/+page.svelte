<script lang="ts">
	import { GET } from "$lib/api/rest";
	import { toTitleCase } from "$lib/utils/string";
	import { onMount } from "svelte";
  import Navigation from "$lib/components/navigation.svelte";
  import type { Monster } from "$lib/api/model";
  
  let title = "monsters"
  
  // TODO: apply reactive stream
  const limit = 10
  let offset = 0
  let isLoading = false
  let monsters: Monster[] = []

  onMount(async function () {
    monsters = []
    isLoading = true
    await loadMonsters()
  })

  async function loadMonsters() {
    try {
      const resource = await GET('monsters', limit, offset).then()
      const response = await resource.json()
      const data = response.data as Monster[]
      monsters = monsters.concat(data)
      isLoading = false
      offset = offset + data.length
      title = `monsters(${monsters.length})`
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

  {#if monsters.length > 0}
    {#each monsters as monster}
      <div class="text-center">{monster.name}</div>
    {/each}
  {/if}

  {#if isLoading}
    <div class="text-center">loading please wait . . .</div>
  {/if}
   
  {#if monsters.length > 0 && monsters.length < 150}
    <button on:click={loadMonsters}>Load more ...</button>
  {/if}
</section>