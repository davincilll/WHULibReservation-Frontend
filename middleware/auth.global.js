import { jwtDecode } from "jwt-decode";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStoreInstance = userStore();
  const token = userStoreInstance.getToken();

  const publicPaths = ['/']; 
  const isLoginPage = to.path === '/'; 

  if (token) {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      userStoreInstance.setToken('');
      return navigateTo({
        path: '/error',
        query: {
          code: 401,
          msg: 'token expired',
        },
      });
    }

    if (isLoginPage) {
      return navigateTo('/home');
    }
  } else if (!publicPaths.includes(to.path)) {
    return navigateTo({
      path: '/error',
      query: {
        code: 401,
        msg: 'Unauthorized',
      },
    });
  }
});