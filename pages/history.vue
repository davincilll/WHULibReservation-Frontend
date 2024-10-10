<template>
  <div>
    <v-container>
      <h3 >历史预约界面</h3>

      <!-- 卡片列表布局 -->
      <v-row>
        <v-col
          v-for="(item, index) in paginatedData"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="mx-auto" :class="['max-width-xs', 'max-width-sm', 'max-width-md']">
            <v-card-title class="card-header">
              <span class="seat-info">{{ item.seat || '未指定座位' }}</span>
              <span :class="['status', getStatusClass(item.status)]">{{ item.status }}</span>
            </v-card-title>

            <v-card-text class="card-body">
              <span class="time-range">{{ item.time_range || '时间未定' }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 分页组件 -->
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-pagination
            v-model:="currentPage "
            :length="totalPages"
            class="my-4 custom-pagination"
            align-self="center"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 模拟从后端获取的数据
const rawData = ref([
  {
    seat: "信息分馆3层中区自主学习区138号",
    status: "使用中",
    time_range: "今天 14:37 -- 17:30"
  },
  {
    seat: "信息分馆3层中区自主学习区137号",
    status: "已完成",
    time_range: "昨天 15:48 -- 17:30"
  },
  {
    seat: "信息分馆3层中区自主学习区137号",
    status: "已完成",
    time_range: "昨天 09:46 -- 13:30"
  },
  {
    seat: "信息分馆3层中区自主学习区137号",
    status: "已结束使用",
    time_range: "2024-09-21 10:50 -- 22:00"
  },
  {
    seat: "",
    status: "未知状态",
    time_range: ""
  }
])

// 分页逻辑
const itemsPerPage = 4 // 每页显示条目数
const currentPage = ref(1) // 当前页码

// 计算总页数
const totalPages = computed(() => Math.ceil(rawData.value.length / itemsPerPage))

// 获取当前页的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return rawData.value.slice(start, start + itemsPerPage)
})

// 根据状态返回不同的颜色类
const getStatusClass = (status) => {
  switch (status) {
    case "使用中":
      return "status-active"
    case "已完成":
      return "status-complete"
    case "已结束使用":
      return "status-ended"
    case "未知状态":
      return "status-unknown"
    default:
      return ""
  }
}
</script>

<style scoped>
.my-4 {
  margin: 16px 0;
}

.v-card {
  padding: 8px;
  font-size: 0.9rem; /* 减小字体大小以减少卡片高度 */
}

/* 最大宽度控制 */
.max-width-xs {
  max-width: 100%;
}

.max-width-sm {
  max-width: 100%;
}

.max-width-md {
  max-width: 100%;
}

/* 不同屏幕的宽度控制 */
@media (min-width: 600px) {
  .max-width-xs {
    max-width: 90%;
  }
}

@media (min-width: 960px) {
  .max-width-sm {
    max-width: 80%;
  }
}

@media (min-width: 1264px) {
  .max-width-md {
    max-width: 70%;
  }
}

/* 卡片头部布局 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-weight: bold;
  padding-bottom: 8px;
}

/* 座位信息左上显示 */
.seat-info {
  display: block;
  width: 70%;
  font-size: 0.85rem;
}

/* 状态信息在右边显示 */
.status {
  display: block;
  font-size: 0.85rem;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
}

/* 时间范围在左下方 */
.card-body {
  display: flex;
  justify-content: flex-start;
}

.time-range {
  font-size: 0.8rem;
  color: #666;
}

/* 不同状态的颜色 */
.status-active {
  background-color: #4caf50; /* 使用中: 绿色 */
  color: white;
}

.status-complete {
  background-color: #2196f3; /* 已完成: 蓝色 */
  color: white;
}

.status-ended {
  background-color: #ff9800; /* 已结束使用: 橙色 */
  color: white;
}

.status-unknown {
  background-color: #9e9e9e; /* 未知状态: 灰色 */
  color: white;
}
.custom-pagination .v-pagination {
  font-size: 1.5rem; /* 调整字体大小 */
}

.custom-pagination .v-pagination .v-pagination__item {
  max-width: 20px; /* 设置每个分页按钮的最小宽度 */
  max-height: 20px; /* 设置每个分页按钮的最小高度 */
}
</style>