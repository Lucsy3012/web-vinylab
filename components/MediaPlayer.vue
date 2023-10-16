<script setup lang="ts">
import { useSelected } from "@/stores/selected";
import { useSettings } from "@/stores/settings";
import { useMediaControls } from "@vueuse/core";
import { useCompound } from "~/composables/useCompound";
import { Artist, Side, Song } from "~/types/globalTypes";
import { useAudioFiles } from "~/composables/useAudioFiles";
import { useComposition } from "~/composables/useComposition";

const selected = useSelected();
const settings = useSettings();
const audioFiles = useAudioFiles();
const composition = useComposition();

const currentAudioFile = ref<HTMLAudioElement>();

// Selecting side
function selectSide(side: Side) {
  selected.setSide(side);
}

// Compose merged audio file
const composedSideLoading = ref(true);
const compositionSongs = composition.getSongs(selected);
const compositionName = composition.getFileName(selected);
const storedFile = ref(undefined);

const composingSide = await useAsyncData("composing-side", async () => {
  try {
    storedFile.value = await composition.getStoredFile(selected);
  } catch {
    console.log("No stored file found");
  }

  const createdFile = await audioFiles.getComposedSideUrls(
    selected,
    compositionSongs,
  );

  // Get composed song url (first check if it's already stored, otherwise compose it)
  const url = storedFile.value || createdFile;

  // Create composed side details
  console.log("url", url);
  if (url?.includes("blob:")) {
    console.log(
      "File has been composed on the fly, todo uploading to supabase",
    );
  }

  const lengths = (await audioFiles.getDurations(compositionSongs)) as number[];
  const lengthsCompounded = useCompound().compoundArray(lengths);

  // Set composed side details
  await selected.setComposedSide({
    url,
    name: compositionName,
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
      return i;
    }
  }
}

const artistsList = computed(() => {
  const allArtists = selected?.album?.fields?.artists as Artist[];
  return allArtists.map((artist) => artist.fields.artistName).join(", ");
});

// Watchers
watch(
  () => mediaControls?.currentTime,
  () => {
    // Get currently running song by checking runtime of composed side song
    const index: number =
      findIndexBelow(
        selected?.composedSide?.lengthsCompounded,
        mediaControls?.currentTime,
      ) ?? 0;

    const activeSong = selected?.side?.fields?.songs[index];
    const activeSongId = activeSong?.sys?.id;

    if (activeSongId !== selected?.song?.sys?.id) {
      selected?.setSong(activeSong);
      selected?.setComposedSide({
        activeSong: index,
      });
    }
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
  if (settings?.rpm) {
    body?.style.setProperty(
      "--album-vinyl-rotation-rpm",
      (settings?.rpm ?? 45).toString(),
    );
    body?.style.setProperty(
      "--album-vinyl-rotation-time",
      `${60 / settings?.rpm}s`,
    );
  }

  composingSide.data.value?.updateRate();
});

// Custom Properties
const albumVinylRotation = computed(
  () => `--album-vinyl-rotation: ${mediaControls?.playing === true ? 1 : 0}`,
);
</script>

<template>
  <section class="media-player-container" :style="`${albumVinylRotation}`">
    <div class="stretch">
      <div class="row">
        <div class="col col-12">
          <div
            class="media-player"
            :class="{ disabled: !selected?.song?.fields?.file?.url }"
            @keydown.prevent.space="
              mediaControls.playing = !mediaControls.playing
            "
          >
            <div v-if="!!selected.album" class="media-player-controller">
              <!-- Current Album -->
              <AlbumCover
                :album="selected.album"
                :size="66.66"
                :rotation="'constant'"
              />
              <div class="album-title--container">
                <div class="title-4 --site-color">
                  {{ selected?.song?.fields?.title }}
                </div>
                <div class="eyebrow-2 --site-color-50 mt1">
                  {{ artistsList }}
                </div>
              </div>

              <!-- todo -->
              <div class="media-player-bar">
                <audio ref="currentAudioFile" controls></audio>
                <button
                  @click="mediaControls.playing = !mediaControls?.playing"
                >
                  Play / Pause
                </button>
                <button @click="mediaControls.muted = !mediaControls?.muted">
                  Mute
                </button>
                <span
                  >{{ mediaControls?.currentTime }} /
                  {{ mediaControls?.duration }}</span
                >
              </div>
              <!--
              <Scrubber v-if="!!mediaControls?.volume" v-model="mediaControls.volume" :max="1" />
              -->

              <div class="media-player-sides-container">
                <div>Sides:</div>
                <ul class="sides-controller">
                  <li
                    v-for="side in selected?.sides as Side[]"
                    :key="side.sys.id"
                    @click="selectSide(side)"
                    :class="{
                      selected: side.sys.id === selected?.side?.sys?.id,
                    }"
                  >
                    {{ side?.fields?.side }}
                  </li>
                </ul>
              </div>

              <div class="media-player-rpm-container">
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
            </div>

            <!-- for playlist
            <div class="media-player-playlist">
              <h3 class="title-3 mt2">{{ $t("songs.titleAll") }}</h3>
              <ul class="songs">
                <li
                  v-for="song in selected?.side?.fields?.songs as Song[]"
                  :key="song.sys.id"
                  :class="{ selected: song.sys.id === selected?.song?.sys?.id }"
                >
                  {{ song?.fields?.title }}
                </li>
              </ul>
            </div>
            -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
@import (reference) "../assets/less/variables.less";
@import (reference) "../assets/less/shorthands.less";

.media-player-container {
  --section-padding: 0;
  // --gap-row: 0;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 10;

  .col {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.media-player {
  width: 100%;
  border-radius: 70px 70px 0 0;
  background-color: var(--site-contrast-50);
  backdrop-filter: blur(10px);
  .transit();

  // todo
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  // Header
  .media-player-controller {
    --album-width: 66.66px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 2em;
    padding: 45px 45px 35px;

    // todo change for animation
    :deep(.album-cover) {
      --album-vinyl-stick-out: 0;

      .album-cover-front {
        opacity: 0;
      }
    }
  }

  .media-player-bar {
    flex: 1 1 auto;
  }

  .songs,
  .sides-controller,
  .rpm-controller {
    .selected {
      --transition-property: color;
      --transition-duration: 0.5s;
      --transition-timing-function: ease-in-out;
      font-weight: bold;
      color: var(--site-color);
      .transit();
    }
  }
}
</style>
