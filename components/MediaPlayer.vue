<script setup lang="ts">
import { useSelected } from "@/stores/selected";
import { useSettings } from "@/stores/settings";
import { useMediaControls } from "@vueuse/core";
import { useCompound } from "~/composables/useCompound";
import { Artist, Side } from "~/types/globalTypes";
import { useAudioFiles } from "~/composables/useAudioFiles";
import { useComposition } from "~/composables/useComposition";
import { PhArrowsClockwise } from "@phosphor-icons/vue";
import MediaPlayerPlayController from "~/components/MediaPlayerPlayController.vue";
import MediaPlayerDuration from "~/components/MediaPlayerDuration.vue";

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
const compositionUrl = ref("");

const composingSide = await useAsyncData("composing-side", async () => {
  const fileStored = await composition.getStoredFile(selected);

  // Get URL from Supabase / or compose on the fly
  if (fileStored) {
    compositionUrl.value = fileStored;
  } else {
    console.log("File has been composed on the fly");
    // todo include loading screen
    compositionUrl.value =
      (await audioFiles.getComposedSideUrls(selected, compositionSongs)) ?? "";
  }

  // Get lengths for each song
  const lengths = (await audioFiles.getDurations(compositionSongs)) as number[];
  const lengthsCompounded = useCompound().compoundArray(lengths);

  // Set composed side details
  await selected.setComposedSide({
    url: compositionUrl.value,
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
  mediaControls.playing.value = true;
  mediaControls.volume.value = settings?.volume ?? 0.75;
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
  // Change color & settings
  if (selected?.album?.fields?.moodColor) {
    document.documentElement.style.setProperty(
      "--site-accent",
      selected?.album?.fields?.moodColor.toString(),
    );
  }
  if (settings?.rpm) {
    document.documentElement.style.setProperty(
      "--album-vinyl-rotation-rpm",
      (settings?.rpm ?? 45).toString(),
    );
    document.documentElement.style.setProperty(
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
                :size="67"
                :rotation="'constant'"
              />
              <div class="album-title--container">
                <div
                  class="title-4 --site-color"
                  :title="selected?.song?.fields?.title"
                >
                  {{ selected?.song?.fields?.title }}
                </div>
                <div class="eyebrow-2 --site-color-50 mt1">
                  {{ artistsList }}
                </div>
              </div>

              <span class="divider" />

              <!-- todo -->
              <div class="media-player-bar">
                <MediaPlayerPlayController
                  :playing="mediaControls.playing"
                  @click="mediaControls.playing = !mediaControls?.playing"
                />
                <div class="media-player-bar-track">
                  <Scrubber
                    v-model="mediaControls.currentTime"
                    class="media-player-bar-scrubber"
                    :max="mediaControls.duration"
                  />
                  <div class="media-player-bar-indicators">
                    <span
                      v-for="indicator in selected.composedSide
                        .lengthsCompounded"
                      :key="indicator"
                      class="indicator"
                      :style="`left: ${
                        (100 / mediaControls.duration) * indicator
                      }%`"
                    />
                  </div>
                </div>
                <audio ref="currentAudioFile" controls />

                <!-- Display time -->
                <MediaPlayerDuration :mediaControls="mediaControls" />
              </div>

              <MediaPlayerAudioController :mediaControls="mediaControls" />

              <span class="divider" />

              <!-- RPM -->
              <div class="media-player-rpm-container">
                <div class="rpm-controller">
                  <div
                    v-for="rpm in [33, 45]"
                    class="rpm eyebrow-1 text--upper"
                    :class="{ selected: settings?.rpm === rpm }"
                    @click="settings.setRPM(rpm)"
                    :key="rpm"
                    tabindex="0"
                  >
                    {{ rpm }} RPM
                  </div>
                </div>
              </div>

              <span class="divider" />

              <div class="media-player-sides-container">
                <div class="side playing-side">
                  {{ selected?.side?.fields?.side }}

                  <PhArrowsClockwise
                    :size="18"
                    color="#1B1B1B"
                    weight="bold"
                    class="icon"
                  />
                </div>
                <ul class="sides-controller">
                  <li
                    v-for="side in selected?.sides as Side[]"
                    :key="side.sys.id"
                    class="side"
                    :class="{
                      selected: side.sys.id === selected?.side?.sys?.id,
                    }"
                    @click="selectSide(side)"
                    tabindex="0"
                  >
                    {{ side?.fields?.side }}
                  </li>
                </ul>
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

audio {
  display: none;
}
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
    --gap: 2em;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--gap);
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
    display: flex;
    align-items: center;
    gap: var(--gap);

    .media-player-bar-track {
      position: relative;
      flex: 1 1 auto;
      border-radius: 10px;
      overflow: hidden;

      .media-player-bar-scrubber {
        width: 100%;
      }
      .media-player-bar-indicators {
        position: absolute;
        inset: 0;
        pointer-events: none;

        > .indicator {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 4px;
          height: 100%;
          background-color: #0006;
          translate: -50% 0;

          &:last-child {
            display: none;
          }
        }
      }
    }
  }

  .album-title--container {
    width: 240px;

    * {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  span.divider {
    display: block;
    width: 1px;
    height: 40px;
    border-left: 1px solid var(--site-color-25);
  }

  .songs,
  .sides-controller {
    .selected {
      --transition-property: color;
      --transition-duration: 0.5s;
      --transition-timing-function: ease-in-out;
      font-variation-settings: "wght" 750;
      color: var(--site-color);
      .transit();
    }
  }

  // RPM
  .rpm-controller {
    display: flex;
    flex-direction: column;
    place-items: center;
    place-content: center;
    gap: 0.5em;

    .rpm {
      --transition-property: color;
      --transition-duration: 0.15s;
      --transition-timing-function: ease-in-out;
      color: var(--site-color-50);
      cursor: pointer;
      .transit();

      &:hover {
        color: var(--site-color-75);
      }
      &.selected {
        &,
        &:hover {
          color: var(--site-color);
        }
      }
    }
  }

  // Sides
  .media-player-sides-container {
    font-size: 2em;
    position: relative;
    width: 1.25em;
    text-align: left;

    .sides-controller {
      display: flex;
      position: absolute;
      top: 50%;
      right: 0;
      padding: 0.6em 0.8em;
      gap: 0.25em;
      translate: 0.75em -50%;
      text-align: center;
      opacity: 0;
      pointer-events: none;
      border-radius: 1em;
      background-color: var(--site-contrast);
      .transit();
    }
    .side {
      --transition-property: color;
      --transition-duration: 0.15s;
      --transition-timing-function: ease-in-out;
      font-variation-settings: "wght" 700;
      min-width: 1.25em;
      cursor: pointer;
      color: var(--site-color-25);
      .transit();

      &:hover {
        color: var(--site-color-50);
      }
      &.selected,
      &.playing-side {
        color: var(--site-color-75);
      }
      &.playing-side {
        position: relative;

        .icon {
          position: absolute;
          top: 0;
          right: 0;
          width: 0.5em;
          height: 0.5em;
          opacity: 0.5;
        }
      }
    }

    .playing-side:hover ~ .sides-controller,
    .playing-side:focus ~ .sides-controller,
    &:focus-within .sides-controller,
    .sides-controller:hover {
      translate: 0.5em -50%;
      opacity: 1;
      pointer-events: initial;
    }
  }
}
</style>
