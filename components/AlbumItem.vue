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

const sides = computed(() => {
  return props.album?.fields?.sides.length;
});
const firstSide = computed(() => {
  return props.album?.fields?.sides[0].fields?.side;
});
const lastSide = computed(() => {
  return props.album?.fields?.sides[sides.value - 1].fields?.side;
});
</script>

<template>
  <div class="album" :class="`album--${settings.display}`">
    <AlbumCover :album="props.album" :size="350" :rotation="'teaser'" />
    <div class="album-title--container">
      <h2
        class="album-title --site-color"
        :class="{
          'title-1 mt3 pt1': settings.display === 'coverflow',
          'title-2 mt3 pt1': settings.display === 'grid',
          tb: settings.display === 'list',
        }"
      >
        {{ props.album?.fields?.title }}
      </h2>
      <h3
        class="album-authors --site-color-50"
        :class="{
          'eyebrow-1 mt1 text--upper': settings.display === 'coverflow',
          'eyebrow-1 mt1': settings.display === 'grid',
          tm: settings.display === 'list',
        }"
      >
        {{ artistsList }}
      </h3>
    </div>

    <!-- Side and Duration information -->
    <div v-if="settings.display === 'list'" class="album-information">
      <span class="album-information-side tb --site-color-33">
        {{ firstSide }}-{{ lastSide }}
      </span>
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
  .transit();

  &:hover,
  &.selected {
    --album-vinyl-stick-out: 0.55;
    background-color: var(--site-contrast);
  }

  // Grid
  &.album--grid {
    --album-width: 120px;
    --album-vinyl-stick-out: 0.2;
    display: flex;
    flex-direction: column;
    place-content: center;
    place-items: center;
    flex: 1 1 520px;
    text-align: center;

    &:hover,
    &.selected {
      --album-vinyl-stick-out: 0.55;
    }
  }

  // List
  &.album--list {
    --album-width: 53px;
    --album-vinyl-stick-out: 0;
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 1.5em 2em 1.5em;

    &:hover,
    &.selected {
      --album-vinyl-stick-out: 0.55;
    }

    .album-title--container {
      display: flex;
      align-items: center;
      gap: 1em;
      padding-left: 1em;
      max-width: 75%;
    }

    .album-title--container,
    .album-title,
    .album-authors,
    .album-information {
      flex: 1 1;
    }

    .album-title,
    .album-authors {
      flex-basis: 400px;
    }

    .album-information {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 1em;
      margin-left: auto;
    }
  }

  // Coverflow
  &.album--coverflow {
    --album-width: 350px;
    --album-vinyl-stick-out: 0;
    grid-column: 1;
    grid-row: 1;
    padding: 0;
    background-color: unset;
    opacity: 0;
    scale: 0.5;
    pointer-events: none;
    .transit();

    .album-title--container {
      text-align: center;
    }

    // States
    &.coverflow-active {
      scale: 1;
      opacity: 1;
      z-index: 3;
    }

    &.coverflow-1 {
      translate: -50% -2.5%;
    }
    &.coverflow\+1 {
      translate: 50% -2.5%;
    }
    &.coverflow-2 {
      translate: -90% -5%;
    }
    &.coverflow\+2 {
      translate: 90% -5%;
    }

    &.coverflow-1,
    &.coverflow\+1 {
      scale: 0.78;
      opacity: 1;
      z-index: 2;

      :deep(.album-cover-front) {
        img,
        &::before,
        &::after {
          opacity: 0.66;
        }
      }
    }

    &.coverflow-2,
    &.coverflow\+2 {
      scale: 0.57;
      opacity: 1;
      z-index: 1;

      :deep(.album-cover-front) {
        img,
        &::before,
        &::after {
          opacity: 0.33;
        }
      }
    }

    &.coverflow-1,
    &.coverflow\+1,
    &.coverflow-2,
    &.coverflow\+2 {
      .album-title--container {
        opacity: 0;
      }
    }

    &.coverflow-active,
    &.coverflow-1,
    &.coverflow\+1,
    &.coverflow-2,
    &.coverflow\+2 {
      pointer-events: initial;
    }
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
