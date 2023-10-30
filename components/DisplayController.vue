<script setup lang="ts">
import {
  PhSquareLogo,
  PhSquaresFour,
  PhListBullets,
} from "@phosphor-icons/vue";
import { useSettings } from "@/stores/settings";

const settings = useSettings();
const { t } = useI18n();

// Display modes
const displayModes = ref([
  {
    id: "grid",
    label: t("display.modes.grid"),
  },
  {
    id: "list",
    label: t("display.modes.list"),
  },
  {
    id: "coverflow",
    label: t("display.modes.coverflow"),
  },
]);
</script>

<template>
  <div class="display-controller justify-content--end align-items--center">
    <span class="label">{{ $t("display.label") }}</span>
    <div class="display-modes">
      <div
        v-for="displayMode in displayModes"
        class="display-mode"
        :key="displayMode.id"
        :title="displayMode.label"
        :class="{ active: settings.display === displayMode.id }"
        @click="settings.setDisplay(displayMode.id)"
      >
        <PhSquareLogo
          v-if="displayMode.id === 'coverflow'"
          size="22"
          color="#1B1B1B"
          weight="regular"
        />
        <PhSquaresFour
          v-if="displayMode.id === 'grid'"
          size="22"
          color="#1B1B1B"
          weight="regular"
        />
        <PhListBullets
          v-if="displayMode.id === 'list'"
          size="22"
          color="#1B1B1B"
          weight="regular"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import (reference) "../assets/less/global.less";

.display-controller {
  display: flex;
  gap: 0.5em;

  .display-modes {
    display: flex;

    .display-mode {
      display: grid;
      place-items: center;
      place-content: center;
      padding: 0.75em;
      cursor: pointer;
      opacity: 1;
      .transit();

      &:not(.active) {
        opacity: 0.33;

        &:hover {
          opacity: 0.66;
        }
      }
    }
  }
}
</style>
