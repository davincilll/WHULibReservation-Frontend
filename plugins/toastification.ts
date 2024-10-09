import toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
//全局参数配置
const options = {
    position:'top-right',//top-left,top-center,top-right,bottom-left,bottom-center,bottom-right
    autoClose:3000,
    hideProgressBar:true,
    closeButton:true,
    theme:'colored',//auto,colored,dark,light
    transition:'bounce',//bounce,flip,slide,zoom
    pauseOnFocusLoss:true,
    pauseOnHover:true,
    rtl:false,
    style: {
      opacity: '0.95',
      userSelect: 'none',
      zIndex:'40',
      borderRadius: '12px', // 圆角
    },

};
//以下代码为NUXT3全局注册组件
export default defineNuxtPlugin(nuxtApp => {// defineNuxtPlugin 是全局的，不需要手动引入即可使用，不会报错
  nuxtApp.vueApp.use(toastify,options);
  return {provide:{toast}};
})