<template>
  <v-app>
    <v-main>
      <v-container class="fill-height pa-0" fluid>
        <v-img
            src="../assets/lib.svg"
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
                <v-card-title class="text-center mb-6 logo-container">
                  <img src="../assets/whu.svg" alt="W" class="logo"/>
                </v-card-title>
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
import { jwtDecode } from 'jwt-decode';
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

        if (!res.token) {
          return
        }
        userStoreInstance.setToken(res.token);
        useNuxtApp().$toast.success(res.msg);
        router.push('/home');
      })
    }
    onMounted(() => {
      const token = userStoreInstance.getToken();
      if (token) {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
          //自动登陆
          router.push('/home');
        }
      }
    });
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
  background: rgba(255, 255, 255, 0.05) !important; /* 更低的透明度 */
  opacity: 0.9 !important; /* 更低的整体透明度 */
}

.transparent-input .v-field__outline {
  opacity: 0.9 !important; /* 更低的透明度 */
}

.transparent-input .v-field__input {
  color: white !important; /* 字体颜色 */
}

.transparent-input .v-label {
  color: rgba(255, 255, 255, 0.9) !important; /* 更低的透明度 */
}

.transparent-button {
  background: rgba(255, 255, 255, 0.2) !important; /* 保持原样 */
  color: white !important; /* 按钮字体颜色 */
  transition: all 0.3s ease;
  opacity: 0.7 !important; /* 更低的透明度 */
}

.transparent-button:hover {
  background: rgba(255, 255, 255, 0.3) !important; /* 保持原样 */
}

.logo-container {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
}

.logo {
  width: 150px; /* 设置 SVG 的宽度 */
  height: auto; /* 保持宽高比 */
  margin: 0 5px; /* 设置图标之间的间距 */
}
</style>
