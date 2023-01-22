<script lang="ts">
	import type { Battle } from "$lib/api/model";
	import { diffTime, formatDate, formatTime } from "$lib/utils/datetime";
	import { toTitleCase } from "$lib/utils/string";
  export let battle: Battle
</script>

<div class="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md h-fit divide-y ">
  <div class="pokemon-header text-black p-4">
    <h2 class="pokemon-name text-2xl font-bold">Battle</h2>
    <p class="pokemon-number font-medium">#{battle.id}</p>
  </div>
  <div class="pokemon-header bg-gray-800 text-white p-4">
    <h1 class="text-lg font-semibold">{formatDate(battle.started_at)}</h1>
    <p class="italic font-light">{formatTime(battle.started_at)} - {formatTime(battle.ended_at)}</p>
    <div class="flex flex-row gap-2 mt-4">
      <button class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-100 hover:border-gray-200 rounded-lg  gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {diffTime(battle.ended_at, battle.started_at, false, 's')}
      </button>
      <button class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-100 hover:border-gray-200 rounded-lg gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path d="M19.889,12.818l-1.414,1.414c-0.195,0.195-0.512,0.195-0.707,0s-0.195-0.512,0-0.707l1.414-1.414 c0.195-0.195,0.512-0.195,0.707,0C20.084,12.306,20.084,12.623,19.889,12.818z M16.353,15.647c-0.195-0.195-0.512-0.195-0.707,0 l-1.414,1.414c-0.195,0.195-0.195,0.512,0,0.707s0.512,0.195,0.707,0l1.414-1.414C16.549,16.158,16.549,15.842,16.353,15.647z M12.818,19.182c-0.195-0.195-0.512-0.195-0.707,0l-1.414,1.414c-0.195,0.195-0.195,0.512,0,0.707s0.512,0.195,0.707,0l1.414-1.414 C13.013,19.694,13.013,19.377,12.818,19.182z M28.374,11.404l-1.414,1.414c-0.195,0.195-0.512,0.195-0.707,0l-1.736-1.736 l-14.498,17.26c-0.073,0.087-0.174,0.147-0.285,0.169l-7.071,1.414c-0.164,0.033-0.334-0.019-0.452-0.137 c-0.118-0.118-0.17-0.288-0.137-0.452l1.414-7.071c0.022-0.111,0.082-0.212,0.169-0.285l17.26-14.498l-1.736-1.736 c-0.195-0.195-0.195-0.512,0-0.707l1.414-1.414c0.195-0.195,0.512-0.195,0.707,0l1.768,1.768l3.182-3.182 c0.195-0.195,0.512-0.195,0.707,0l2.828,2.828c0.195,0.195,0.195,0.512,0,0.707l-3.182,3.182l1.768,1.768 C28.57,10.892,28.57,11.208,28.374,11.404z M23.778,6.101l2.121,2.121l2.828-2.828l-2.121-2.121L23.778,6.101z M23.808,10.373 l-2.18-2.18L4.435,22.634l-1.233,6.164l6.164-1.233L23.808,10.373z M27.314,11.05L20.95,4.686l-0.707,0.707l6.364,6.364 L27.314,11.05z"/>
        </svg>
        {battle.logs.length}x
      </button>
    </div>
  </div>
  <div class="p-4">
    <table class="w-full whitespace-nowrap">
      <tbody>
        {#each battle.players as player}
          <tr tabindex="0" class="focus:outline-none h-16 border border-gray-100 rounded {player.annulled_at === 0 ? '' : 'bg-red-100'}">
            <td class="pl-4">
              <p class="mx-auto">{player.annulled_at > 0 ? "X" : `#${player.rank}`}</p>
            </td>
            <td>
              <div class="flex flex-row gap-2 items-center pr-6">
                <img class="h-6 w-6 ml-2" src={player.avatar} alt="{player.name}-avatar">
                  <div class="flex flex-col pl-2">
                      <p class="text-base font-medium leading-none text-gray-700 mr-2">{toTitleCase(player.name)}</p>
                      <div class="flex flex-row gap-2 mt-2">
                        <span class="inline-flex items-center px-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg">{player.point} pts</span>
                        <span class="inline-flex items-center px-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg">{diffTime((player.eliminated_at === 0 ? battle.ended_at : player.eliminated_at), battle.started_at, true)}</span>
                      </div>
                  </div>
              </div>
            </td>
          </tr>
          <tr class="h-1"></tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>