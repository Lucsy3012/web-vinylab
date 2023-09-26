<script setup lang="ts">
import { useSelected } from "@/stores/selected";
import { useSettings } from "@/stores/settings";
import { useMediaControls } from "@vueuse/core";
import { Side } from "~/types/globalTypes";

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

onUpdated(() => {
  const body = document.querySelector("body");
  if (selected?.album?.fields?.moodColor) {
    body?.style.setProperty(
      "--site-accent",
      selected?.album?.fields?.moodColor.toString(),
    );
  }
});

// Selecting side
function selectSide(side: Side) {
  selected.setSide(side);
}

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

    <div>Sides:</div>
    <ul class="sides-controller">
      <li
        v-for="side in selected?.sides as Side[]"
        :key="side.sys.id"
        @click="selectSide(side)"
        :class="{ selected: side.sys.id === selected?.side?.sys?.id }"
      >
        {{ side?.fields?.side }}
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.media-player {
  // todo
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .sides-controller {
    li.selected {
      font-weight: bold;
      color: var(--site-color);
    }
  }
}
</style>
