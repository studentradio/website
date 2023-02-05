<script>
    import { audio, others , seeking} from './audio.store.js';
    import Control from './control.svelte';
    export let src;
    export let name;
    let w;
    let h;
    let canvas;
    $: playing = !$audio.paused && $audio.src == src;
    let scrubber;
    let held = false;
    import { onMount } from 'svelte';
    const onMousedown = (e) => {
      const rect = scrubber.getBoundingClientRect();
      console.log(((e.clientX - rect.x) / rect.width) * $audio.duration, $audio.duration)

      audio.goto(((e.clientX - rect.x) / rect.width) * $audio.duration);
      held = true;
    };
    const onMousemove = (e) => {
      if (held) {
        const rect = scrubber.getBoundingClientRect();
        audio.goto(((e.clientX - rect.x) / rect.width) * $audio.duration);
        held = true;
      }
    };
    const onMouseup = (e) => {
      held = false;
    };
  
    onMount(() => {
      if (!navigator.userAgent.match('jsdom')) {
        let canvasCtx = canvas.getContext('2d');
        let dataArray = new Uint8Array($audio.bufferLength);
        let bufferLength = $audio.bufferLength;
        let frame;
        const draw = () => {
          frame = requestAnimationFrame(draw);
          if (!playing) return;
          const WIDTH = w;
          const HEIGHT = h;
          $audio.analyser.getByteTimeDomainData(dataArray);
  
          canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  
          canvasCtx.strokeStyle = '#f16f33';
          canvasCtx.fillStyle = '#000';
  
          let sliceWidth = (WIDTH * 1.0) / (bufferLength / 64);
          canvasCtx.lineWidth = sliceWidth / 2;
  
          let x = 0;
          //   let y = 0;
          let lastV = 0;
          let zeroes = [];
          canvasCtx.beginPath();
  
          for (let i = 0; i < bufferLength; i += 64) {
            let avg = Math.max(...dataArray.slice(i, i + 64));
            var v = avg / 128.0;
            var y = (v * HEIGHT) /2;
            var otherV = v == 1 ? v : v > 1 ? 1 - (v - 1) : 1 + (1 - v);
            var otherY = (otherV * HEIGHT) / 2;
            if (i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.moveTo(x, y);
  
              canvasCtx.lineTo(x, otherY);
            }
  
            x += sliceWidth;
          }
          // canvasCtx.lineTo(WIDTH, HEIGHT / 2);
          canvasCtx.stroke();
          canvasCtx.closePath();
          return;
        };
        let timeout;
        const run = () => {
          if (playing) {
            draw();
          } else {
            timeout = setTimeout(run, 500);
          }
        };
        run();
        return () => {
          clearTimeout(timeout);
          cancelAnimationFrame(frame);
        };
      }
    });

  const analyse = () => {
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = audioCtx.createAnalyser();

    let source = audioCtx.createMediaElementSource($audio.ref);
    source.connect(analyser);

    analyser.connect(audioCtx.destination);

    analyser.fftSize = $audio.bufferLength;
    let bufferLength = analyser.fftSize;
    let dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    $audio.analyser = analyser;
  };

  if (typeof document != 'undefined')
    document.addEventListener('mousedown', analyse, { once: true });
  </script>

  {#if src}
  <div
    class="my-4 mb-4   bg-white max-w-2xl mx-auto rounded-3xl shadow-xl border-orange-400 border-2 overflow-hidden"
  >
  
    <div
      class="h-36 relative  rounded-3xl"
      bind:clientWidth={w}
      bind:clientHeight={h}
    
    >
      <Control
        tailwind="bg-gray-900 rounded-full z-20 w-20 h-20 m-8 relative"
        click={() => {
          if (playing) {
            audio.pausePodcast();
          } else {
            audio.playPodcast(src);
          }
        }}
        {playing}
      />
      <span class="h-36 absolute top-0 flex w-96 left-36 text-gray-800 z-10 text-3xl items-center">{name}</span>
      {#if $others && $others[src]}
        <div>
          <div
            class="absolute top-0 h-36 left-0 bg-gray-300"
            style="width:{($others[src].current /
              $others[src].duration) *
              w}px"
          />
          <div
            class="h-36 text-orange-400 z-10 font-thin text-lg bottom-0 absolute right-0 p-1 pr-2"
          >
            {Math.round(
              ($others[src].duration -
                $others[src].current) /
                60
            ).toString()}m left
          </div>
        </div>
      {/if}
      <img
      src="/player-background.jpg"
      alt=""
      class="absolute top-0"
    />
      <canvas
        class="waveform absolute top-0"
        bind:this={canvas}
        width={w}
        height={h}
      />
      
    </div>
  </div>
  <!-- <audio
  crossorigin="anonymous"
  src={src}
  bind:volume={$audio.volume}
  bind:duration={$audio.duration}
  on:timeupdate={(e) => {
    $audio.currentTime = e.target.currentTime;
  }}
  bind:this={$audio.ref}
  on:seeking={() => ($seeking = true)}
  on:seeked={() => ($seeking = false)}
/> -->
<audio
crossorigin="anonymous"
src={src}
bind:duration={$audio.duration}
  on:timeupdate={(e) => {
    $audio.currentTime = e.target.currentTime;
  }}
bind:this={$audio.ref}
/>

<!-- <div class="my-4 mb-8   bg-orange-200 max-w-2xl mx-auto rounded-3xl shadow-xl overflow-hidden cursor-pointer "   bind:this={scrubber}
on:pointerdown={onMousedown}
on:pointerup={onMouseup}
on:pointermove={onMousemove}>
    <div class="bg-orange-600 h-5 rounded-full text-orange-400 transition-all" style="width: {100*($audio.currentTime??0)/($audio.duration??1)}%"></div>
    </div> -->

<div class="my-4 mb-8   bg-orange-200 max-w-2xl mx-auto rounded-3xl shadow-xl overflow-hidden"   
>
    <div class="bg-orange-600 h-5 rounded-full text-orange-400 transition-all" style="width: {100*($audio.currentTime??0)/($audio.duration??1)}%"></div>
    </div>
    {/if}