<script setup lang="ts">
// i18n
const localePath = useLocalePath();

// Auth
const { auth } = useSupabaseClient();

// Logout
const router = useRouter();
function logout() {
  auth.signOut().then(() => {
    router.push(localePath("/login"));
  });
}
</script>

<template>
  <section v-if="auth">
    <div @click="logout">Logout</div>
  </section>
</template>
