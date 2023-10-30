<script setup lang="ts">
import { useSettings } from "@/stores/settings";
import {
  PhSpeakerSimpleHigh,
  PhSpeakerSimpleLow,
  PhSpeakerSimpleX,
} from "@phosphor-icons/vue";

const settings = useSettings();

export type MediaControlsAudio = {
  volume: number;
  muted: boolean;
};

const props = defineProps<{
  mediaControls: MediaControlsAudio;
}>();

// Watchers
watch(
  () => props.mediaControls.volume,
  () => {
    props.mediaControls.muted = props.mediaControls.volume === 0;
  },
);

watch(
  () => props.mediaControls?.volume,
  () => {
    settings.setVolume(props.mediaControls?.volume ?? 0.75);
  },
);
</script>

<template>
  <div class="media-player-audio-controller">
    <div class="speaker" @click="mediaControls.muted = !mediaControls?.muted">
      <PhSpeakerSimpleX
        v-show="!!mediaControls?.muted"
        :size="20"
        color="#1B1B1B"
        weight="fill"
      />
      <PhSpeakerSimpleLow
        v-show="!mediaControls?.muted && mediaControls.volume < 0.5"
        :size="20"
        color="#1B1B1B"
        weight="fill"
      />
      <PhSpeakerSimpleHigh
        v-show="!mediaControls?.muted && mediaControls.volume >= 0.5"
        :size="20"
        color="#1B1B1B"
        weight="fill"
      />
    </div>
    <Scrubber
      v-if="mediaControls?.volume !== undefined"
      v-model="mediaControls.volume"
      class="scrubber"
      :min="0.01"
      :max="1"
    />
  </div>
</template>

<style lang="less" scoped>
.media-player-audio-controller {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 1em;
  padding: 0 0.5em;
}
.speaker {
  display: grid;
  place-content: center;
  width: 1.25em;
  height: 1.25em;
  cursor: pointer;

  > * {
    grid-column: 1;
    grid-row: 1;
  }
}
.scrubber {
  min-width: 100px;
}
</style>
