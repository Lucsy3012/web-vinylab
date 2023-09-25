<script setup lang="ts">
import { useSelected } from "@/stores/selected";
import { useSettings } from "@/stores/settings";
import { useMediaControls } from "@vueuse/core";

const selected = useSelected();
const settings = useSettings();

const currentAudioFile = ref<HTMLAudioElement>();
const { playing, currentTime, duration, volume, muted } = useMediaControls(
  currentAudioFile,
  {
    src: {
      src: selected?.song?.fields?.file?.url,
      type: selected?.song?.fields?.file?.contentType,
    },
  },
);

/* maybe reference for later
onUpdated(() => {
  albumName = selected?.album?.fields?.title;
  songName = selected?.song?.fields?.title;
  songUrl = selected?.song?.fields?.file?.url;
  songFileType = selected?.song?.fields?.file?.contentType;
});
 */

onMounted(() => {
  playing.value = false;
  volume.value = settings.volume;
});
</script>

<template>
  <div
    class="media-player"
    :class="{ disabled: !selected?.song?.fields?.file?.url }"
    @keydown.prevent.space="playing = !playing"
  >
    <div>Media Player</div>
    <div>Album Title: {{ selected?.album?.fields?.title }}</div>
    <div>Song Title: {{ selected?.song?.fields?.title }}</div>
    <audio ref="currentAudioFile" controls></audio>
    <button @click="playing = !playing">Play / Pause</button>
    <button @click="muted = !muted">Mute</button>
    <span>{{ currentTime }} / {{ duration }}</span>
    <Scrubber v-model="volume" :max="1" />
  </div>
</template>
