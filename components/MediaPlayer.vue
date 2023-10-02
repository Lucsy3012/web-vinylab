<script setup lang="ts">
import { useSelected } from "@/stores/selected";
import { useSettings } from "@/stores/settings";
import { useMediaControls } from "@vueuse/core";
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

/*
async function composedSideUrls() {
  if (!allSongsOfSide) return;

  const allSongsOfSideUrls = allSongsOfSide.map((song) => {
    return song.fields?.file?.url;
  });
  return await audioFiles.concat(allSongsOfSideUrls as string[]);
}

async function composedSideSizes() {
  if (!allSongsOfSide) return;

  return allSongsOfSide.map((song) => {
    songSize += song.fields?.file?.details?.size ?? 0;
  });
}
 */

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

  /* todo fix
  const sizes = await audioFiles.getComposedSideSizes(allSongsOfSide);
  const sizesCompounded =
    await audioFiles.getComposedSideSizes(allSongsOfSide)?.compound;
   */

  const lengths = (await audioFiles.getDurations(allSongsOfSide)) as number[];
  const lengthsCompounded = lengths.reduce((last, current) => {
    if (last.length === 0) {
      return [current];
    } else {
      const lastSum = last[last.length - 1];
      last.push(lastSum + current);
      return last;
    }
  }, []);

  // Set composed side details
  await selected.setComposedSide({
    url,
    // sizes: sizes?.individual ?? [],
    // sizesCompounded: sizes?.compound ?? [],
    lengths,
    lengthsCompounded, // todo later
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

  // Todo: update rate when clicking on RPM
  composingSide.data.value?.updateRate();
});
</script>

<template>
  <div
    class="media-player"
    :class="{ disabled: !selected?.song?.fields?.file?.url }"
    @keydown.prevent.space="mediaControls.playing = !mediaControls.playing"
  >
    <div>Media Player</div>
    <div>Album Title: {{ selected?.album?.fields?.title }}</div>
    <div>Song Title: {{ selected?.song?.fields?.title }}</div>
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
