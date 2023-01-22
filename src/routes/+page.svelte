<script lang="ts">
  import Logo from "../lib/components/logo.svelte";
  import Menu from "../lib/components/menu.svelte";
  import Footer from "../lib/components/footer.svelte";
</script>

<svelte:head>
  <title>Home | Pokewar - Pocket Monster Battleroyale</title> 
</svelte:head>

<section class="flex flex-col items-center justify-center h-screen">
  <Logo/>
  <Menu/>
</section>

<Footer/>
