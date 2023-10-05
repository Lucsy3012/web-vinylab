<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const user = useSupabaseUser();

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/de");
    }
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <p>Redirecting...</p>
  </div>
</template>
