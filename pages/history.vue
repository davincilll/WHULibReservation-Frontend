<template>
  <div>
    <v-container class="pa-0 bg-gradient-to-br from-blue-lighten-5 via-indigo-lighten-5 to-purple-lighten-5" fluid>
    <v-card class="mx-auto" max-width="600" elevation="0" color="transparent">

      <v-card-text class="pa-4">
        <v-sheet color="blue-lighten-4" class="rounded-lg pa-4 d-flex justify-space-between align-center">
          <div class="text-indigo-darken-3 font-weight-medium">
            共 {{ dataCount }} 条预约记录
          </div>
          <v-select
            v-model="selectedHistoryType"
            :items="historyTypes"
            label="筛选"
            class="custom-select"
            hide-details
            density="compact"
            variant="outlined"
            style="max-width: 150px;"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="mdi-filter-variant" color="indigo-darken-1"></v-icon>
            </template>
          </v-select>
        </v-sheet>
      </v-card-text>

      <v-card-text class="pa-4">
        <v-row>
          <v-col
            v-for="(item, index) in paginatedFilteredData"
            :key="index"
            cols="12"
          >
            <v-card class="rounded-xl" elevation="1">
              <v-card-item>
    <v-row no-gutters class="d-flex align-center">
      <!-- 座位标题和时间 -->
      <v-col class="flex-grow-1">
        <v-card-title class="font-weight-bold pb-1 d-flex align-center">
          <v-icon style="font-size: 24px;" icon="mdi-map-marker" color="indigo-lighten-1"></v-icon>
          <span class="text-truncate seat-title">{{ item.SeatTitle || '未指定座位' }}</span>
        </v-card-title>

        <!-- 时间和状态在同一行 -->
        <div class="d-flex justify-space-between align-center">
          <v-card-subtitle class="d-flex align-center">
            <v-icon icon="mdi-calendar" color="indigo-lighten-1" class="mr-2"></v-icon>
            <span class="time-range">{{ item.Period || '时间未定' }}</span>
          </v-card-subtitle>

          <!-- 状态芯片 -->
          <v-chip
            :color="getStatusColor(item.HistoryType)"
            text-color="white"
            class="font-weight-medium status-chip"
          >
            {{ item.HistoryType }}
          </v-chip>
        </div>
      </v-col>
    </v-row>
  </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Pagination -->
      <v-card-actions class="justify-center ">
        <v-pagination
          v-if="paginatedFilteredData.length > 0"
          v-model="currentPage"
          :length="totalPages"
          rounded="circle"
          class="mb-10"
        ></v-pagination>
      </v-card-actions>
    </v-card>
  </v-container>
  </div>
</template>


<script>
import { ref, toRaw, computed, onMounted } from 'vue'

export default {
  setup() {
    const data = ref([]) // 全部数据
    const itemsPerPage = 6 // 每页显示条目数
    const currentPage = ref(1) // 当前页码
    const selectedHistoryType = ref(null) // 筛选的状态

    const historyTypes = ["已完成", "早退", "失约", "已取消", "已结束使用","使用中"] // 所有状态

    const handleLogin = () => {
      GetApi('/history', {}).then((res) => {
        data.value = toRaw(res.data) || []
      })
    }
    
    onMounted(() => {
      handleLogin()
    })

    // 计算数据总数
    const dataCount = computed(() => data.value.length)

    // 根据筛选条件获取符合的数据
    const filteredData = computed(() => {
      // 如果没有选定筛选条件，则返回所有数据
      if (!selectedHistoryType.value) {
        return data.value
      }
      // 根据筛选条件筛选
      return data.value.filter(item => item.HistoryType === selectedHistoryType.value)
    })

    // 计算页总数
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

    // 获取当前页的数据 (通过分页)
    const paginatedFilteredData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredData.value.slice(start, end)
    })

    // 根据状态返回不同的颜色类
    const getStatusColor = (status) => {
      const statusColors = {
        "已完成": "success",
        "早退": "warning",
        "失约": "error",
        "已取消": "grey",
        "已结束使用": "orange",
      }
      return statusColors[status] || "blue-grey"
    }

    return {
      data,
      dataCount,
      currentPage,
      totalPages,
      paginatedFilteredData,
      selectedHistoryType,
      historyTypes,
      getStatusColor,
    }
  },
}

</script>

<style scoped>
.v-card {
  transition: transform 0.3s ease;
}
.v-card:hover {
  transform: translateY(-4px);
}
.seat-title {
  font-size: 16px;
}

/* 时间部分字体调整 */

/* 状态芯片的样式 */
.status-chip {
  font-size: 14px;
  margin-left: 8px;
}

/* 确保卡片内容在小屏幕上也能正常显示 */
@media (max-width: 600px) {
  .time-range {
    font-size: 12px;
  }

  .status-chip {
    font-size: 12px;
  }
}
</style>