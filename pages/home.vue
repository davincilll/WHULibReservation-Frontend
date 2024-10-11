<template>
  <div>
    <v-container class="pa-0 bg-gradient-to-br from-blue-lighten-5 via-teal-lighten-5 to-green-lighten-5" fluid>
    <v-card class="mx-auto" max-width="1200" elevation="0" color="transparent">
      <!-- 顶部标题 -->
      <!-- 筛选建筑和楼层 -->
      <v-card-text>
      <v-row class="mt-1 d-flex align-center">
        <!-- 建筑筛选 -->
    
          <v-select
            v-model="parmars.building"
            :items="buildings"
            item-title="name"
            item-value="value"
            label="选择建筑"
            variant="outlined"
            density="comfortable"
            class="rounded-lg"
            @update:model-value="handleBuildingChange"
          ></v-select>
      

        <!-- 楼层筛选 -->
        
          <v-select
            v-model="parmars.floor"
            :items="floors"
            item-title="label"
            item-value="value"
            label="选择楼层"
            variant="outlined"
            density="comfortable"
            class="rounded-lg"
            :disabled="!parmars.building"
            @update:model-value="handleFloorChange"
          ></v-select>
      </v-row>
    </v-card-text>

      <!-- 卡片列表 -->
      <v-card-text>
        <v-row>
          <v-col
            v-for="(item, index) in paginatedFilteredData"
            :key="index"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="rounded-xl" elevation="2">
              <v-card-item>
              <v-row class="d-flex align-center">
                <!-- 座位信息和时间 -->
                <v-col class="d-flex align-center flex-grow-1">
                  <!-- 座位名称 -->
                  <v-card-title class="text-h6 font-weight-bold pb-2 d-flex align-center">
                    <v-icon icon="mdi-seat" color="teal-darken-1" class="mr-2"></v-icon>
                    <span class="text-truncate room-title">{{ item.Name || '未指定名称' }}</span>
                  </v-card-title>
                </v-col>
                <div class="d-flex justify-space-between align-center">
                  <v-card-subtitle class="d-flex align-center">
                    <v-icon icon="mdi-calendar" color="teal-lighten-1" class="ml-3"></v-icon>
                    {{ today }}
                  </v-card-subtitle>
                  <v-spacer></v-spacer>
                <!-- 查找座位按钮 -->
                <v-col cols="auto">
                  <v-btn 
                    color="teal-darken-1"
                    variant="elevated"
                    @click="handleSeatQuery(item.Id)"
                    class="rounded-lg"
                  >
                    查找座位
                  </v-btn>
                </v-col>
                </div>
              </v-row>
    </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- 分页 -->
      <v-card-actions class="justify-center mt-6">
        <v-pagination
          v-if="paginatedFilteredData.length > 0"
          v-model="currentPage"
          :length="totalPages"
          rounded="circle"
          color="teal-darken-1"
        ></v-pagination>
      </v-card-actions>
    </v-card>
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
      handleFloorChange()
    };
      const handleFloorChange = () => {
      GetApi('/roomQuery', parmars).then((res) => {
      data.value = toRaw(res.data) || []
      // console.log('res.data',res.data)
  })}
  onMounted(() => {
      // 默认选择第一个建筑
        parmars.value.building = buildings.value[0].value;
        handleBuildingChange()
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
.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}
.room-title {
  font-size: 16px;
}
.v-btn {
  margin-left: 95%;
}
</style>