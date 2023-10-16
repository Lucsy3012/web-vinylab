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
</script>

<template>
  <div class="album-cover">
    <AlbumCoverFront :album="props.album" :size="props.size" />
    <AlbumVinyl :album="props.album" :rotation="props.rotation" />
  </div>
</template>

<style lang="less">
@import (reference) "../assets/less/global.less";

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
}
</style>
