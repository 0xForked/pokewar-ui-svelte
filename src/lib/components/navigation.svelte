<script lang="ts">
  import { base } from '$app/paths';
  export let title: string;
</script>

<div class="flex flex-row w-full mb-8 items-center">
  <a href="{base}" class="rounded-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  </a>
  <h5 class="text-lg font-bold ml-4 uppercase">{title}</h5>
</div>