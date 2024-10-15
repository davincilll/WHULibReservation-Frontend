<template>
  <v-container>
    <v-card class="mx-auto" max-width="300">
      <v-list>
        <v-list-item
            v-for="item in items"
            :key="item.id"
            @click="openDialog(item)"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
        <v-divider v-if="items.length > 1"></v-divider>
      </v-list>
    </v-card>

    <!-- 弹窗 -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>
          <span class="headline">{{ selectedItem?.name }}</span>
        </v-card-title>
        <v-card-text>
          您正在查看: {{ selectedItem?.name }}
          <br />
          <!-- 你可以在这里添加更多信息 -->
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog">关闭</v-btn>
          <v-btn color="primary" @click="navigateTo(selectedItem?.id)">前往</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const dialog = ref(false);


const items = ref([
  { name: '常用座位', id: '/common-seat' },
  { name: '离开托管', id: '/trusteeship' },
  { name: '智能预约', id: '/smart-reserve' },
  { name: '定时预约', id: '/reserve-schedule' }
]);

const selectedItem = ref(items[0]);

const openDialog = (item) => {
  selectedItem.value = item;
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const navigateTo = (route) => {
  if (route) {
    router.push(route);
    closeDialog(); // 关闭弹窗
  }
};
</script>

<style scoped>
.v-list-item {
  cursor: pointer; /* 鼠标悬停时显示为手指 */
}
</style>
