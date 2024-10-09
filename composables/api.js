export const apiCore = (url, options = {}) => {
    const config = useRuntimeConfig();
    const nuxtApp = useNuxtApp();
    return useFetch(url, {
        baseURL: config.public.baseURL,
        onRequest({ options }) {
            let token = userStore().getToken();
            options.headers = {
                Authorization: `Bearer ${token}`,
                ...options.headers,  
            };
        },
        onResponse({response}){
            //2xx以内
            if (response.status>=200&&response.status<300){
                if(response._data.code !==200){
                    if(import.meta.client){
                        nuxtApp.$toast.error(response._data.msg);
                    }else{
                        nuxtApp.runWithContext(()=>{
                            navigateTo({
                                path: '/error',
                                query: {
                                code: response._data.code,
                                msg: response._data.msg
                                }
                            })
                        })
                    }
                }
            }
        },
        onResponsError({response}){
                    if(import.meta.client){
                        nuxtApp.$toast.error(response._data.msg);
                    }else{
                        nuxtApp.runWithContext(()=>{
                            navigateTo({
                                path: '/error',
                                query: {
                                code: response._data.code,
                                msg: response._data.msg
                                }
                            })
                        })
                    }     
        },
        ...options,  
    });
};
export const PostApi = (url, data = {}, options = {}) => {
    return new Promise((resolve, reject) => {
        apiCore(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers // 合并外部传入的 headers
            },
            body: JSON.stringify(data),  // 将数据序列化为 JSON
            ...options  // 允许外部传递其他配置
        }).then((res) => {
            resolve(res.data.value);
        }).catch((err) => reject(err));
    });
};