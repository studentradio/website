<script lang="ts">
  import FaPlay from "svelte-icons/fa/FaPlay.svelte";
  import FaPause from "svelte-icons/fa/FaPause.svelte";
  export let src: string;
  export let live: boolean;
  export let label: string;
  let paused: boolean = true;
  let tailwind = "";
  export { tailwind as class };

  const date = new Date();

  const shouldShow =
    date.getDay() == 0 && date.getHours() >= 14 && date.getHours() <= 16;
</script>

{#if shouldShow}
  <section
    class="shadow-lg rounded-md overflow-hidden grid items-center h-40 max-w-2xl {tailwind}"
  >
    <img
      src="/player-background.jpg"
      alt=""
      class="row-span-1 col-span-1 row-start-1 col-start-1 h-full object-cover object-left-bottom"
    />
    <div
      class="row-span-1 col-span-1 row-start-1 col-start-1 md:ml-24 ml-0 md:justify-start justify-center flex gap-8 items-center"
    >
      <button
        on:click={() => (paused = !paused)}
        on:mousedown={(e) => {
          e.preventDefault();
          paused = !paused;
        }}
        class="bg-orange-600 h-14 w-14 rounded-full grid justify-center items-center"
      >
        <div class="h-8 w-8 text-white" class:ml-1={paused}>
          {#if paused}
            <FaPlay />
          {:else}
            <FaPause />
          {/if}
        </div>
      </button>
      <span class="text-4xl hidden md:block">
        {#if live}
          <span class="text-red-500">Live: </span>
          {label}
        {/if}
      </span>
    </div>

    <audio {src} bind:paused />
  </section>
{:else}<slot />{/if}
