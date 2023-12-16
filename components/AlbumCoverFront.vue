<script setup lang="ts">
import { Album, Side } from "~~/types/globalTypes";

const props = withDefaults(
  defineProps<{
    album: Album;
    side?: Side;
    size?: number;
  }>(),
  {
    size: 120,
  },
);

const sizeDouble = computed(() => {
  return props.size ? props.size * 2 : 240;
});
</script>

<template>
  <div class="album-cover-front">
    <picture>
      <source
        media="screen and (min-width: 768px)"
        :srcset="`https:${props.album.fields?.albumCoverFront?.fields?.file?.url}?w=${props.size}&h=${props.size}&fm=webp&q=90 1x, https:${props.album.fields?.albumCoverFront?.fields?.file?.url}?w=${sizeDouble}&h=${sizeDouble}&fm=webp&q=90 2x`"
        type="image/webp"
      />
      <source
        media="screen and (min-width: 768px)"
        :srcset="`https:${props.album.fields?.albumCoverFront?.fields?.file?.url}?w=${props.size}&h=${props.size}&fm=jpg&q=90 1x, https:${props.album.fields?.albumCoverFront?.fields?.file?.url}?w=${sizeDouble}&h=${sizeDouble}&fm=jpg&q=90 2x`"
        type="image/jpg"
      />
      <img
        :src="props.album.fields?.albumCoverFront?.fields?.file?.url"
        :alt="props.album.fields?.albumCoverFront?.fields?.title"
        :width="props.size"
        :height="props.size"
      />
    </picture>
  </div>
</template>

<style lang="less">
@import (reference) "../assets/less/global.less";

.album-cover-front {
  --transition-property: background;
  position: relative;
  box-shadow:
    1px 1px 2px var(--site-color-10),
    5px 0 5px -5px var(--site-color-50);
  background-color: var(--site-accent);
  overflow: hidden;
  z-index: 2;
  .--rounded-xs();
  .transit();

  img {
    width: var(--album-width, 120px);
    height: var(--album-width, 120px);
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
</style>
