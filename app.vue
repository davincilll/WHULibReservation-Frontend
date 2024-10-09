<template>
    <div>
    <v-btn @click="showToast">Show Toast</v-btn>
  <NuxtPage />

  </div>

</template>

<script setup>
const { $toast } = useNuxtApp()
const showToast = () => {
   
  $toast.success('注册成功', { timeout: 3000 })
}
</script>
