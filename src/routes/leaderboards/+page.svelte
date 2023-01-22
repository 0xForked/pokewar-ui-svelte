<script lang="ts">
	import type { Rank } from "$lib/api/model";
	import { GET } from "$lib/api/rest";
	import { toTitleCase } from "$lib/utils/string";
	import { onMount } from "svelte";
  import Navigation from "$lib/components/navigation.svelte";
	import { goto } from "$app/navigation";
 
  const title = "leaderboards"

  // TODO: apply reactive stream
  let limit = 10
  let isLoading = false
  let ranks: Rank[] = []

  onMount(async function () {
    ranks = []
    isLoading = true
    await loadRanks()
  })

  async function loadRanks() {
    try {
      isLoading = true
      const resource = await GET(`ranks?limit=${limit}&offset=0`)
      const response = await resource.json()
      ranks = response.data
      isLoading = false
    } catch(err: any) {
      isLoading = false
      if (confirm(err)) {
        goto('/')
      }
    }
  }

  function getTypes(types: string[]): string {
    let data = ""
    types.forEach(type => {
      data += `<span class="rounded-full bg-gray-100 border border-gray-300 text-xs font-extralight px-2 text-gray-700">`+toTitleCase(type)+`</span>`
    })
    return data
  }
</script>

<svelte:head>
  <title>{toTitleCase(title)} | Pokewar - Pocket Monster Battleroyale</title> 
</svelte:head>

<section class="flex flex-col p-12 w-full h-full">
  <Navigation {title} />

  <div class="flex flex-col items-center justify-center">
    <div class="bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10">
      <div class="flex flex-row items-center justify-center mb-12 gap-2 w-full">
        <button on:click={() => {limit = 10; loadRanks()}} class="rounded-full {limit === 10 ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-red-700 hover:bg-red-10'}">
          <div id="top5rank" class="py-2 px-8 rounded-full">Top 10</div>
        </button>
        <button on:click={() => {limit = 25; loadRanks()}} class="rounded-full ml-4 sm:ml-8 {limit === 25 ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-red-700 hover:bg-red-10'}">
          <div id="top10rank"  class="py-2 px-8 rounded-full">Top 25</div>
        </button>
        <button on:click={() => {limit = 50; loadRanks()}} class="rounded-full ml-4 sm:ml-8 {limit === 50 ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-red-700 hover:bg-red-10'}">
          <div id="all-rank"  class="py-2 px-8 rounded-full">Top 50</div>
        </button>
      </div>
      <div class="mt-7 overflow-x-auto">
        {#if ranks.length > 0 && !isLoading}
          <table class="whitespace-nowrap" id="rank-list-table">
            <tbody>
              {#each ranks as rank, i}
                <tr tabindex="0" class="focus:outline-none h-16 border border-gray-100 rounded">
                  <td class="pl-5">
                    <div class="bg-gray-50 rounded-sm p-2">
                      <p class="mx-auto">#{rank.total_battles > 0 ? (i + 1) : ''}</p>
                    </div>
                  </td>
                <td>
                  <div class="flex flex-row gap-2 items-center">
                    <img class="h-6 w-6 ml-4" src={rank.avatar} alt="{rank.name}-avatar">
                    <div class="flex flex-col ml-2">
                      <p class="text-base font-medium leading-none text-gray-700 mr-2">{toTitleCase(rank.name)}</p>
                      <div class="flex flex-row gap-2 mt-2">{@html getTypes(rank.types)}</div>
                    </div>
                  </div>
                </td>
                <td class="pl-24">
                  <div class="flex items-center">
                    Play[<p class="text-sm leading-none text-yellow-600">{rank.total_battles}x</p>]
                  </div>
                </td>
                <td class="pl-5">
                  <div class="flex items-center">
                    Win[<p class="text-sm leading-none text-green-600">{rank.win_battles}x</p>]
                  </div>
                </td>
                <td class="pl-5">
                  <div class="flex items-center">
                    L[<p class="text-sm leading-none text-red-600">{rank.lose_battles}x</p>]
                  </div>
                </td>
                <td class="px-5">
                  <button class="py-3 px-3 text-sm focus:outline-none leading-none text-gray-700 bg-gray-100 rounded">{rank.points} pts</button>
                </td>
              </tr>
              <tr class="h-3"></tr>
              {/each}
            </tbody>
          </table>
        {/if}

        {#if ranks.length === 0 && !isLoading}
          <div class='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>Data Not Available </div>
        {/if}
      </div>
    </div>
  </div>

  {#if isLoading}
    <div class="text-center">loading please wait . . .</div>
  {/if}
</section>