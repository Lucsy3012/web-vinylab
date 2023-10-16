<script setup lang="ts">
import {
  PhUser,
  PhMagnifyingGlass,
  PhPlaylist,
  PhMusicNotesSimple,
  PhSignOut,
} from "@phosphor-icons/vue";
import { useSettings } from "@/stores/settings";

const settings = useSettings();

// Get mode active styles
const activeIndicator = ref<HTMLElement | null>(null);
const btnModeExplore = ref<HTMLElement | null>(null);
const btnModeExperience = ref<HTMLElement | null>(null);

function getActiveIndicatorPosition() {
  if (settings?.mode === "explore") {
    return {
      width: btnModeExplore.value?.offsetWidth,
      left: btnModeExplore.value?.offsetLeft,
    };
  } else {
    return {
      width: btnModeExperience.value?.offsetWidth,
      left: btnModeExperience.value?.offsetLeft,
    };
  }
}

function setActiveIndicatorPosition() {
  const { width, left } = getActiveIndicatorPosition();
  activeIndicator.value?.style.setProperty("--width", `${width}px`);
  activeIndicator.value?.style.setProperty("--left", `${left}px`);
}

// Switch Modes
function switchMode(mode: "explore" | "experience") {
  if (mode === "explore") {
    settings.setMode("experience");
  } else {
    settings.setMode("explore");
  }

  getActiveIndicatorPosition();
  setActiveIndicatorPosition();
}

// Logout
const localePath = useLocalePath();
const { auth } = useSupabaseClient();

// Logout
const router = useRouter();
function logout() {
  auth.signOut().then(() => {
    router.push(localePath("/login"));
  });
}

onMounted(() => {
  getActiveIndicatorPosition();
  setActiveIndicatorPosition();
});
</script>

<template>
  <header class="header">
    <section>
      <div class="stretch">
        <div class="row">
          <div class="col col-12">
            <div class="header--container">
              <div class="header--navigation">
                <div
                  ref="btnModeExplore"
                  class="btn btn--transparent btn--mode btn--mode--explore"
                  :class="{ active: settings?.mode !== 'experience' }"
                  @click="switchMode('experience')"
                  tabindex="0"
                >
                  <PhPlaylist :size="22" weight="regular" />
                  <span>Explore</span>
                </div>
                <div
                  ref="btnModeExperience"
                  class="btn btn--transparent btn--mode btn--mode--experience"
                  :class="{ active: settings?.mode === 'experience' }"
                  @click="switchMode('explore')"
                  tabindex="0"
                >
                  <PhMusicNotesSimple :size="22" weight="regular" />
                  <span>Experience</span>
                </div>
                <div ref="activeIndicator" class="active-indicator" />
              </div>
              <div class="header--logo">
                <NuxtLink to="/">
                  <img src="/logo.svg" alt="Logo" height="40" />
                </NuxtLink>
              </div>
              <div class="header--actions">
                <div class="header--icon header--icon--user">
                  <PhUser :size="22" color="#1B1B1B" weight="regular" />
                </div>
                <div class="header--icon header--icon--search">
                  <PhMagnifyingGlass
                    :size="22"
                    color="#1B1B1B"
                    weight="regular"
                  />
                </div>
                <div
                  class="header--icon header--icon--sign-out"
                  @click="logout"
                >
                  <PhSignOut :size="22" color="#1B1B1B" weight="regular" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </header>
</template>

<style lang="less" scoped>
@import (reference) "../assets/less/global.less";

.header--container {
  display: flex;
  gap: 2em;
}

.header--navigation {
  --transition-duration: 1s;
  --transition-timing-function: var(--bezier-slow-in-fast-out);
  position: relative;
  display: flex;
  align-items: center;

  .btn.btn--mode {
    color: var(--site-color-50);
    z-index: 1;

    &:hover,
    &.active {
      color: var(--site-color);
    }
  }
  .active-indicator {
    position: absolute;
    width: var(--width, 142px);
    height: 100%;
    left: var(--left, 0);
    border-radius: 4em;
    background-color: var(--site-contrast);
    z-index: 0;
    .transit();
  }

  // Modes
  .btn.btn--mode--experience.active {
    ~ .active-indicator {
      background-color: var(--site-contrast-33);
    }
  }
}
.header--logo {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
}
.header--actions {
  display: flex;
  align-items: center;
  gap: 0.25em;
  margin-left: auto;

  .header--icon {
    --transition-duration: 0.1s;
    --transition-timing-function: ease-in-out;
    --transition-property: background-color;
    padding: 0.875em;
    border-radius: 50%;
    cursor: pointer;
    .transit();

    &:hover {
      background-color: var(--site-contrast-33);
    }
    &.active {
      background-color: var(--site-contrast);
    }

    :deep(svg) {
      display: block;
    }
  }
}
</style>
