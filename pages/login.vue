<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const localePath = useLocalePath();

// Auth
const user = useSupabaseUser();
const { auth } = useSupabaseClient();

const redirectTo = localePath("/");

watchEffect(() => {
  if (user.value) {
    navigateTo(redirectTo);
  }
});

const formEmail = ref("");
const formPassword = ref("");
const errorType = ref("");

async function loginWithEmail() {
  console.log(formEmail, formPassword);

  const { data, error } = await auth.signInWithPassword({
    email: formEmail.value,
    password: formPassword.value,
  });

  if (error) {
    errorType.value = error.message;
  }
}
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="loginWithEmail" :class="{ error: errorType }">
      <input v-model="formEmail" type="email" placeholder="Email" />
      <input v-model="formPassword" type="password" placeholder="Password" />
      <div v-if="errorType" class="message">{{ errorType }}</div>
      <button type="submit">Login</button>
    </form>

    <!--
    <div
      @click="
        auth.signInWithOAuth({ provider: 'github', options: { redirectTo } })
      "
    >
      Login via GitHub
    </div>
    -->
  </div>
</template>
