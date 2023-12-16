<!-- Copy from MediaPlayer -->
<script setup lang="ts">
import { useSelected } from "@/stores/selected";
import { useSettings } from "@/stores/settings";
import { useMediaControls } from "@vueuse/core";
import { Artist, Side } from "~/types/globalTypes";
import MediaPlayerPlayController from "~/components/MediaPlayerPlayController.vue";

const selected = useSelected();
const settings = useSettings();

// Selecting side
function selectSide(side: Side) {
  selected.setSide(side);
}

const currentAudioFile = ref<HTMLAudioElement>();

const mediaControls = useMediaControls(currentAudioFile, {
  src: {
    src: selected?.composedSide?.url,
    type: selected?.song?.fields?.file?.contentType,
  },
});

onMounted(() => {
  mediaControls.playing.value = false;
  mediaControls.volume.value = settings?.volume ?? 0.75;
  mediaControls.currentTime.value = 0;
});

// Updates
onUpdated(() => {
  // Change color & settings
  if (selected?.album?.fields?.moodColor) {
    document.documentElement.style.setProperty(
      "--site-accent",
      selected?.album?.fields?.moodColor.toString(),
    );
  }
});
</script>

<template>
  <section class="experience-media-player-container">
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
              <AlbumCover :album="selected.album" :size="350" />

              <!-- Play / Pause -->
              <MediaPlayerPlayController
                :playing="mediaControls.playing"
                @click="mediaControls.playing = !mediaControls?.playing"
              />

              <span class="divider" />

              <!-- Sides -->
              <div class="media-player-sides-container">
                <div class="sides-controller">
                  <div
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
                  </div>

                  <!-- Active play bar -->
                  <div class="media-player-bar">
                    <div class="media-player-bar-track">
                      <Scrubber
                        v-model="mediaControls.currentTime"
                        class="media-player-bar-scrubber"
                        :max="mediaControls.duration"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <span class="divider" />

              <MediaPlayerAudioController :mediaControls="mediaControls" />

              <audio ref="currentAudioFile" controls />
            </div>
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
.experience-media-player-container {
  width: 100%;

  .col {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.media-player {
  width: 100%;
  .transit();

  // todo
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  // Header
  .media-player-controller {
    --album-width: 350px;
    --gap: 2em;
    display: grid;
    grid-template-columns: 2.5em 1px 350px 1px 2.5em;
    grid-template-rows: 350px auto;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: calc(var(--gap) * 2) var(--gap);

    > * {
      grid-row: 2;
    }

    // todo change for animation
    :deep(.album-cover) {
      --album-vinyl-stick-out: 0;
      grid-column: 3;
      grid-row: 1;

      .album-cover-front {
        // opacity: 0;
      }
    }
  }

  // Play / Pause
  :deep(.play-pause-controller) {
    color: var(--site-accent);
  }

  // Audio Controller
  :deep(.media-player-audio-controller) {
    position: relative;
    padding: 0;
    cursor: pointer;

    .speaker {
      padding: 1.25em;
      background: var(--site-accent);
      border-radius: 50%;
    }
    .scrubber-container {
      --transition-duration: 0.133s;
      opacity: 0;
      .transit();
    }

    &:hover {
      .scrubber-container {
        opacity: 1;
      }
    }
  }

  // Scrubber
  :deep(.scrubber-container) {
    background: var(--site-accent-25);
  }
  :deep(.scrubber-inner) {
    & + div {
      background: var(--site-accent);
    }
  }

  // Play bar
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
      }
    }
  }

  span.divider {
    display: block;
    width: 1px;
    min-height: 40px;
    height: 100%;
    border-left: 1px solid var(--site-accent-25);
  }

  // Sides
  .media-player-sides-container {
    font-size: 2em;

    .sides-controller {
      display: flex;
      gap: 1em;
      text-align: center;
      border-radius: 1em;
      .transit();
    }
    .side {
      --transition-property: color;
      --transition-duration: 0.15s;
      --transition-timing-function: ease-in-out;
      font-variation-settings: "wght" 700;
      display: flex;
      justify-content: center;
      cursor: pointer;
      color: var(--site-accent-25);
      .transit();

      &:hover {
        color: var(--site-accent-50);
      }
      &.selected,
      &.playing-side {
        display: flex;
        // flex: 1 1 auto;
        gap: 1em;
        color: var(--site-accent-75);
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
  }
}
</style>
