<script setup lang="ts">
export type MediaControlsDuration = {
  currentTime: number;
  duration: number;
};

const props = defineProps<{
  mediaControls: MediaControlsDuration;
}>();

// Displaying times
function formatDuration(seconds: number) {
  return new Date(1000 * seconds).toISOString().slice(14, 19);
}
</script>

<template>
  <span class="duration">
    <span class="current-time">
      {{ formatDuration(props.mediaControls?.currentTime) }}
    </span>
    <span class="separator">/</span>
    <span class="full-duration">
      {{ formatDuration(props.mediaControls?.duration) }}
    </span>
  </span>
</template>

<style lang="less" scoped>
.duration {
  display: flex;
  gap: 0.5em;
  color: var(--site-color-50);
  font-variation-settings: "wght" 700;
  font-variant: tabular-nums;
  letter-spacing: -0.05em;

  .current-time {
    color: var(--site-color);
  }
}
</style>
