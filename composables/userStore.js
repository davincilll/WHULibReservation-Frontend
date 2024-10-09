import { defineStore } from "pinia";

export const userStore = defineStore("userStore", ()=>{
    const token = ref("")
    const setToken = (value) =>{
        token.value = value
    }
    const getToken = () =>{ return token.value }
    //暴露 方法
    return { token, setToken, getToken }
},{
    persist:{ storage:persistedState.localStorage }
});