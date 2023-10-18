<script setup lang="ts">
import { Album, Side } from "~/types/globalTypes";

const props = withDefaults(
  defineProps<{
    album: Album;
    side?: Side;
    size?: number;
    rotation: "constant" | "teaser";
  }>(),
  {
    size: 120,
    rotation: "teaser",
  },
);

const vinylTexture = computed(() => {
  return props.album.fields?.sides[0]?.fields?.vinyl?.fields?.file?.url;
});
const vinylLabel = computed(() => {
  return props.album.fields?.sides[0]?.fields?.label?.fields?.file?.url;
});
</script>

<template>
  <div
    class="album-vinyl"
    :class="{ 'album-vinyl--rotation-constant': rotation === 'constant' }"
  >
    <div class="album-vinyl-texture">
      <img v-if="vinylTexture" :src="vinylTexture" alt="" />
    </div>
    <div class="album-vinyl-label">
      <img v-if="vinylLabel" :src="vinylLabel" alt="" />
    </div>
    <div class="album-vinyl-cut-out"></div>
  </div>
</template>

<style lang="less">
@import (reference) "../assets/less/global.less";

.album-vinyl {
  --transition-property: rotate;
  display: grid;
  place-items: center;
  position: absolute;
  width: calc(var(--album-width, 120px) * 0.9);
  right: 0;
  aspect-ratio: 1;
  border-radius: 100%;
  rotate: calc(
    var(--album-vinyl-rotation-constant, 0deg) +
      (1deg * 180 * var(--album-vinyl-stick-out))
  );
  z-index: 1;
  .transit();

  &:not(:has(img)) {
    background-color: #161b16; // default
  }

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

  // Constant Rotation
  &.album-vinyl--rotation-constant {
    animation: constantRotation var(--album-vinyl-rotation-time) linear infinite;
  }
}

@property --album-vinyl-rotation-constant {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0deg;
}
@property --album-vinyl-rotation-rpm {
  syntax: "<number>";
  inherits: true;
  initial-value: 45;
}
@property --album-vinyl-rotation-time {
  syntax: "<time>";
  inherits: true;
  initial-value: 1.33s;
}
@property --album-vinyl-rotation {
  syntax: "<number>";
  inherits: true;
  initial-value: 0;
}

@keyframes constantRotation {
  0% {
    --album-vinyl-rotation-constant: 0deg;
  }
  100% {
    --album-vinyl-rotation-constant: 360deg;
  }
}
</style>
