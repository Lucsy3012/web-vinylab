<script setup lang="ts">
import { useSettings } from "@/stores/settings";
import { Album, Artist, Side } from "~~/types/globalTypes";

const settings = useSettings();
const displayType = ref(settings?.display); // make watchable

const props = defineProps<{
  album: Album;
}>();

const artistsList = computed(() => {
  const allArtists = props.album?.fields?.artists as Artist[];
  return allArtists.map((artist) => artist.fields.artistName).join(", ");
});

const vinylTexture = computed(() => {
  return props.album.fields?.sides[0]?.fields?.vinyl?.fields?.file?.url;
});
const vinylLabel = computed(() => {
  return props.album.fields?.sides[0]?.fields?.label?.fields?.file?.url;
});
</script>

<template>
  <div class="album" :class="`album--${settings.display}`">
    <!-- todo album cover component -->
    <div class="album-cover">
      <!-- todo build picture component -->
      <div class="album-cover-front">
        <picture>
          <source
            media="screen and (min-width: 768px)"
            :srcset="`${props.album.fields?.albumCoverFront?.fields?.file?.url}?w=120&h=120&fm=webp&q=90, ${props.album.fields?.albumCoverFront?.fields?.file?.url}?w=240&h=24880&fm=webp&q=90`"
            type="image/webp"
          />
          <source
            media="screen and (min-width: 768px)"
            :srcset="`${props.album.fields?.albumCoverFront?.fields?.file?.url}?w=120&h=120&fm=jpg&q=90, ${props.album.fields?.albumCoverFront?.fields?.file?.url}?w=240&h=240&fm=jpg&q=90`"
            type="image/jpeg"
          />
          <img
            :src="props.album.fields?.albumCoverFront?.fields?.file?.url"
            :alt="props.album.fields?.albumCoverFront?.fields?.title"
            width="120"
            height="120"
          />
        </picture>
      </div>
      <div class="album-vinyl">
        <div class="album-vinyl-texture">
          <img v-if="vinylTexture" :src="vinylTexture" alt="" />
        </div>
        <div class="album-vinyl-label">
          <img v-if="vinylLabel" :src="vinylLabel" alt="" />
        </div>
        <div class="album-vinyl-cut-out"></div>
      </div>
    </div>
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

  .album-cover {
    --transition-property: padding;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    position: relative;
    width: var(--album-width, 120px);
    height: var(--album-width, 120px);
    box-sizing: content-box;
    padding-right: calc(
      var(--album-width, 120px) * var(--album-vinyl-stick-out, 0.2)
    );
    .transit();

    img {
      display: block;
    }
    .album-cover-front {
      position: relative;
      box-shadow:
        1px 1px 2px var(--site-color-10),
        5px 0 5px -5px var(--site-color-50);
      overflow: hidden;
      z-index: 2;
      .--rounded-xs();

      img {
        display: block;
      }

      // Shadow
      &::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 50%;
        pointer-events: none;
        background: linear-gradient(
          190deg,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0.2) 100%
        );
      }

      // Glare
      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        translate: 15% -50%;
        width: 90%;
        height: 90%;
        border-radius: 100%;
        pointer-events: none;
        background: radial-gradient(
          rgba(255, 255, 255, 0.66),
          rgba(255, 255, 255, 0) 80%
        );
      }
    }
    .album-vinyl {
      --transition-property: rotate;
      display: grid;
      place-items: center;
      position: absolute;
      width: calc(var(--album-width, 120px) * 0.9);
      right: 0;
      aspect-ratio: 1;
      border-radius: 100%;
      background-color: #161b16; // default
      rotate: calc(
        var(--album-vinyl-rotation-constant, 0deg) +
          (1deg * 180 * var(--album-vinyl-stick-out))
      );
      z-index: 1;
      .transit();

      .album-vinyl-texture,
      .album-vinyl-label,
      .album-vinyl-cut-out {
        grid-row: 1;
        grid-column: 1;
        position: relative;
        border-radius: 100%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .album-vinyl-texture {
        width: 100%;
        height: 100%;
        z-index: 1;

        &::before {
          content: "";
          z-index: 5;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.33;
          rotate: -45deg;
          .vinyl-highlights-1();
        }
      }
      .album-vinyl-label {
        width: 36.8%;
        height: 36.8%;
        background-color: var(--site-accent-33);
        z-index: 2;
      }
      .album-vinyl-cut-out {
        width: 3.15%;
        height: 3.15%;
        background-color: var(--site-accent);
        z-index: 3;
      }
    }
  }

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
