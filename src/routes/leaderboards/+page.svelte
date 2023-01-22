<script lang="ts">
	import type { Rank } from "$lib/api/model";
	import { GET } from "$lib/api/rest";
	import { toTitleCase } from "$lib/utils/string";
	import { onMount } from "svelte";
  import Navigation from "$lib/components/navigation.svelte";
 
  const title = "leaderboards"

  // TODO: apply reactive stream
  const limit = 10
  let offset = 0
  let isLoading = false
  let ranks: Rank[] = []

  onMount(async function () {
    ranks = []
    isLoading = true
    await loadRanks()
  })

  async function loadRanks() {
    try {
      const resource = await GET('ranks', limit, offset).then()
      const response = await resource.json()
      const data = response.data
      console.log(data)
      ranks = ranks.concat(data)
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

  {#if ranks.length > 0}
    {#each ranks as rank}
      <div class="text-center">{rank.name} {rank.points}</div>
    {/each}
  {/if}

  {#if isLoading}
    <div class="text-center">loading please wait . . .</div>
  {/if}
</section>