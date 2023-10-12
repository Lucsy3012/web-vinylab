<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const { t } = useI18n();
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
    <section>
      <div class="stretch">
        <div class="row justify-content--center">
          <div class="col col-4 col-max">
            <div class="logo text--center">
              <img src="/logo.svg" alt="vinylab" height="40" />
            </div>
            <Box>
              <h2 class="title-1">{{ $t("auth.login.title") }}</h2>
              <form @submit.prevent="loginWithEmail">
                <!-- Email -->
                <div class="form--group">
                  <input
                    v-model="formEmail"
                    type="email"
                    :placeholder="t('auth.login.email')"
                  />
                </div>

                <!-- Password -->
                <div class="form--group">
                  <input
                    v-model="formPassword"
                    type="password"
                    :placeholder="t('auth.login.password')"
                  />
                </div>

                <!-- Message -->
                <div v-if="errorType" class="form--group">
                  <div class="form--error mb2">{{ errorType }}</div>
                </div>

                <!-- Submit -->
                <div class="form--group">
                  <div class="btn--group fill">
                    <button class="btn" type="submit">
                      {{ $t("auth.login.title") }}
                    </button>
                  </div>
                </div>
              </form>
            </Box>
            <small class="version display--block text--center --site-color-50">
              Version 0.1.0
            </small>
          </div>
        </div>
      </div>
    </section>

    <!--
    <div@click="auth.signInWithOAuth({ provider: 'github', options: { redirectTo } })">
      Login via GitHub
    </div>
    -->
  </div>
</template>

<style lang="less" scoped>
.logo {
  animation: 0.75s logoInitialization ease-in-out forwards;
}
.box {
  width: 100%;
  margin: 3em 0;
  animation: 0.75s boxInitialization ease-in-out forwards;

  form {
    margin: 2em 0;
  }
}
.version {
  animation: 0.75s initialization ease-in-out forwards;
}

@keyframes logoInitialization {
  from {
    opacity: 0;
    translate: 0 40px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
@keyframes boxInitialization {
  from {
    opacity: 0;
    translate: 0 40px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
@keyframes versionInitialization {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
