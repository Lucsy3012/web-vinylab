<script setup lang="ts">
import { useSettings } from "@/stores/settings";
import { Album, Artist, Side } from "~~/types/globalTypes";

const settings = useSettings();
const displayType = ref(settings?.display); // make watchable

const props = defineProps<{
  album: Album;
  side?: Side;
}>();

const artistsList = computed(() => {
  const allArtists = props.album?.fields?.artists as Artist[];
  return allArtists.map((artist) => artist.fields.artistName).join(", ");
});
</script>

<template>
  <div class="album" :class="`album--${settings.display}`">
    <AlbumCover :album="props.album" :size="120" :rotation="'teaser'" />
    <div class="album-title--container mt3 pt1">
      <h2 class="title-2 --site-color">{{ props.album?.fields?.title }}</h2>
      <h3 class="eyebrow-1 --site-color-50 mt1">{{ artistsList }}</h3>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import (reference) "../assets/less/variables.less";
@import (reference) "../assets/less/shorthands.less";

.album {
  --transition-duration: 0.25s;
  --transition-timing-function: var(--bezier-quart-in);
  --album-vinyl-rotation-constant: 0deg;
  background-color: var(--site-contrast-33);
  padding: 3em 2em;
  cursor: pointer;
  .--rounded-l();

  &.album--grid {
    --album-width: 120px;
    --album-vinyl-stick-out: 0.2;
    display: flex;
    flex-direction: column;
    place-content: center;
    place-items: center;
    flex: 1 1 520px;
    text-align: center;
    .transit();

    &:hover,
    &.selected {
      --album-vinyl-stick-out: 0.5;
      background-color: var(--site-contrast);
    }
    /* todo
    &.selected {
      animation: constantRotation 10s linear infinite;
    }
     */
  }
}

/* todo
@keyframes constantRotation {
  0% {
    --album-vinyl-rotation-constant: 0deg;
  }
  100% {
    --album-vinyl-rotation-constant: 360deg;
  }
}
 */
</style>
