<script setup lang="ts">
import { PhMagnifyingGlass } from "@phosphor-icons/vue";
import { useSettings } from "@/stores/settings";

const settings = useSettings();
</script>

<template>
  <div class="filter-bar form">
    <label for="filter">
      <PhMagnifyingGlass
        :class="{ active: settings.filter !== '' }"
        size="22"
        color="#1B1B1B"
        weight="regular"
        class="search-icon"
      />
    </label>
    <input
      id="filter"
      class="input--transparent"
      type="text"
      :placeholder="$t('filter.label')"
      v-model="settings.filter"
    />
  </div>
</template>

<style lang="less" scoped>
@import (reference) "../assets/less/global.less";

.filter-bar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 1em;

  label {
    display: grid;
    place-items: center;
    place-content: center;
    cursor: pointer;
  }
  input {
    --input-padding-x: 0.25em;
  }
  .search-icon {
    opacity: 0.33;
    .transit();

    &.active {
      opacity: 1;
    }
  }
  &:hover {
    .search-icon:not(.active) {
      opacity: 0.66;
    }
  }
}
</style>
