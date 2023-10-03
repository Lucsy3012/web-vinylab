<script setup lang="ts">
import { useSelected } from "@/stores/selected";
import { useSettings } from "@/stores/settings";
import { useMediaControls } from "@vueuse/core";
import { useCompound } from "~/composables/useCompound";
import { Side, Song } from "~/types/globalTypes";
import { useAudioFiles } from "~/composables/useAudioFiles";

const selected = useSelected();
const settings = useSettings();
const audioFiles = useAudioFiles();

const currentAudioFile = ref<HTMLAudioElement>();

// Selecting side
function selectSide(side: Side) {
  selected.setSide(side);
}

// Compose merged audio file
const composedSideLoading = ref(true);
const allSongsOfSide = selected?.side?.fields?.songs as Song[];

// Define song details of composed side
let songSize = 0;
if (selected?.side?.fields?.songs?.length > 0) {
  const allSongsOfSideSizes = allSongsOfSide.map((song) => {
    songSize += song.fields?.file?.details?.size ?? 0;
    return songSize;
  });

  // todo move to composingSide function
  selected.setComposedSide({
    sizes: allSongsOfSideSizes, // todo fix
    sizesCompounded: allSongsOfSideSizes,
    activeSong: 0,
  });
}

const composingSide = await useAsyncData("composing-side", async () => {
  // Get composed side details
  const url =
    (await audioFiles.getComposedSideUrls(allSongsOfSide)) ??
    selected?.song?.fields?.file?.url;

  // todo fix
  // const sizes = await audioFiles.getComposedSideSizes(allSongsOfSide);
  // const sizesCompounded = useCompound().compoundArray(sizes);

  const lengths = (await audioFiles.getDurations(allSongsOfSide)) as number[];
  const lengthsCompounded = useCompound().compoundArray(lengths);

  // Set composed side details
  await selected.setComposedSide({
    url,
    // sizes,
    // sizesCompounded,
    lengths,
    lengthsCompounded,
    activeSong: 0,
  });

  // Providing media player
  const mediaControls = useMediaControls(currentAudioFile, {
    src: {
      src: selected?.composedSide?.url,
      type: selected?.song?.fields?.file?.contentType,
    },
  });

  // Disable loading indicator
  composedSideLoading.value = false;

  // Functions
  function updateRate(): void {
    const targetRpm = parseFloat(selected?.album?.fields?.rpm);
    const settingsRpm = settings?.rpm;

    mediaControls.rate.value = settingsRpm / targetRpm;
  }

  // Setting up default/user media controls
  mediaControls.playing.value = false;
  mediaControls.volume.value = settings?.volume ?? 1;
  updateRate();

  return {
    mediaControls,
    updateRate,
  };
});

const mediaControls = composingSide.data.value?.mediaControls;

function findIndexBelow(array: number[], value: number) {
  for (let i = 0; i < array.length; i++) {
    if (value <= array[i]) {
      console.log(i);
      return i;
    }
  }
}

// Watchers
watch(
  () => mediaControls?.currentTime,
  () => {
    const index = findIndexBelow(
      selected?.composedSide?.lengthsCompounded,
      mediaControls?.currentTime ?? 0,
    );

    selected?.setComposedSide({
      activeSong: index,
    });
  },
);

// Updates
onUpdated(() => {
  // Change color
  const body = document.querySelector("body");
  if (selected?.album?.fields?.moodColor) {
    body?.style.setProperty(
      "--site-accent",
      selected?.album?.fields?.moodColor.toString(),
    );
  }

  composingSide.data.value?.updateRate();
});
</script>

<template>
  <div
    class="media-player"
    :class="{ disabled: !selected?.song?.fields?.file?.url }"
    @keydown.prevent.space="mediaControls.playing = !mediaControls.playing"
  >
    <h2 class="title-2 mt2">{{ $t("songs.title") }}</h2>
    <div>Current Title: {{ selected?.song?.fields?.title }}</div>
    <h3 class="title-3 mt2">{{ $t("songs.titleAll") }}</h3>
    <ul>
      <li
        v-for="song in selected?.side?.fields?.songs as Song[]"
        :key="song.sys.id"
        :class="{ selected: song.sys.id === selected?.song?.sys?.id }"
      >
        {{ song?.fields?.title }}
      </li>
    </ul>
    <audio ref="currentAudioFile" controls></audio>
    <button @click="mediaControls.playing = !mediaControls.playing">
      Play / Pause
    </button>
    <button @click="mediaControls.muted = !mediaControls.muted">Mute</button>
    <span>{{ mediaControls.currentTime }} / {{ mediaControls.duration }}</span>
    <span>RPM {{ mediaControls.rate }}</span>
    <Scrubber v-model="mediaControls.volume" :max="1" />

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

    <div>RPMs:</div>
    <div class="rpm-controller">
      <div
        @click="settings.setRPM(33)"
        :class="{ selected: settings?.rpm === 33 }"
      >
        33 RPM
      </div>
      <div
        @click="settings.setRPM(45)"
        :class="{ selected: settings?.rpm === 45 }"
      >
        45 RPM
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.media-player {
  // todo
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .sides-controller,
  .rpm-controller {
    .selected {
      font-weight: bold;
      color: var(--site-color);
    }
  }
}
</style>
