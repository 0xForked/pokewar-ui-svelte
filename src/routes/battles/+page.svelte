<script lang="ts">
	import { GET } from "$lib/data/rest";
	import { toTitleCase } from "$lib/utils/string";
	import { onDestroy, onMount } from "svelte";
  import Navigation from "$lib/components/navigation.svelte";
	import type { Battle } from "$lib/data/model";
	import BattleCard from "$lib/components/battle.svelte";

  let title = "battles"

  // TODO: apply reactive stream
  let limit = 6
  let offset = 0
  let isLoading = false
  let battles: Battle[] = []

  onMount(async function () {
    battles = []
    await loadBattles()
  })

  async function loadBattles() {
    try {
      if (battles.length >= limit) {
        battles = battles.splice(0, limit)
        return
      }
      
      isLoading = true
      const resource = await GET(`battles?limit=${limit}&offset=${offset}`)
      const response = await resource.json()
      battles = response.data
      isLoading = false
    } catch(err: any) {
      alert(err)
      isLoading = false
    }
  }

  onDestroy(() => {
    battles = []
	});
</script>

<svelte:head>
  <title>{toTitleCase(title)} | Pokewar - Pocket Monster Battleroyale</title> 
</svelte:head>

<!-- TODO: apply styles card UI -->
<section class="flex flex-col p-12 w-full h-full">
  <Navigation {title} />

  <div class="flex flex-col w-full">
    <div class="sm:flex items-center justify-between w-full py-4 md:py-7 px-4 md:px-8 xl:px-10">
      <div class="flex flex-row items-center justify-center mb-12 gap-2 w-full">
        <button on:click={() => {limit = 6; loadBattles()}} class="rounded-full {limit === 6 ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-red-700 hover:bg-red-10'}">
          <div id="top5rank" class="py-2 px-8 rounded-full">Last 6</div>
        </button>
        <button on:click={() => {limit = 12; loadBattles()}} class="rounded-full ml-4 sm:ml-8 {limit === 12 ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-red-700 hover:bg-red-10'}">
          <div id="top10rank"  class="py-2 px-8 rounded-full">Last 12</div>
        </button>
        <button on:click={() => {limit = 24; loadBattles()}} class="rounded-full ml-4 sm:ml-8 {limit === 24 ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-red-700 hover:bg-red-10'}">
          <div id="all-rank"  class="py-2 px-8 rounded-full">Last 24</div>
        </button>
      </div>

      <!-- TODO ADD DATE RANGE -->
    </div>
    <div class="mt-7 flex flex-wrap gap-8 items-center justify-center w-full">
      {#if battles.length > 0 && !isLoading}
        {#each battles as battle}
          <BattleCard {battle} />
        {/each}
      {/if}

      {#if battles.length === 0 && !isLoading}
        <div class='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>Data Not Available </div>
      {/if}
    </div>
  </div>

  {#if isLoading}
    <div class="text-center">loading please wait . . .</div>
  {/if}
</section>