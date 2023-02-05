<script lang="ts">
    import type { Monster, Skill, Stat } from "$lib/data/model";
	import { toTitleCase } from "$lib/utils/string";

  export let monster: Monster;
  export let isMiniCard = false;

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
  <slot />
</div>
