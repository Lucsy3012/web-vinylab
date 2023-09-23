<script setup lang="ts">
import { useCollection } from "@/stores/collection";
import { useMediaControls } from "@vueuse/core";

/* for later
const collection = useCollection();
const mediaPlayer = await useAsyncData("media-player", async () => {
  if (await collection.check()) {
    return unref(collection.data);
  }
});
 */

const currentAudioFile = ref<HTMLAudioElement>();
const { playing, currentTime, duration, volume, muted } = useMediaControls(
  currentAudioFile,
  {
    src: {
      // src: "https://assets.ctfassets.net/rlw7c1gzufpy/7eDCqMgMSiB0PthdJCySrk/ac977951ce3b35827f5378698384bb13/Dark_Cycle_2_-_01_Schwarze_Materie.mp3",
      src: "Dark Cycle 3 - 01 Origin.mp3",
      type: "audio/mpeg",
    },
  },
);

onMounted(() => {
  volume.value = 0.75;
  currentTime.value = 10;
});
</script>

<template>
  <div class="media-player" @keydown.prevent.space="playing = !playing">
    <div>Media Player</div>
    <button @click="playing = !playing">Play / Pause</button>
    <button @click="muted = !muted">Mute</button>
    <span>{{ currentTime }} / {{ duration }}</span>
  </div>
</template>
