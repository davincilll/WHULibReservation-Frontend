<template>
</template>

<script setup>
import { onMounted } from 'vue'


const route = useRoute()

onMounted(() => {
  if (route.query.code) {
    useNuxtApp().$toast.error(route.query.msg)
    userStore().setToken("")
    setTimeout(() => {
      navigateTo("/")
    }, 2000)
  }
})
</script>

<style>
/* 你的样式 */
</style>