<template>
  <v-app>
    <v-main>
      <v-container class="fill-height pa-0" fluid>
        <v-img
            src="../assets/whu.jpg"
            cover
            height="100vh"
        >
          <v-row class="fill-height" align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
              <v-card
                  class="pa-4"
                  elevation="0"
                  color="transparent"
              >
                <v-card-title class="text-h2 text-center text-white mb-6">Lib</v-card-title>
                <v-form @submit.prevent="handleLogin">
                  <v-text-field
                      v-model="user.username"
                      label="Name"
                      variant="outlined"
                      color="white"
                      bg-color="rgba(255, 255, 255, 0.1)"
                      class="mb-4 transparent-input"
                      :rules="[rules.required]"
                  ></v-text-field>
                  <v-text-field
                      v-model="user.password"
                      label="Password"
                      variant="outlined"
                      color="white"
                      bg-color="rgba(255, 255, 255, 0.1)"
                      class="mb-6 transparent-input"
                      :rules="[rules.required]"
                      type="password"
                  ></v-text-field>
                  <v-btn
                      block
                      x-large
                      color="white"
                      class="mb-6 transparent-button"
                      type="submit"
                      height="50"
                  >
                    Next
                  </v-btn>
                </v-form>
                <v-card-text class="text-center text-caption text-white">
                  © 2024 WHU. All Rights Reserved.
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-img>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {ref} from 'vue'

export default {
  setup() {
    definePageMeta({
      layout: false,
    })
    const user = ref({
      username: '',
      password: '',
    });
    const rules = {
      required: (value) => !!value || '不能为空',
    };
    const router = useRouter();
    const userStoreInstance = userStore();
    const handleLogin = () => {
      PostApi('/login', user.value).then(res => {
        userStoreInstance.setToken(res.data.token);
        useNuxtApp().$toast.success(res.msg);
        router.push('/home');
      })
    }

    return {
      user,
      rules,
      handleLogin
    }
  }
}
</script>

<style>
.transparent-input {
  background: rgba(255, 255, 255, 0.1) !important;
}

.transparent-input .v-field__outline {
  opacity: 0.9 !important;
}

.transparent-input .v-field__input {
  color: white !important;
}

.transparent-input .v-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.transparent-button {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  transition: all 0.3s ease;
  opacity: 0.5 !important;
}

.transparent-button:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}
</style>
