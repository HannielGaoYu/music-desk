<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
  .app {
    color: #000;
    border-radius: 200px;
  }

</style>