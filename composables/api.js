export const apiCore = async(url, options = {}) => {
    //fix 第一次刷新会访问不到数据
    await nextTick();
    const config = useRuntimeConfig();
    const nuxtApp = useNuxtApp();
    return useFetch(url, {
        
        baseURL: config.public.baseURL,
        // key:md5(obj.url+(queryData||bodyData)??(JSON.stringify(queryData||bodyData))),
        ...options,
        onRequest({ options }) {
            let token = userStore().getToken();
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            };
        },
        onResponse({response}){
            //2xx以内
            if (response.status>=200&&response.status<300){
                if(response._data.code !==200){
                    if(import.meta.client){
                        // console.log(response._data.msg);
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
        onResponseError({response}){
            if (response.status < 200 || response.status >= 300) {
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
        },
        ...options,
    });
};
export const GetApi = (url, params = {}, options = {}) => {
    return new Promise((resolve, reject) => {
        apiCore(url, {
            method: 'GET',
            headers: {
                ...options.headers // 合并外部传入的 headers
            },
            params,  // 将数据序列化为 JSON
            ...options  // 允许外部传递其他配置
        }).then((res) => {
            if (res && res.data._value) {
                if(res.data._value.code === 200){
                    resolve(res.data._rawValue.data);
                }
              }
        }).catch((err) => reject(err));
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
            if (res.data.value.code === 200) {
                resolve(res.data.value);
            }
        }).catch((err) => reject(err));
    });
};
