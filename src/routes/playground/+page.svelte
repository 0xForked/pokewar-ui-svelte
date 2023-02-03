<script lang="ts">
	import { toTitleCase } from "$lib/utils/string";
  import Navigation from "../../lib/components/navigation.svelte";
	import MonsterCard from "$lib/components/monster.svelte";
	import MonsterSkeletonCard from "$lib/components/skeleton/monster.svelte";
  import type { Monster, Battle } from "$lib/data/model";
	import { onMount, onDestroy } from "svelte";
	import { InitWS } from "$lib/data/ws";
	import { generateRandomId, isJsonString } from "$lib/utils/helper";

  let title = "playground"
  let displayInstruction = true
  let displayActionButton = true
  let displayBattleInformation = false
  let displayBattlePlayground = false
  let displayAnnulledButton = false
  let countingTime = 15
  let socket: WebSocket
  let socketConnId: string
  let players: Monster[] = []
  let eliminatedPlayers: string[] = []
  let battleLogs: string[] = []
  let battleHistories: string[] = [] 

  onMount(() => { 
    if (socketConnId === undefined) { 
      socketConnId = generateRandomId()
    }
    socket = InitWS(socketConnId) 
    socket.onopen = () => { sendWSMessage("histories")  }
    socket.onmessage = (event) => {
      if (!isJsonString(event.data)) { return; }
      const callback = JSON.parse(event.data)
      if (callback.status === "error") {
        alert(callback.message)
        return
      }
      switch (callback.data_type) {
        case "monsters":
          proceedPlayersData(callback.data)
          break;
        case "battle_histories":
          proceedBattleHistoryData(callback.data)
          break;
        case "battle_logs":
          proceedLogsData(callback.data)
          break;
        case "eliminated_player":
          proceedEliminatedPlayerData(callback.data)
          break;
        case "eliminated_result":
          proceedEliminatedResult(callback.data)
          break;
        case "battle_result":
          proceedMatchResultData(callback.data)
          break;
        }
    }
  })

  function sendWSMessage(message: string, data = 0) {
    if (socket.readyState === WebSocket.CLOSED) { alert("Websocket connection is closed") }

    socket.send(JSON.stringify({
        'id': socketConnId,
        'action': message,
        'data': data
    }))
  }

  const proceedPlayersData = (data: any) =>  
    players = data
  const proceedBattleHistoryData = (data: any) => 
    battleHistories = data
  const proceedLogsData = (data: any) => 
    battleLogs = [data, ...battleLogs]
  const proceedEliminatedPlayerData = (data: any) => 
    eliminatedPlayers = [data, ...eliminatedPlayers]
  function proceedEliminatedResult(data: Battle) {
    players.forEach(monster => {
        const player = data.players.find(player =>
            player.name.toLowerCase() ===
            monster.name.toLowerCase())!
        monster.rank = player.rank
        monster.point = player.point
        monster.annulled = player.annulled_at > 0
    })
    players.sort((a, b) => a.rank! - b.rank!)
    players = players
  }
  function proceedMatchResultData(data: Battle) {
    players.forEach(monster => {
        const player = data.players.find(p =>
            p.name.toLowerCase() ===
            monster.name.toLowerCase())!
        monster.rank = player.rank
        monster.point = player.point
    })
    players.sort((a, b) => a.rank! - b.rank!)
    players = players
    displayBattleInformation = true  
    displayAnnulledButton = true  
    countingTime = 15
    const interval = setInterval(() => {
      if (countingTime === 10) {
        displayAnnulledButton = false
        sendWSMessage("save")
      }
      if (countingTime === 0) {
        sendWSMessage("histories")
        displayBattleInformation = false
        clearInterval(interval)
      }
      countingTime -= 1      
    }, 1000)
  }
  const handleAnnulled = (value: number) => sendWSMessage('annulled', value);

  onDestroy(() => { 
    socket.close()
    players = [] 
  })
</script>

<svelte:head>
  <title>{toTitleCase(title)} | Pokewar - Pocket Monster Battleroyale</title> 
</svelte:head>

<section class="flex flex-col my-12 w-full h-full">
  <Navigation {title} />
  {#if displayActionButton}
    <div class="py-4 md:py-7 px-4 md:px-8 xl:px-10 w-full">
      <div class="flex flex-col gap-4 items-center justify-center w-full">
        <div class="flex flex-row items-center justify-center my-12 gap-2">
          <button class="px-4 py-[8px] rounded-md border-solid border-2 text-gray-600 border-gray-400 bg-gray-100 flex items-center gap-2 hover:bg-gray-200 focus:bg-gray-600 focus:text-white text-sm" on:click={() => sendWSMessage('prepare')}>RANDOM PLAYER</button>
          {#if players.length > 0}
          <button class="px-4 py-[8px] rounded-md border-solid border-2 text-gray-600 border-gray-400 bg-gray-100 flex items-center gap-2 hover:bg-gray-200 focus:bg-gray-600 focus:text-white text-sm" on:click={() => { sendWSMessage('start'); displayBattlePlayground = true; battleLogs = []; eliminatedPlayers = []}}>PLAY BATTLE</button>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  {#if players.length > 0}
    <div class="flex flex-wrap gap-8 mb-8 w-full items-center justify-center">
      {#each players as monster}
        <MonsterCard 
          {monster} 
          isMiniCard={true} 
          displayAnnulledButton={displayAnnulledButton} 
          {handleAnnulled}
        />
      {/each}
    </div>
  {:else}
    <div class="flex flex-wrap gap-8 w-full items-center justify-center">
      {#each Array(5) as _}
       <MonsterSkeletonCard />
      {/each}
    </div>
  {/if}

  {#if displayBattleInformation}
    <div class="mb-5 text-center">
      Data will reset after {countingTime}s,
      <br>annulled button will be hide after 5s
      <br>and data will be proceeded.
      <br>You can play again the game after 15s.
    </div>
  {/if}

  {#if displayBattlePlayground}
    <div class="flex w-full h-full rounded-lg border-2 border-solid border-gray-200 divide-x divide-solid" id="battleroyale-playground">
      <div class="basis-1/6 w-full p-4">
          <h5 class="font-bold text-lg mb-4">Players Eliminated </h5>
          <div id="battleroyale-eliminated" class="w-full">
            {#each eliminatedPlayers as eliminated }
             <p>{eliminated}</p>
            {/each}
          </div>
      </div>
      <div class="basis-3/5 w-full p-4">
          <h5 class="font-bold text-lg mb-4">Battle Logs <span id="log-id"></span></h5>
          <div id="battleroyale-logs" class="overflow-y-auto h-96">
            {#each battleLogs as log}
              <p>{log}</p>
            {/each}
          </div>
      </div>
      <div class="basis-1/4 w-full p-4">
          <h5 class="font-bold text-lg mb-4">Battle History</h5>
          <div id="battleroyale-history">
            {#each battleHistories as history}
              {@html history}
            {/each}
          </div>
      </div>
    </div>
  {/if}  

  {#if displayInstruction}
    <div class="bg-gray-300 fixed bottom-3 right-3 rounded text-gray-700">
      <div class="flex flex-col mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8">    
        <div class="flex items-center justify-between mb-4">
          <h5 class="text-2xl font-bold">INSTRUCTION</h5>
          <button type="button" class="-mr-1 flex rounded-md p-2 hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2" on:click={() => {displayInstruction = !displayInstruction}}>
            <span class="sr-only">Dismiss</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p>
          Click [RANDOM PLAYER] Button <br> to get random player, after random player displayed.
          <br>Click [PLAY BATTLE] Button <br> to play the battleroyale round. Enjoy your game!
        </p>
      </div>
    </div>
  {/if}
</section>