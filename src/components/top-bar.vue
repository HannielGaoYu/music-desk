<template>
  <div class="top-bar">
    <div class="left" v-if="type !== 'play'">
      <div class="back-icon" @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="next" @click="handleNext">
        <el-icon><ArrowRight /></el-icon>
      </div>
      <div class="search">
        <el-input
          v-model="text"
          style="width: 240px"
          placeholder="Please Input"
          :prefix-icon="Search"
          size="small"
          color="red"
        />
      </div>
    </div>
    <div class="left" v-if="type === 'play'">
      <div class="back-icon" @click="handleBack">
        <el-icon :size="fontSize"><ArrowDown :color="color"/></el-icon>
      </div>
    </div>
    <div class="right">
      <el-icon :size="fontSize"><Minus :color="color"/></el-icon>
      <div class="amplify-shrink" @click="handleFullScreen">
        <el-icon :size="fontSize"><CopyDocument :color="color"/></el-icon>
      </div>
      <el-icon :size="fontSize"><Close :color="color"/></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const { type, color, size } = defineProps(["type", "color", "size"])

const fontSize = parseInt(size)
const ipcRenderer = window.ipcRenderer
const text = ref<string>('')
const fullState = ref<boolean>(false)
const router = useRouter()

const handleBack = () => {
  router.back()
}

const handleNext = () => {
  router.go(1)
}

const handleFullScreen = () => {
  fullState.value = !fullState.value
  ipcRenderer.invoke("full-shrink-screen", {state: fullState.value})
}
</script>

<style scoped lang="less">
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .back-icon {
        margin-right: 10px;
      }
      .next {
        margin-right: 20px;
      }
      :deep(.el-input__wrapper) {
        background-color: transparent !important;
      }
    }

    .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .amplify-shrink {
        margin: 0 15px;
      }
    }
  }
</style>