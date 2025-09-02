<template>
  <div class="top-bar">
    <div class="left">
      <div class="back-icon">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="next">
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
    <div class="right">
      <el-icon><Minus /></el-icon>
      <div class="amplify-shrink">
        <el-icon><CopyDocument /></el-icon class="amplify-shrink">
      </div>
      <el-icon><Close /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const text = ref<string>('')
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