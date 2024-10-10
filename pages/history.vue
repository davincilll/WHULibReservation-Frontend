<template>
  <div>
    <v-container>
      <h3 class="section-title">历史预约界面</h3>
      <v-row>
        <v-col
          v-for="(item, index) in paginatedData"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <!-- 卡片设计 -->
          <v-card class="mx-auto card-container">
  <v-card-title class="card-header">
    <span class="seat-info">{{ item.SeatTitle || '未指定座位' }}</span>
  </v-card-title>

  <v-card-text class="card-body d-flex justify-space-between align-center">
    <div class="d-flex align-center">
      <span class="time-range">{{ item.Period || '时间未定' }}</span>
    </div>
    <v-chip :color="getStatusColor(item.HistoryType)" small label>
      {{ item.HistoryType }}
    </v-chip>
  </v-card-text>
</v-card>

        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <!-- 分页按钮 -->
          <v-pagination
            v-model="currentPage"
            v-if="data.length > 0"
            :length="totalPages"
            class="my-4 custom-pagination"
            align-self="center"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref, toRaw, computed, onMounted } from 'vue'

export default {
  setup() {
    const data = ref([])
    const itemsPerPage = 4 // 每页显示条目数
    const currentPage = ref(1) // 当前页码

    const handleLogin = () => {
      GetApi('/history', {}).then((res) => {
        data.value = toRaw(res.data) || []
      })
    }
    onMounted(() => {
      handleLogin()
    })

    // 计算页总数
    const totalPages = computed(() => Math.ceil(data.value.length / itemsPerPage))

    // 获取当前页的数据
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      return data.value.slice(start, start + itemsPerPage)
    })

    // 根据状态返回不同的颜色类

    const getStatusColor = (status) => {
      const statusColors = {
        "已完成": "success",
        "早退": "warning",
        "失约": "error",
        "已取消": "grey",
        "已结束使用": "orange",
      };
      return statusColors[status] || "blue-grey";}

    return {
      data,
      handleLogin,
      currentPage,
      totalPages,
      paginatedData,
      getStatusColor,
    }
  },
}
</script>

<style scoped>
/* 标题样式 */
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

/* 卡片容器 */
.card-container {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 16px;
}

.card-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* 卡片头部布局 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  padding-bottom: 8px;
}

/* 座位信息左上显示 */
.seat-info {
  display: inline-block;
  font-size: 0.9rem;
  color: #666;
  flex: 1;
}

/* 状态信息在右边显示 */
.status {
  display: inline-block;
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 16px;
  text-align: center;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

/* 时间范围在左下方 */
.card-body {
  justify-content: flex-start;
  font-size: 0.85rem;
  color: #999;
}

/* 状态样式 */
.status-complete {
  background-color: #4caf50;
  color: white;
}

.status-leave-early {
  background-color: #ffeb3b;
  color: black;
}

.status-no-show {
  background-color: #f44336;
  color: white;
}

.status-cancelled {
  background-color: #9e9e9e;
  color: white;
}

.status-ended {
  background-color: #ff9800;
  color: white;
}

.status-unknown {
  background-color: #607d8b;
  color: white;
}

/* 分页样式 */
.custom-pagination {
  display: flex;
  justify-content: center;
}

.custom-pagination .v-pagination__item {
  font-size: 1rem;
  width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 50%;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.custom-pagination .v-pagination__item:hover {
  background-color: #3f51b5;
  color: white;
  transform: translateY(-2px);
}

.custom-pagination .v-pagination__item--active {
  background-color: #3f51b5;
  color: white;
}

/* 响应式布局 */
@media (min-width: 600px) {
  .card-container {
    max-width: 90%;
  }
}

@media (min-width: 960px) {
  .card-container {
    max-width: 80%;
  }
}

@media (min-width: 1264px) {
  .card-container {
    max-width: 70%;
  }
}
</style>