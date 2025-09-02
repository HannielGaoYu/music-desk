<template>
  <div class="app">
    <!-- <router-view v-slot="{ Component }"> -->
      <!-- <keep-alive>
        <component :is="Component"/>
      </keep-alive> -->
    <!-- </router-view> -->
     <router-view></router-view>
    <div class="foot-bar" style="position: fixed; left: 0; bottom: 0; width: 100%; height: 60px;">
      <play-bar></play-bar>
    </div>
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