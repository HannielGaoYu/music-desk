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
          style="width: 240px; color:#fff;"
          placeholder="请输入音乐名与歌手名"
          textareaStyle="color: #fff;"
          :prefix-icon="Search"
          size="small"
          color="red"
          @keydown="handleSearchClick"
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
      <div class="exit" @click="handleExit">
        <el-icon :size="fontSize"><Close :color="color"/></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../store/main'

const { type, color, size } = defineProps(["type", "color", "size"])

const fontSize = parseInt(size)
const ipcRenderer = window.ipcRenderer
const text = ref<string>('')
const fullState = ref<boolean>(false)
const router = useRouter()

const mainStore = useMainStore()

const handleBack = () => {
  router.back()
}

const handleNext = () => {
  router.go(1)
}

const handleSearchClick = (e: KeyboardEvent) => {
  if (e.keyCode === 13 || e.keyCode === 100) {
    mainStore.fetchMusicSearchRes(text.value, 100)
    router.push("/main/songs-found")
  }
}

const handleFullScreen = () => {
  fullState.value = !fullState.value
  ipcRenderer.invoke("full-shrink-screen", {state: fullState.value})
}

const handleExit = () => {
  ipcRenderer.invoke("close")
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
      :deep(.el-input__inner) {
        color: #fff;
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