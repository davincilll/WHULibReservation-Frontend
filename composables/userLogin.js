// export const login =  (user) => {
//       const res =  PostApi('/login', user);
//       const router = useRouter();
//       const userStoreInstance = userStore();
//       console.log(res.data);
//       userStoreInstance.setToken(res.data.token);
//       // 显示登录成功的提示
//       useNuxtApp().$toast.success(res.msg);
//       // 跳转到首页
//        router.push('/');
// };