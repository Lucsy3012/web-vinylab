<script setup lang="ts">
import { ref, watch } from "vue-demi";
import { useEventListener, useMouseInElement, useVModel } from "@vueuse/core";

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  secondary: { type: Number, default: 0 },
  modelValue: { type: Number, required: true },
});

const emit = defineEmits(["update:modelValue"]);

const scrubber = ref();
const scrubbing = ref(false);
const pendingValue = ref(0);

useEventListener("mouseup", () => (scrubbing.value = false));

const value = useVModel(props, "modelValue", emit);
const { elementX, elementWidth } = useMouseInElement(scrubber);

watch([scrubbing, elementX], () => {
  const progress = Math.max(
    0,
    Math.min(1, elementX.value / elementWidth.value),
  );
  pendingValue.value = progress * props.max;
  if (scrubbing.value) value.value = pendingValue.value;
});
</script>

<template>
  <div ref="scrubber" class="scrubber-container" @mousedown="scrubbing = true">
    <div class="scrubber-outer">
      <div
        class="scrubber-inner"
        :style="{ transform: `translateX(${(secondary / max) * 100 - 100}%)` }"
      />
      <div
        :style="{ transform: `translateX(${(value / max) * 100 - 100}%)` }"
      />
    </div>
    <div class="scrubber-pointer" :class="{ active: scrubbing }">
      <slot
        :pending-value="pendingValue"
        :position="`${Math.max(0, Math.min(elementX, elementWidth))}px`"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.scrubber-container {
  position: relative;
  height: 6px;
  background: var(--site-color-25);
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
}

.scrubber-outer {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.scrubber-inner {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--site-color);
  border-radius: 10px;

  + div {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--site-color);
    border-radius: 10px;
  }
}

.scrubber-pointer {
  position: absolute;
  inset: 0;
  opacity: 0;

  &:hover,
  &.active {
    opacity: 1;
  }
}
</style>
