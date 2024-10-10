<template>
    <div>
      <NuxtPage />
      <footer>
        <div class="footer-item" @click="navigateTo('home')">
          <v-icon class="footer-icon">mdi-home</v-icon>
          <span class="button-text">首页</span>
        </div>
        <div class="separator"></div>
        <div class="footer-item" @click="navigateTo('history')">
          <v-icon class="footer-icon">mdi-book-open</v-icon>
          <span class="button-text">历史预约</span>
        </div>
        <div class="separator"></div>
        <div class="footer-item" @click="navigateTo('profile')">
          <v-icon class="footer-icon">mdi-account-circle</v-icon>
          <span class="button-text">我的</span>
        </div>
      </footer>
    </div>
  </template>

  <script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const navigateTo = (page) => {
    router.push(`/${page}`)
  }
  </script>

  <style scoped>
  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between; /* 均匀分布 */
    background-color: rgba(240, 244, 248, 0.9); /* 半透明背景 */
    padding: 10px 20px; /* 增加左右内边距 */
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2); /* 更柔和的阴影效果 */
  }

  .footer-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1; /* 使每个项目占据相等的空间 */
    cursor: pointer;
  }

  .footer-icon {
    font-size: 24px; /* 图标大小 */
    color: rgba(63, 81, 181, 0.8); /* 半透明图标颜色 */
  }

  .button-text {
    font-size: 12px; /* 字体大小 */
    margin-top: 4px; /* 图标与文字之间的间距 */
    opacity: 0.8; /* 文字透明度 */
  }

  .separator {
    width: 1px; /* 分隔符宽度 */
    height: 40px; /* 分隔符高度 */
    background-color: rgba(0, 0, 0, 0.1); /* 分隔符颜色 */
  }
  </style>
