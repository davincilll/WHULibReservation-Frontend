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
          <v-dialog v-model="seatDialog" max-width="800">
          <v-card>
          <v-card-title class="text-h5">座位布局</v-card-title>
          <v-card-text>
          <div class="seat-layout">
          <!-- 根据布局显示座位 -->
          <div
          v-for="seatLayout in layout"
          :key="seatLayout.id"
          class="seat"
          :style="{ top: seatLayout.y + 'px', left: seatLayout.x + 'px' }"
          @click="handleSeatClick(seatLayout)"
          >
          <!-- 获取对应的座位状态和编号 -->
          <v-img :src="getSeatIcon(getSeatStatus(seatLayout.id))" alt="seat" class="seat-icon" ></v-img>
          <!-- 渲染座位编号 -->
          <!-- <div class="seat-number">{{ getSeatNumber(seatLayout.id) }}</div> -->
          </div>
          </div>
          </v-card-text>
      <v-card-actions>
      <v-btn text @click="seatDialog = false">关闭</v-btn>
      </v-card-actions>
      </v-card>
      </v-dialog>
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
    const seats = ref([]); // 座位数据
    const seatDialog = ref(false); // 控制座位弹窗
    const selectedSeat = ref(null); // 记录当前点击的座位
    const layout = ref([]); // 存储布局信息 (id, x, y 坐标)
    const parmars = ref({
      building: '',
      floor: '',
      Ondate:today,
    });
    const parmars1 = ref({
      room: '',
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
      parmars1.value.room = id;
      GetApi('seatQuery', parmars1).then((res) => {
        seats.value = toRaw(res.data) || [];
        seatDialog.value = true;
      });
      layout.value = layouts[id];
    };
    const getSeatIcon = (status) => {
      switch (status) {
        case 'idle_power':
          return '/idle_power.svg';
        case 'idle_both':
          return '/idle_power.svg';
        case 'inuse_power':
          return '/inuse_power.svg';
        case 'inuse_both':
          return '/inuse_power.svg';
        case 'leave':
          return '/leave.svg';
        case 'agreement':
          return '/agreement.svg';
        case 'inuse_computer':
          return '/inuse_computer.svg';
        case 'idle_computer':
          return '/idle_computer.svg';
        case 'noUsre':
          return '/noUsre.svg';
        case 'idle':
          return '/idle.svg';
        case 'usre':
          return '/usre.svg';
        default:
          return '/usre.svg'; // 默认图标
      }
    };
    const getSeatStatus = (id) => {
      // 根据座位ID获取座位状态
      const seat = seats.value.find((s) => s.Id === id);
      return seat ? seat.Status : 'unknown'; // 如果找不到座位，返回未知状态
    };
        // 处理点击座位事件
    const handleSeatClick = (seat) => {
      selectedSeat.value = seat; // 可以在这里处理座位点击事件，比如展示详细信息
      console.log('Seat clicked:', seat);
    };
    // 计算总页数
    const totalPages = computed(() => Math.ceil(data.value.length / itemsPerPage));

    // 获取当前页的数据 (通过分页)
    const paginatedFilteredData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return data.value.slice(start, end);
    });
    let isInitialized = false;
    let isManualFloorChange = false;
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
        isManualFloorChange = false;
        parmars.value.floor = floors.value[0].value;
      }
            // 如果是初始化阶段，则允许发起请求
        if (!isInitialized) {
          handleFloorChange();
        }
    };
    const handleFloorChange = () => {
    if (!isInitialized|| isManualFloorChange) {
        GetApi('/roomQuery', parmars).then((res) => {
            data.value = toRaw(res.data) || [];
        });
    } 
};
  onMounted(() => {
      // 默认选择第一个建筑
        parmars.value.building = buildings.value[0].value;
        handleBuildingChange()
        isInitialized = true;
    });
    const layouts = {
  '15': [
    { id: '1', x: 50, y: 50 },
    { id: '3', x: 150, y: 50 },
    { id: '7', x: 50, y: 150 },
    { id: '4', x: 250, y: 50 },
    { id: '6', x: 350, y: 50 },
    { id: '10', x: 150, y: 150 },
    { id: '11', x: 250, y: 150 },
    { id: '5', x: 350, y: 150 },
    { id: '12', x: 50, y: 250 },
    { id: '7', x: 150, y: 250 },
    { id: '8', x: 250, y: 250 },
  ]
};

    
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
      seatDialog,
      handleSeatQuery,
      handleSeatClick,
      getSeatIcon,
      getSeatStatus,
      layout,
      seats,
      selectedSeat,
  

      

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
.seat-layout {
  position: relative;
  width: 100%;
  height: 400px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  margin-top: 20px;
  border-radius: 8px;
}

.seat {
  position: absolute;
  cursor: pointer;
}

.seat-icon {
  width: 24px;
  height: 24px;
}
</style>