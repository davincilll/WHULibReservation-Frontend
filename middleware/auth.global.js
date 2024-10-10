export default defineNuxtRouteMiddleware(async (to, from) => {
    let passURL = ['/']
    if (!passURL.includes(to.path)) {
            let token = userStore().getToken()
            if(import.meta.client){
            if(!token){
                return navigateTo({
                    path: '/',
                    query: {
                        code: 401,
                        msg: 'Unauthorized'
                    }
                })
            }
        }
    }
})
