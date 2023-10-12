<script setup lang="ts">
const props = defineProps({
  size: {
    type: String,
    default: "m",
  },
  solid: {
    type: Boolean,
    default: true,
  },
  shadow: {
    type: Boolean,
    default: true,
  },
});

const classes = computed(() => {
  return [
    `box--size-${props.size}`,
    props.solid ? "box--solid" : "",
    props.shadow ? "box--shadow" : "",
  ];
});
</script>

<template>
  <div class="box" :class="classes">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
@import (reference) "../assets/less/variables.less";

.box {
  &.box--size-m {
    padding: 3em;
    border-radius: 2em;
  }
  &.box--solid {
    background-color: var(--site-contrast);
  }
  &.box--shadow {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
