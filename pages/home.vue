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
            item-value="value"
            item-title="name"
            label="选择建筑"
            variant="outlined"
            density="comfortable"
            class="rounded-lg"
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
  <v-pagination
    v-show="paginatedFilteredData.length > 0"
    v-model="currentPage"
    :length="totalPages"
    rounded="circle"
    color="teal-darken-1"
    class="mb-10"
  ></v-pagination>

    </v-card>
    <v-dialog v-model="seatDialog" max-width="800">
        <v-card>
          <v-card-title class="text-h5">{{ selectedRoomName}}座位布局</v-card-title>
          <div class="legend">
            <div class="legend-item" v-for="legend in seatLegends" :key="legend.status">
              <v-img :src="legend.icon" alt="状态图标" class="legend-icon"></v-img>
              <span class="legend-text">{{ legend.description }}</span>
            </div>
          </div>
          <v-card-text>
            <div
              class="seat-layout"
              @wheel="handleWheelZoom"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
            >
              <!-- 根据布局显示座位 -->
              <div
                v-for="seatLayout in layout"
                :key="seatLayout.id"
                class="seat"
                :style="{ top: seatLayout.y * scale + 'px', left: seatLayout.x * scale + 'px', transform: 'scale(' + scale + ')' }"
                @click="handleSeatClick(seatLayout)"
              >
                <!-- 座位状态图标 -->
                <v-img :src="getSeatIcon(getSeatStatus(seatLayout.id))" alt="seat" class="seat-icon"></v-img>
                
                <!-- 座位编号 -->
                <div class="seat-number">{{ formatSeatNumber(seatLayout.id) }}</div>
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
    //分页以及数据显示相关
    const today = new Date().toISOString().substring(0, 10)
    const itemsPerPage = 4; // 每页显示条目数
    const currentPage = ref(1); // 当前页码
    const seatDialog = ref(false); // 控制座位弹窗
    const selectedRoomName = ref('');
    const selectedSeat = ref(null); // 记录当前点击的座位
    const layout = ref([]); // 存储布局信息 (id, x, y 坐标)
    const scale = ref(1); // 缩放比例
    const seatLegends = ref([
      { status: 'idle', icon: '/idle.svg', description: '空闲' },
      { status: 'inuse', icon: '/usre.svg', description: '使用中' },
      { status: 'leave', icon: '/leave.svg', description: '暂离' },
      { status: 'agreement', icon: '/agreement.svg', description: '已预约' },
      { status: 'idle_computer', icon: '/idle_computer.svg', description: '空闲(有电脑)' },
      { status: 'inuse_computer', icon: '/inuse_computer.svg', description: '使用中(有电脑)' },
      { status: 'inuse_power', icon: '/inuse_power.svg', description: '使用中(有电源)' },
      { status: 'idle_power', icon: '/idle_power.svg', description: '空闲(有电源)' },
      { status: 'noUsre', icon: '/noUsre.svg', description: '无法使用' },
    ]);
    const initialDistance = ref(0); // 双指缩放的初始距离
    const handleTouchStart = (event) => {
      if (event.touches.length === 2) {
        const [touch1, touch2] = event.touches;
        const distance = Math.sqrt(
          Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2)
        );
        initialDistance.value = distance;
      }
    };
    const handleTouchMove = (event) => {
      if (event.touches.length === 2) {
        const [touch1, touch2] = event.touches;
        const distance = Math.sqrt(
          Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2)
        );
        const scaleFactor = distance / initialDistance.value;
        scale.value = Math.min(Math.max(scale.value * scaleFactor, 0.5), 3); // 限制缩放范围
        initialDistance.value = distance;
      }
    };
    // 鼠标滚轮缩放事件处理
    const handleWheelZoom = (event) => {
      const zoomFactor = 0.1; // 缩放系数
      if (event.deltaY < 0) {
        scale.value = Math.min(scale.value + zoomFactor, 3); // 放大
      } else {
        scale.value = Math.max(scale.value - zoomFactor, 0.5); // 缩小
      }
    };
    // 模拟点击按钮查找座位
    const handleSeatQuery = (id) => {
      parmars1.value.room = id;
      GetApi('seatQuery', parmars1).then((res) => {
        seats.value = toRaw(res.data) || [];
        seatDialog.value = true;
      });
      layout.value = layouts[id];
      selectedRoomName.value = getRoomName(id);
    };
    // 格式化座位编号
    const formatSeatNumber = (id) => {
      return id.toString().padStart(3, '0');
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
      const seat = seats.value.find((s) => s.SeatNumber=== Number(id));
      return seat ? seat.Status : 'unknown'; // 如果找不到座位，返回未知状态
    };
    const getRoomName = (id)=>{
      const room = data.value.find((s) => s.Id=== Number(id));
      return room.Name
    }
    // 计算总页数
    const totalPages = computed(() => Math.ceil(data.value.length / itemsPerPage));
    // 获取当前页的数据 (通过分页)
    const paginatedFilteredData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return data.value.slice(start, end);
    });
    const layouts = {
  '15': [
    { id: '1', x: 50, y: 25 },
    { id: '3', x: 165, y: 25 },
    { id: '2', x: 110, y: 75 },
    { id: '9', x: 865, y: 225 },
    { id: '4', x: 515, y: 25 },
    { id: '6', x: 635, y: 25 },
    { id: '10', x: 285, y: 225 },
    { id: '11', x: 345, y: 175 },
    { id: '5', x: 575, y: 75 },
    { id: '12', x: 400, y: 225 },
    { id: '7', x: 750, y: 225 },
    { id: '8', x: 805, y: 175 },
  ]
};

    const test = (value) => {
      console.log(value)
    }
    //建筑相关
    const data = ref([])
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
    
    const handleBuildingChange = async(flag) => {
      console.log("handleBuildingChange执行了")
      if (flag) {
        
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
            { label: '四层', value: '4' },
            { label: '五层', value: '5' },
          ];
          break;
        case '3': // 医学分馆
          floorOptions = [
            { label: '二层', value: '2' },
            { label: '三层', value: '3' },
            { label: '四层', value: '4' },
            { label: '五层', value: '5' },
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

      parmars.value.floor = floors.value[0].value; // 设置为默认
      await handleFloorChange()
      }else{
        await handleFloorChange()
      }
           
    };
    
    //房间相关
    const parmars1 = ref({
      room: '',
      Ondate:today,
    });
    const floors = ref([]);
    const handleFloorChange = async() => {
        data.value = [];
        await GetApi('/roomQuery', parmars.value,{}).then((res) => {
            data.value = res.data || [];
        });
        
      return
    };

    
    //座位相关
    const seats = ref([]); // 座位数据
    // 处理点击座位事件
    const handleSeatClick = (seat) => {
      selectedSeat.value = seat; // 可以在这里处理座位点击事件，比如展示详细信息
      console.log('Seat clicked:', seat);
    };
  

  onMounted(() => {
      // 默认选择第一个建筑
        parmars.value.building = buildings.value[0].value;
        handleBuildingChange(true)
       
              watch(
        [() => parmars.value.building, () => parmars.value.floor],
        ([newBuilding, newFloor], [oldBuilding, oldFloor]) => {
          // 在这里处理 building 和 floor 的变化
          if (newBuilding !== oldBuilding) {
            handleBuildingChange(true); // 处理建筑物变化
          }else if (newFloor !== oldFloor && oldFloor !== undefined && parmars.value.building !== '7'&& parmars.value.building !== '13') {
            handleBuildingChange(false); // 处理楼层变化
          }
        }
      );


    });


    
    return {
      data,
      test,
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
      scale,
      handleWheelZoom,
      handleTouchStart,
      handleTouchMove,
      formatSeatNumber,
      seatLegends, 
      getRoomName,
      selectedRoomName,
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
  overflow: scroll;
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
.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* 图例项从左到右排列 */
  padding: 0 10px; /* 控制整个图例区域的左右边距 */
  gap: 10px; /* 控制图例项之间的间距 */
}

.legend-item {
  display: flex;
  flex-direction: column;
  align-items: center; /* 图标和文字居中对齐 */
  flex-basis: 18%; /* 每个图例项占据 18% 的宽度，确保每行最多显示五个 */
}

.legend-icon {
  width: 14px;
  height: 14px;
  margin-bottom: 5px; /* 图标和文字之间的间距 */
}

.legend-text {
  font-size: 12px; /* 控制文字大小 */
  color: #333;
  text-align: center; /* 文字居中对齐 */
}

@media (max-width: 600px) {
  .legend-item {
    flex-basis: 15%; /* 在小屏幕上每行最多显示两个图例 */
  }
}
</style>