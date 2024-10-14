// utils/api.js

export const apiCore = async (url, options = {}) => {
    const config = useRuntimeConfig();
    const nuxtApp = useNuxtApp();

    try {
        const token = userStore().getToken(); // 获取 token
        const response = await $fetch(url, {
            baseURL: config.public.baseURL,
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });


        if (response.code !== 200) {
            if (import.meta.client) {
                nuxtApp.$toast.error(response.msg);
            } else {
                nuxtApp.runWithContext(() => {
                    navigateTo({
                        path: '/error',
                        query: { code: response.code, msg: response.msg },
                    });
                });
            }
            // throw new Error(response.msg);
        }

        return response.data; // 只返回 data 部分
    } catch (error) {
        // console.error("请求失败:", error);
        if (import.meta.client) {
            nuxtApp.$toast.error(error.message);
        } else {
            nuxtApp.runWithContext(() => {
                navigateTo({
                    path: '/error',
                    query: { msg: error.message },
                });
            });
        }
        throw error;
    }
};
// utils/api.js

export const GetApi = (url, params = {}, options = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await apiCore(url, {
                method: 'GET',
                params, // 查询参数
                ...options,
            });
            resolve(data); // 成功返回数据
        } catch (error) {
            reject(error); // 捕获错误
        }
    });
};

export const PostApi = (url, data = {}, options = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await apiCore(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers, // 合并外部传入的 headers
                },
                body: data, // 请求体，$fetch 会自动序列化为 JSON
                ...options,
            });
            resolve(response); // 成功返回数据
        } catch (error) {
            reject(error); // 捕获错误
        }
    });
};
