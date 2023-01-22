<script lang="ts">
	import { GET } from "$lib/api/rest";
	import { toTitleCase } from "$lib/utils/string";
	import { onMount } from "svelte";
  import Navigation from "$lib/components/navigation.svelte";
  import type { Monster } from "$lib/api/model";
	import MonsterCard from "$lib/components/monster.svelte";
	import { goto } from "$app/navigation";
  
  let title = "monsters"
  
  // TODO: apply reactive stream
  const maxSyncThresholds = 120
  const limit = 8
  let totalData = 0
  let offset = 0
  let isLoading = false
  let monsters: Monster[] = []
  let temps: Monster[] = []
	let searchTerm = "";

  onMount(async function () {
    monsters = []
    isLoading = true
    await loadMonsters()
  })

  const loadMonsters = async () => {
    try {
      const resource = await GET(`monsters?limit=${limit}&offset=${offset}`)
      const response = await resource.json()
      const data = response.data as Monster[]
      monsters = monsters.concat(data)
      temps = monsters
      isLoading = false
      offset = offset + data.length
      title = `monsters (${monsters.length})`
      totalData = response.total_data
    } catch(err: any) {
      isLoading = false
      if (confirm(err)) {
        goto('/')
      }
    }
  }

  const syncMonsters = async () => { 
    try {
      if (confirm("Are you sure want to add more data?!") === true) {
        const resource = await GET('monsters/sync')
        const response = await resource.json()
        const data = response.data as Monster[]
        monsters = monsters.concat(data)
        temps = monsters
        isLoading = false
        offset = offset + data.length
        title = `monsters (${monsters.length})`
        totalData = response.total_data
      }
    } catch (err: any) {
      isLoading = false
      if (confirm(err)) {
        //goto('/')
      }
    }
  }

  // For Search Input
  const searchMonster = () => monsters = (searchTerm !== "")
    ? temps.filter(monster =>
        monster.name.toLowerCase()
            .includes(searchTerm.toLowerCase()))
    : temps
</script>

<svelte:head>
  <title>{toTitleCase(title)} | Pokewar - Pocket Monster Battleroyale</title> 
</svelte:head>

<section class="flex flex-col p-12 w-full h-full">
  <Navigation {title} />
  <div class="py-4 md:py-7 px-4 md:px-8 xl:px-10 w-full">
    <div class="flex flex-row items-center justify-center mb-12 gap-2 w-full">
      <div class="relative text-gray-400 focus-within:text-gray-600">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2 p-1 focus:outline-none focus:shadow-outline">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <label for="search"></label>
        <input bind:value={searchTerm} on:input={searchMonster} type="search" name="search" id="search" class="py-2 text-sm text-black bg-white rounded-md pl-10 pr-2 border-solid border-2 border-gray-400 focus:bg-white focus:border-gray-600 focus:outline-none" placeholder="Search..." autocomplete="off">
      </div>
      {#if monsters.length === 0 || totalData < maxSyncThresholds}
        <button on:click={syncMonsters} class="px-4 py-[8px] rounded-md border-solid border-2 text-gray-600 border-gray-400 bg-gray-100 flex items-center gap-2 hover:bg-gray-200 focus:bg-gray-600 focus:text-white text-sm" id="sync-monster-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          More (+8)
        </button>
      {/if}
    </div>

    {#if monsters.length > 0}
      <div class="flex flex-wrap gap-8 w-full items-center justify-center">
        {#each monsters as monster}
          <MonsterCard {monster} isMiniCard={false} />
        {/each}
      </div>
    {/if}

    {#if isLoading}
      <div class="text-center">loading please wait . . .</div>
    {/if}
   
    {#if totalData > 0 && monsters.length < totalData && searchTerm === ""}
      <div class="flex my-8 w-full">
        <button class="mx-auto font-bold cursor-pointer tracking-tighter text-black border-b-2 border-red-200 hover:border-red-400" on:click={loadMonsters}>Load more . . .</button>
      </div>
    {/if}
  </div>
</section>