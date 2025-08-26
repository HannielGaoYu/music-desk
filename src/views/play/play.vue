<template>
  <div class="play" @click="handleBack">
    <div class="album"></div>
    <div class="song-word"></div>
    <div class="foot-bar" style="position: fixed; bottom: 0; left: 0; right: 0;width: 100%; height: 60px;">
      <play-bar></play-bar>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

<style scoped lang="less">
  .play {
    position: relative;
    color: #000;
    width: 100%;
    height: 100vh;
    background-color: #f29;
    .album {
      position: absolute;
      left: 10%;
      top: 23%;
      width: 26%;
      aspect-ratio: 1/1;
      background-color: #f23;
    }

  }
</style>