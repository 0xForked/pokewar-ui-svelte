<script lang="ts">
	import type { Monster, Skill, Stat } from "$lib/data/model";
	import { toTitleCase } from "$lib/utils/string";

  export let monster: Monster;
  export let isMiniCard: boolean = false;
  export let displayAnnulledButton: boolean = false;
  export let handleAnnulled: any
  const onAnnulled = (id: number) =>  handleAnnulled(id)

  const getHP = (stats: Stat[]): string => {
    let hp = ""
    stats.forEach(data => {
      if (data.name === 'hp') {
        hp = `${data.name.toUpperCase()}(${data.base_stat})`
      }
    })
    return hp
  }
  const skills = (skills: Skill[]) => skills.map((item, i) => 
    '<br>' + (i+1) + `. ${toTitleCase(item.name)} (${item.pp})`) 
  const cardWidth = isMiniCard ? "w-54" : "w-72"
  const imgSize = isMiniCard ? "w-20 h-20" : "w-32 h-32"
</script>

<div class="flex flex-col">
  <div class="{cardWidth} border border-gray-200 rounded-lg shadow-md">
    <div class="bg-gray-800 text-white p-4">
      <h2 class="text-2xl font-bold">{toTitleCase(monster.name)} - {getHP(monster.stats)}</h2>
    </div>
    <div class="display flex flex-row">
    <img
      src={monster.avatar}
      alt={`${monster.name}-avatar`}
      class="mt-4 {imgSize} mx-auto"
    />
    </div>
    <div class="p-4">
        <p class="font-bold text-lg">
          Type:
          <span class="font-normal">{monster.types}</span>
        </p>
        <p class="font-bold text-lg">
          Skills:
          <span class="font-normal">{@html skills(monster.skills)}</span>
        </p>
    </div>
  </div>
  
  {#if monster.rank != undefined && monster.point != undefined}
  <div class="flex flex-col">
    <div class="mt-4 flex flex-row border-2 border-solid divide-x divide-solid w-full">
      <div class="basis-1/2 w-full text-center py-6">#{monster.rank}</div>
      <div class="basis-1/2 w-full text-center py-6">{monster.point} pts</div>
    </div>
    {#if displayAnnulledButton}
      <button class="mt-4 px-4 py-[8px] rounded-md border-solid border-2 text-red-600 border-red-400 bg-red-100 flex items-center justify-center gap-2 hover:bg-red-200 focus:bg-red focus:text-white text-sm disabled:bg-red-100  disabled:opacity-25" on:click={() => onAnnulled(monster.id)}>ANNULLED</button>
    {/if}
  </div>
  {/if}
</div>
