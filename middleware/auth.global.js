import { jwtDecode } from "jwt-decode";

export default defineNuxtRouteMiddleware(async (to, from) => {
    let passURL = ['/']
    if (!passURL.includes(to.path)) {
            let token = userStore().getToken()
            if(import.meta.client){
            const decoded = jwtDecode(token)
            if(!token){
                return navigateTo({
                    path: '/error',
                    query: {
                        code: 401,
                        msg: 'Unauthorized'
                    }
                })
            }
            if(token && decoded.exp*1000 < Date.now()){
                userStore().setToken('')
                return navigateTo({
                    path: '/error',
                    query: {
                        code: 401,
                        msg: 'token expired'
                    }
                })
            }
        }
    }
})
