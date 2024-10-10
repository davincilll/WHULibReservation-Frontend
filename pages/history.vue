<template>
  <div>
    <v-container>
      <h3 >历史预约界面</h3>
     <v-row>
       <v-col
         v-for="(item, index) in paginatedData"
         :key="index"
         cols="12"
         sm="6"
         md="4">
         <v-card class="mx-auto" :class="['max-width-xs', 'max-width-sm', 'max-width-md']">
           <v-card-title class="card-header">
             <span class="seat-info">{{ item.SeatTitle || '未指定座位' }}</span>
             <span :class="['status', getStatusClass(item.HistoryType)]">{{ item.HistoryType }}</span>
           </v-card-title>

           <v-card-text class="card-body">
             <span class="time-range">{{ item.Period || '时间未定' }}</span>
           </v-card-text>
         </v-card>
       </v-col>
     </v-row>
     <v-row justify="center">
       <v-col cols="12" sm="8" md="6">
         <v-pagination
           v-model:="currentPage "
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
import { ref,toRaw } from 'vue'
export default {
  setup() {
    const data = ref([])
    const itemsPerPage = 4 // 每页显示条目数
    const currentPage = ref(1) // 当前页码
    
    const handleLogin =  () => {
     GetApi('/history', {}).then(res => {
      data.value = toRaw(res.data)  || [];
    });
    };
    onMounted(() => {
      handleLogin()
    })


//计算页总数
    const totalPages = computed(
      () => Math.ceil(data.value.length / itemsPerPage)
 
    )

// 获取当前页的数据
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      return data.value.slice(start, start + itemsPerPage)
    })

//根据状态返回不同的颜色类
const getStatusClass = (status) => {
  switch (status) {
    case "已完成":
      return "status-complete";
    case "早退":
      return "status-leave-early";
    case "失约":
      return "status-no-show";
    case "已取消":
      return "status-cancelled";
    case "已结束使用":
      return "status-ended";
    default:
      return "status-unknown"; // 如果状态不匹配，返回未知状态的类
  }
};
    return {
      data,
      handleLogin,
      currentPage,
      totalPages,
      paginatedData,
      getStatusClass,
    }
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
/* 不同状态颜色样式 */
.status-complete {
  background-color: #4caf50; /* 已完成: 绿色 */
  color: white;
}

.status-leave-early {
  background-color: #ffeb3b; /* 早退: 黄色 */
  color: black;
}

.status-no-show {
  background-color: #f44336; /* 失约: 红色 */
  color: white;
}

.status-cancelled {
  background-color: #9e9e9e; /* 已取消: 灰色 */
  color: white;
}

.status-ended {
  background-color: #ff9800; /* 已结束使用: 橙色 */
  color: white;
}

.status-unknown {
  background-color: #607d8b; /* 未知状态: 深灰蓝 */
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
