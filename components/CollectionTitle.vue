<script setup lang="ts">
import { Asset } from "contentful";

const props = defineProps<{
  name: string;
  avatar: Asset;
  records?: number;
}>();
</script>

<template>
  <div class="artist">
    <div v-if="avatar.fields?.file?.url" class="avatar">
      <picture>
        <source
          media="screen and (min-width: 768px)"
          :srcset="`https:${avatar.fields?.file?.url}?w=72&h=72&fm=webp&q=90 1x, https:${avatar.fields?.file?.url}?w=144&h=144&fm=webp&q=90 2x`"
          type="image/webp"
        />
        <source
          media="screen and (min-width: 768px)"
          :srcset="`https:${avatar.fields?.file?.url}?w=72&h=72&fm=jpg&q=90 1x, https:${avatar.fields?.file?.url}?w=144&h=144&fm=jpg&q=90 2x`"
          type="image/jpg"
        />
        <img
          :src="avatar.fields?.file?.url"
          :alt="name"
          width="72"
          height="72"
        />
      </picture>
    </div>
    <div class="text--holder">
      <div class="eyebrow-1 text--upper records">
        {{ props.records }} {{ $t("collections.records") }}
      </div>
      <h2 class="title-1">{{ name }}</h2>
    </div>
  </div>
</template>

<style lang="less">
.artist {
  display: flex;
  align-items: center;
  gap: 2em;

  .text--holder {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
}
.avatar {
  width: 4.5em;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
}
</style>
