<template>
  <v-container class="pa-0">
    <v-card class="mx-auto" max-width="1200" elevation="0" color="transparent">
      <v-card-title>{{ selectedRoomName }} 座位布局</v-card-title>

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
    </v-card>
  </v-container>
</template>

<script>
import { layouts } from '~/data/layouts';
export default {
    setup() {
    const route = useRoute();
    const roomId = route.params.id;
    const selectedRoomName = route.query.name;
    const today = new Date().toISOString().substring(0, 10)
    const parmars1 = ref({
      room: roomId,
      date:today,
    });

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

    //座位相关
    const seats = ref([]); // 座位数据
     // 模拟点击按钮查找座位
     const handleSeatQuery = async() => {
      parmars1.value.room = roomId+'';
      seats.value = [];
      const { data } = await GetApi('seatQuery', parmars1.value);
        seats.value = data || [];
        layout.value = layouts[roomId];
    };
    // 处理点击座位事件
    const handleSeatClick = (seat) => {
      selectedSeat.value = seat; // 可以在这里处理座位点击事件，比如展示详细信息
      console.log('Seat clicked:', seat);
    };
    onMounted(() => {
      handleSeatQuery();
    });
    return {
    seatLegends,
    handleTouchStart,
    handleTouchMove,
    handleWheelZoom,
    formatSeatNumber,
    getSeatIcon,
    getSeatStatus,
    handleSeatQuery,
    handleSeatClick,
    selectedRoomName,
    selectedSeat,
    layout,
    scale,
    }
}  
}
</script>
<style scoped>
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
  justify-content: flex-start;
  padding: 0 10px;
  gap: 10px;
}

.legend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-basis: 18%;
}

.legend-icon {
  width: 14px;
  height: 14px;
  margin-bottom: 5px;
}

.legend-text {
  font-size: 12px;
  color: #333;
  text-align: center;
}
</style>