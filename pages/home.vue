<template>
  <div>
    <!-- 主内容 -->
    <v-container class="pa-0">
      <div class="header-container">
        <h3 class="section-title">预约界面</h3>
      </div>

      <!-- 筛选建筑和楼层 -->
      <v-row class="filter-container mb-4" align="center">
        <v-col cols="6" class="d-flex align-center">
          <v-select
            v-model="parmars.building"
            :items="buildings"
            item-title="name"
            item-value="value"
            label="选择建筑"
            outlined
            class="custom-select"
            dense
            @update:modelValue="handleBuildingChange"
          ></v-select>
        </v-col>
        <v-col cols="6" class="d-flex align-center">
          <v-select
            v-model="parmars.floor"
            :items="floors"
            item-title="label"
            item-value="value"
            label="选择楼层"
            outlined
            class="custom-select"
            dense
            :disabled="!parmars.building"
            @update:modelValue="handleFloorChange"
          ></v-select>
        </v-col>
      </v-row>

      <!-- 卡片列表 -->
      <v-row>
        <v-col
          v-for="(item, index) in paginatedFilteredData"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="mx-auto card-container">
            <v-card-title class="card-header">
              <span class="seat-info">{{ item.Name || '未指定名称' }}</span>
            </v-card-title>
            <v-card-text class="card-body d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <span class="time-range">{{ today }}</span>
            </div>
          </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="handleSeatQuery(item.Id)">
                查找座位
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- 分页 -->
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-pagination
            v-model="currentPage"
            v-if="paginatedFilteredData.length > 0"
            :length="totalPages"
            class="mb-12 custom-pagination"
            align-self="center"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref, computed, toRaw } from 'vue';

export default {
  setup() {
    const data = ref([])
    const today = new Date().toISOString().substring(0, 10)
    const itemsPerPage = 4; // 每页显示条目数
    const currentPage = ref(1); // 当前页码

    const parmars = ref({
      building: '',
      floor: '',
      Ondate:today,
    });

    const buildings = ref([
      { name: '信息分馆', value: '1' },
      { name: '工学分馆', value: '2' },
      { name: '医学分馆', value: '3' },
      { name: '总馆', value: '4' },
      { name: '信息分馆考试季24小时', value: '7' },
      { name: '主馆考试季24小时', value: '13' },
    ]);

    const floors = ref([]);

    // 模拟点击按钮查找座位
    const handleSeatQuery = (id) => {
      console.log('查询座位 ID:', id);
      // 在此处添加查询座位的逻辑
    };

    // 计算总页数
    const totalPages = computed(() => Math.ceil(data.value.length / itemsPerPage));

    // 获取当前页的数据 (通过分页)
    const paginatedFilteredData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return data.value.slice(start, end);
    });

    // 根据建筑类型更新楼层
    const handleBuildingChange = () => {
      let floorOptions = [];
      switch (parmars.value.building) {
        case '1': // 信息分馆
          floorOptions = [
            { label: '一层', value: '1' },
            { label: '二层', value: '2' },
            { label: '三层', value: '3' },
            { label: '四层', value: '4' },
            { label: '五层', value: '5' },
          ];
          break;
        case '2': // 工学分馆
          floorOptions = [
            { label: '一层', value: '1' },
            { label: '二层', value: '2' },
            { label: '三层', value: '3' },
          ];
          break;
        case '3': // 医学分馆
          floorOptions = [
            { label: '二层', value: '2' },
            { label: '三层', value: '3' },
          ];
          break;
        case '4': // 总馆
          floorOptions = [
            { label: '一层', value: '1' },
            { label: '二层', value: '2' },
            { label: '三层', value: '3' },
            { label: '四层', value: '4' },
            { label: '五层', value: '5' },
            { label: '六层', value: '6' },
            { label: '七层', value: '7' },
          ];
          break;
        case '7': // 信息分馆考试季24小时
          floorOptions = [{ label: '一层', value: '1' }];
          break;
        case '13': // 主馆考试季24小时
          floorOptions = [{ label: '一层', value: '1' }];
          break;
        default:
          floorOptions = [];
      }
      floors.value = floorOptions;
      if (floors.value.length > 0) {
        parmars.value.floor = floors.value[0].value;
      }
    };
      const handleFloorChange = () => {
      GetApi('/roomQuery', parmars).then((res) => {
      data.value = toRaw(res.data) || []
      // console.log('res.data',res.data)
  })}
  onMounted(() => {
      // 默认选择第一个建筑
        parmars.value.building = buildings.value[0].value;
        handleBuildingChange();
        handleFloorChange()
    });
    return {
      data,
      today,
      currentPage,
      totalPages,
      paginatedFilteredData,
      parmars,
      buildings,
      floors,
      handleSeatQuery,
      handleBuildingChange,
      handleFloorChange,
    };
  },
};
</script>

<style scoped>
/* 筛选栏样式 */
.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f4f4f4;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.custom-select {
  max-width: 180px;
  min-width: 150px;
  width: 100%;
}

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

.v-btn {
  margin-left: auto;
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