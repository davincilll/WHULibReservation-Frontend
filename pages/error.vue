<template>

</template>

<script>
onMounted(() => {
  const route = useRouter()
  if(route.query.code){
    useNuxtApp().$toast.error(route.query.msg)
    userStore().setToken("")
    navigateTo("/")
  }
})
</script>

<style>

</style>
